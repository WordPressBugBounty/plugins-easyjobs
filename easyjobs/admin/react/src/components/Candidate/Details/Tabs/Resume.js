import React, { useState, useRef, useEffect, useCallback } from 'react';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-toastify';
import { Icon } from '../icons';
import { RESUME_SVG } from '../emptyIllustrations';
import { loadPdfJs } from '../../../../util/pdfLoader';
import { streamFile } from '../../../../util/streamFile';
import { safeUrl } from '../../../Messages/sanitize';

/**
 * Resume tab — pdf.js viewer with a custom toolbar (page nav, zoom, rotate,
 * print, download, open-in-new-tab) + tip line, matching the app-end design.
 *
 * The candidate's resume lives on a cross-origin media disk, so pdf.js can't
 * fetch it directly (CORS). We render it through the same-origin proxy
 * `easyjobs_stream_resume`. If pdf.js fails to load/render, we fall back to a
 * native <iframe> so the resume is still viewable.
 */
// 100% reference render width (matches the app's stageWidth) — the page is
// rasterised at this width at 100%, and fit-to-width/page are computed from it.
const FIT_WIDTH = 720;

/**
 * Highlights bar — a quick résumé summary built from the candidate's real data
 * (experience, highest education, current role). Faithful port of the app's
 * collapsible highlights bar at the top of the Resume tab.
 */
const Highlights = ({ candidate }) => {
  const [collapsed, setCollapsed] = useState(false);
  const user = candidate?.user || {};
  const employments = user?.employments || [];
  const educations = user?.educations || [];

  const facts = [];

  const totalExp = candidate?.total_experience ?? user?.experience;
  const roleCount = employments.length;
  if ((totalExp && Number(totalExp) > 0) || roleCount) {
    const parts = [];
    if (totalExp && Number(totalExp) > 0) {
      const years = Number(totalExp);
      parts.push(
        `${years} ${
          years === 1 ? __('year', 'easyjobs') : __('years', 'easyjobs')
        }`,
      );
    }
    if (roleCount) {
      parts.push(
        `${roleCount} ${
          roleCount === 1 ? __('role', 'easyjobs') : __('roles', 'easyjobs')
        }`,
      );
    }
    facts.push({
      label: __('Experience', 'easyjobs'),
      value: parts.join(' · '),
    });
  }

  // Highest education — most recent by passing year.
  let edu = '';
  if (educations.length) {
    const top = educations
      .slice()
      .sort(
        (a, b) =>
          (parseInt(b.passing_year, 10) || 0) -
          (parseInt(a.passing_year, 10) || 0),
      )[0];
    const bits = [];
    if (top.level_name) bits.push(top.level_name);
    if (top.degree_name && top.degree_name !== top.level_name)
      bits.push(top.degree_name);
    if (!bits.length && top.academy_name) bits.push(top.academy_name);
    edu = bits.join(' · ');
  }
  if (edu)
    facts.push({ label: __('Highest education', 'easyjobs'), value: edu });

  // Current role — explicit field, else the current/most-recent employment.
  let role = candidate?.current_position;
  if (!role && employments.length) {
    role = (
      employments.find((e) => e.is_currently_working || !e.to) || employments[0]
    )?.designation;
  }
  if (role) facts.push({ label: __('Current role', 'easyjobs'), value: role });

  if (!facts.length) return null;

  const collapsedText = facts.map((f) => f.value).join(' · ');

  return (
    <section className={`ejc-card rt-ai-bar ${collapsed ? 'collapsed' : ''}`}>
      <div className="rt-ai-row" onClick={() => setCollapsed(true)}>
        <div className="rt-ai-lead">
          <span className="rt-ai-spark">
            <Icon name="sparkles" />
          </span>
          <span className="rt-ai-title">{__('Highlights', 'easyjobs')}</span>
        </div>
        <div className="rt-ai-facts">
          {facts.map((f, i) => (
            <React.Fragment key={i}>
              {i > 0 ? <span className="rt-ai-vsep"></span> : null}
              <div className="rt-ai-fact">
                <span className="rt-ai-flabel">{f.label}</span>
                <span className="rt-ai-fval" title={f.value}>
                  {f.value}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="rt-ai-tools">
          <button
            className="rt-ai-icon"
            type="button"
            aria-label={__('Collapse highlights', 'easyjobs')}
            onClick={() => setCollapsed(true)}
          >
            <Icon name="chev" className="rt-ai-chev" />
          </button>
        </div>
      </div>
      <div className="rt-ai-collapsed" onClick={() => setCollapsed(false)}>
        <span className="rt-ai-spark">
          <Icon name="sparkles" />
        </span>
        <span className="rt-ai-cl-text">
          <b>{__('Highlights', 'easyjobs')}:</b> {collapsedText}
        </span>
        <Icon name="chev" className="rt-ai-cl-chev" />
      </div>
    </section>
  );
};

const Resume = ({ candidateDetails }) => {
  const candidate = candidateDetails?.candidate || {};
  const user = candidate?.user || {};
  // Sanitize the URL schemes up-front: `resume_link` is candidate-supplied and
  // otherwise flows into an iframe src / anchor href, where a `javascript:` value
  // would execute in the wp-admin origin. safeUrl() blanks unsafe schemes.
  const resumeUrl = safeUrl(user?.resume_url || '');
  const externalLink = safeUrl(candidate?.resume_link || '');
  const candidateId = candidate?.id;

  const streamUrl =
    candidateId && resumeUrl
      ? `${
          easyJobsJs.ajax_url
        }?action=easyjobs_stream_resume&id=${encodeURIComponent(
          candidateId,
        )}&nonce=${easyJobsJs.nonce}`
      : '';

  const fileName = resumeUrl
    ? decodeURIComponent(resumeUrl.split('/').pop().split('?')[0]) ||
      'resume.pdf'
    : 'resume.pdf';

  // 'loading' | 'ready' | 'fallback' | 'empty'
  const [status, setStatus] = useState(
    resumeUrl ? 'loading' : externalLink ? 'fallback' : 'empty',
  );
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [copied, setCopied] = useState(false);
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);

  const docRef = useRef(null);
  const fitScaleRef = useRef(1);
  const baseDimsRef = useRef({ w: FIT_WIDTH, h: FIT_WIDTH * 1.3 });
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const printFrameRef = useRef(null);
  const zoomWrapRef = useRef(null);
  const bodyRef = useRef(null);

  // Close the zoom preset menu on outside click.
  useEffect(() => {
    const onDoc = (e) => {
      if (zoomWrapRef.current && !zoomWrapRef.current.contains(e.target))
        setZoomMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // ── Load the document ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    if (!streamUrl) return;
    setStatus('loading');

    loadPdfJs()
      .then(
        (pdfjsLib) =>
          pdfjsLib.getDocument({ url: streamUrl, withCredentials: true })
            .promise,
      )
      .then(async (doc) => {
        if (cancelled) return;
        docRef.current = doc;
        setNumPages(doc.numPages);
        // Compute a fit-to-width base scale from page 1.
        const first = await doc.getPage(1);
        const vp = first.getViewport({ scale: 1 });
        // 100% = page rendered at FIT_WIDTH px wide (fixed reference, like the app).
        fitScaleRef.current = FIT_WIDTH / vp.width;
        // zoom=1 canvas footprint — used to compute the fit-to-width/page presets.
        baseDimsRef.current = {
          w: vp.width * fitScaleRef.current,
          h: vp.height * fitScaleRef.current,
        };
        setPage(1);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('fallback');
      });

    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {
          /* noop */
        }
      }
      if (docRef.current) {
        try {
          docRef.current.destroy();
        } catch (e) {
          /* noop */
        }
        docRef.current = null;
      }
    };
  }, [streamUrl]);

  // ── Render the current page ────────────────────────────────────────────────
  const renderPage = useCallback(async () => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    if (!doc || !canvas) return;

    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch (e) {
        /* noop */
      }
    }

    try {
      const pdfPage = await doc.getPage(page);
      const scale = fitScaleRef.current * zoom;
      const viewport = pdfPage.getViewport({ scale, rotation });
      const outputScale = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const ctx = canvas.getContext('2d');
      const task = pdfPage.render({
        canvasContext: ctx,
        viewport,
        transform:
          outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : undefined,
      });
      renderTaskRef.current = task;
      await task.promise;
    } catch (e) {
      // RenderingCancelledException is expected on rapid changes — ignore.
    }
  }, [page, zoom, rotation]);

  useEffect(() => {
    if (status === 'ready') renderPage();
  }, [status, renderPage]);

  // ── Toolbar actions ────────────────────────────────────────────────────────
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(numPages, p + 1));
  const clampZoom = (z) => Math.max(0.5, Math.min(3, +Number(z).toFixed(2)));
  const zoomOut = () => setZoom((z) => clampZoom(z - 0.1));
  const zoomIn = () => setZoom((z) => clampZoom(z + 0.1));

  // Apply a zoom preset: fit-to-width, fit-to-page, or a fixed percentage.
  const setZoomPreset = (preset) => {
    const body = bodyRef.current;
    const pad = 64; // .viewer-body padding (32px each side)
    if (preset === 'width' && body) {
      setZoom(clampZoom((body.clientWidth - pad) / baseDimsRef.current.w));
    } else if (preset === 'page' && body) {
      setZoom(clampZoom((body.clientHeight - pad) / baseDimsRef.current.h));
    } else if (typeof preset === 'number') {
      setZoom(clampZoom(preset / 100));
    }
    setZoomMenuOpen(false);
  };
  const rotate = () => setRotation((r) => (r + 90) % 360);

  const openNewTab = () => {
    // Proxy the file via POST → clean blob: URL (no admin-ajax.php / nonce in bar).
    if (candidateId && resumeUrl) {
      streamFile(
        'easyjobs_stream_resume',
        { id: candidateId },
        { filename: fileName },
      );
      return;
    }
    window.open(resumeUrl || externalLink, '_blank', 'noopener,noreferrer');
  };

  const copyLink = async () => {
    const link = resumeUrl || externalLink;
    if (!link) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
      } else {
        // Fallback for non-secure contexts / older browsers.
        const ta = document.createElement('textarea');
        ta.value = link;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
      toast.success(__('Resume link copied', 'easyjobs'), { autoClose: 1200 });
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      toast.error(__('Could not copy the link', 'easyjobs'), {
        autoClose: 1200,
      });
    }
  };

  const download = () => {
    if (candidateId && resumeUrl) {
      streamFile(
        'easyjobs_stream_resume',
        { id: candidateId, download: 1 },
        { download: true, filename: fileName },
      );
      return;
    }
    const a = document.createElement('a');
    a.href = resumeUrl || externalLink;
    a.download = fileName;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const print = () => {
    if (!streamUrl) {
      window.open(resumeUrl || externalLink, '_blank', 'noopener,noreferrer');
      return;
    }
    let frame = printFrameRef.current;
    if (!frame) {
      frame = document.createElement('iframe');
      frame.style.position = 'fixed';
      frame.style.right = '0';
      frame.style.bottom = '0';
      frame.style.width = '0';
      frame.style.height = '0';
      frame.style.border = '0';
      document.body.appendChild(frame);
      printFrameRef.current = frame;
    }
    frame.onload = () => {
      try {
        frame.contentWindow.focus();
        frame.contentWindow.print();
      } catch (e) {
        window.open(streamUrl, '_blank', 'noopener,noreferrer');
      }
    };
    frame.src = streamUrl;
  };

  useEffect(
    () => () => {
      if (printFrameRef.current) printFrameRef.current.remove();
    },
    [],
  );

  // ── Empty state ────────────────────────────────────────────────────────────
  if (status === 'empty') {
    return (
      <div className="panel active" data-testid="ej-candidate-tabpanel">
        <Highlights candidate={candidate} />
        <section className="ejc-card rt-empty-card">
          <div className="rt-empty">
            <div
              className="rt-empty-icon"
              dangerouslySetInnerHTML={{ __html: RESUME_SVG }}
            />
            <p className="rt-empty-sub">
              {__(
                'This candidate has not uploaded a resume or provided a resume link yet.',
                'easyjobs',
              )}
            </p>
          </div>
        </section>
      </div>
    );
  }

  const toolbar = (
    <div className="viewer-toolbar">
      <div className="vt-left">
        <span className="vt-file-ic">
          <Icon name="file-txt" />
        </span>
        <div className="vt-file">
          <span className="vt-name" title={fileName}>
            {fileName}
          </span>
          <span className="vt-meta">
            {__('PDF', 'easyjobs')}
            {numPages
              ? ` · ${numPages} ${
                  numPages > 1
                    ? __('pages', 'easyjobs')
                    : __('page', 'easyjobs')
                }`
              : ''}
          </span>
        </div>
      </div>

      {status === 'ready' ? (
        <div className="vt-center">
          <div className="vt-group">
            <button
              className="vt-btn"
              onClick={goPrev}
              disabled={page <= 1}
              aria-label={__('Previous page', 'easyjobs')}
            >
              <Icon name="chev-l" />
            </button>
            <span className="vt-page">
              <b>{page}</b> <span className="vt-sep">/</span> {numPages}
            </span>
            <button
              className="vt-btn"
              onClick={goNext}
              disabled={page >= numPages}
              aria-label={__('Next page', 'easyjobs')}
            >
              <Icon name="chev-r" />
            </button>
          </div>
          <div className="vt-group">
            <button
              className="vt-btn"
              onClick={zoomOut}
              disabled={zoom <= 0.5}
              aria-label={__('Zoom out', 'easyjobs')}
            >
              <Icon name="minus" />
            </button>
            <div className="vt-zoom-wrap" ref={zoomWrapRef}>
              <button
                className="vt-zoom"
                onClick={() => setZoomMenuOpen((v) => !v)}
                aria-label={__('Zoom level', 'easyjobs')}
              >
                <span>{Math.round(zoom * 100)}%</span>
                <Icon name="chev" />
              </button>
              <div className={`vt-zoom-menu ${zoomMenuOpen ? 'open' : ''}`}>
                <button onClick={() => setZoomPreset('width')}>
                  {__('Fit to width', 'easyjobs')}
                  <Icon name="check" className="vt-ck" />
                </button>
                <button onClick={() => setZoomPreset('page')}>
                  {__('Fit to page', 'easyjobs')}
                  <Icon name="check" className="vt-ck" />
                </button>
                {[50, 100, 150, 200].map((p) => (
                  <button
                    key={p}
                    className={Math.round(zoom * 100) === p ? 'sel' : ''}
                    onClick={() => setZoomPreset(p)}
                  >
                    {p}%
                    <Icon name="check" className="vt-ck" />
                  </button>
                ))}
              </div>
            </div>
            <button
              className="vt-btn"
              onClick={zoomIn}
              disabled={zoom >= 3}
              aria-label={__('Zoom in', 'easyjobs')}
            >
              <Icon name="plus" />
            </button>
          </div>
          <button
            className="vt-btn vt-icon"
            onClick={rotate}
            aria-label={__('Rotate', 'easyjobs')}
          >
            <Icon name="rotate" />
          </button>
        </div>
      ) : null}

      <div className="vt-right">
        {status === 'ready' ? (
          <button
            className="vt-icon"
            onClick={print}
            aria-label={__('Print', 'easyjobs')}
          >
            <Icon name="printer" />
          </button>
        ) : null}
        {resumeUrl || externalLink ? (
          <button
            className={`vt-icon ${copied ? 'is-copied' : ''}`}
            onClick={copyLink}
            aria-label={__('Copy resume link', 'easyjobs')}
            title={
              copied
                ? __('Copied!', 'easyjobs')
                : __('Copy resume link', 'easyjobs')
            }
          >
            <Icon name={copied ? 'check' : 'link'} />
          </button>
        ) : null}
        <button
          className="vt-icon"
          onClick={download}
          aria-label={__('Download', 'easyjobs')}
        >
          <Icon name="download" />
        </button>
        <button className="vt-open" onClick={openNewTab}>
          <Icon name="ext" />
          {__('Open in new tab', 'easyjobs')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="panel active" data-testid="ej-candidate-tabpanel">
      <Highlights candidate={candidate} />
      <section className="ejc-card viewer-card">
        {toolbar}

        <div className="viewer-body" ref={bodyRef}>
          {status === 'loading' ? (
            <div className="viewer-loading">
              {__('Loading resume…', 'easyjobs')}
            </div>
          ) : status === 'fallback' ? (
            streamUrl || resumeUrl || externalLink ? (
              <iframe
                className="viewer-frame"
                src={streamUrl || resumeUrl || externalLink}
                title="candidate-resume"
              ></iframe>
            ) : (
              <div className="viewer-empty">
                {__('Resume not found', 'easyjobs')}
              </div>
            )
          ) : (
            <div className="paper-page">
              <canvas ref={canvasRef}></canvas>
            </div>
          )}
        </div>
      </section>

      <div className="viewer-tip">
        <Icon name="cursor" />
        {__(
          'Tip: use the toolbar to switch pages, zoom, rotate, or download the resume.',
          'easyjobs',
        )}
      </div>
    </div>
  );
};

export default Resume;
