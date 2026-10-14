import React, { useState, useRef, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { Icon } from '../icons';
import { eduBadge } from '../cdUtil';
import {
  EmptyIllustration,
  EXPERIENCE_SVG,
  VIDEO_SVG,
} from '../emptyIllustrations';
import { sanitizeHtml, safeUrl } from '../../../Messages/sanitize';

/**
 * Normalise a candidate video link to an *embeddable* source. A bare YouTube
 * watch / youtu.be / shorts URL can't be iframed (X-Frame-Options) — it must be
 * the /embed/ form. Drive needs /preview, Vimeo the player URL, and direct media
 * files (.mp4 …) play in a <video> tag.
 */
const toEmbed = (url) => {
  const u = String(url || '').trim();
  if (!u) return { type: 'none' };

  if (/\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i.test(u))
    return { type: 'media', src: u };

  let m = u.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{11})/i,
  );
  if (m)
    return { type: 'iframe', src: `https://www.youtube.com/embed/${m[1]}` };

  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (m)
    return { type: 'iframe', src: `https://player.vimeo.com/video/${m[1]}` };

  m = u.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (m)
    return {
      type: 'iframe',
      src: `https://drive.google.com/file/d/${m[1]}/preview`,
    };

  // Last resort: best-effort rewrite, else embed the raw URL — but only after a
  // scheme check, since this src goes straight into a same-origin <iframe> and a
  // `javascript:` value would execute (candidate-controlled video_link → XSS).
  if (/youtube\.com|youtu\.be/i.test(u)) {
    const safe = safeUrl(
      u.replace('/watch?v=', '/embed/').replace('/shorts/', '/embed/'),
    );
    return safe ? { type: 'iframe', src: safe } : { type: 'none' };
  }
  const safe = safeUrl(u);
  return safe ? { type: 'iframe', src: safe } : { type: 'none' };
};

/**
 * Application panel — matches the live app: Cover Letter & Education are hidden
 * when empty; Experience & Intro Video always render (illustrated empty states).
 */
const Application = ({ candidateDetails }) => {
  const candidate = candidateDetails?.candidate || {};
  const user = candidate?.user || {};
  const employments = user?.employments || [];
  const educations = user?.educations || [];
  const videoLink = candidate?.video_link || user?.video_link || '';
  const video = toEmbed(videoLink);
  const customFields = candidate?.custom_fields || [];

  const [coverOpen, setCoverOpen] = useState(false);
  const [coverOverflow, setCoverOverflow] = useState(false);
  const coverRef = useRef(null);
  const [openItems, setOpenItems] = useState({});
  const [allOpen, setAllOpen] = useState(false);

  useEffect(() => {
    if (coverRef.current) setCoverOverflow(coverRef.current.scrollHeight > 88);
  }, [candidate?.cover_letter]);

  const toggleItem = (i) => setOpenItems((s) => ({ ...s, [i]: !s[i] }));
  const toggleAll = () => {
    const next = !allOpen;
    setAllOpen(next);
    const map = {};
    employments.forEach((_, i) => (map[i] = next));
    setOpenItems(map);
  };
  const hasDesc = employments.some((e) => e.responsibilities);

  return (
    <div className="panel active" data-testid="ej-candidate-tabpanel">
      {/* Cover letter — only when present */}
      {candidate?.cover_letter ? (
        <section className="ejc-card card-pad">
          <h2 className="card-h" style={{ marginBottom: '12px' }}>
            {__('Cover Letter', 'easyjobs')}
          </h2>
          <div className={`cover-body ${coverOpen ? 'open' : ''}`}>
            <div
              ref={coverRef}
              className="cover-text"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(candidate.cover_letter),
              }}
            ></div>
            {coverOverflow && !coverOpen ? (
              <div className="ejc-fade"></div>
            ) : null}
          </div>
          {coverOverflow ? (
            <a className="read-more" onClick={() => setCoverOpen((v) => !v)}>
              {coverOpen
                ? __('Read less', 'easyjobs')
                : __('Read more', 'easyjobs')}
            </a>
          ) : null}
        </section>
      ) : null}

      {/* Experience — always */}
      <section className="ejc-card card-pad">
        <div className="h-row">
          <h2 className="card-h">
            {__('Experience', 'easyjobs')}
            {employments.length && user?.experience ? (
              <span className="meta-inline">
                {__('Total Year of Experience', 'easyjobs')}
                <span className="dotsep">·</span>
                {user.experience} {__('years', 'easyjobs')}
              </span>
            ) : null}
          </h2>
          {hasDesc ? (
            <button
              className={`expand-all ${allOpen ? 'open' : ''}`}
              onClick={toggleAll}
            >
              {allOpen
                ? __('Collapse all', 'easyjobs')
                : __('Expand all', 'easyjobs')}{' '}
              <Icon name="chev" />
            </button>
          ) : null}
        </div>

        {employments.length > 0 ? (
          <div className="timeline">
            {employments.map((emp, i) => {
              const current = emp.is_currently_working || !emp.to;
              const open = !!openItems[i];
              return (
                <article
                  key={i}
                  className={`tl-item ${current ? 'current' : ''} ${
                    open ? 'open' : ''
                  }`}
                >
                  <div
                    className="tl-top"
                    onClick={() => emp.responsibilities && toggleItem(i)}
                  >
                    <div>
                      <p className="tl-role">
                        {emp.designation}
                        {current ? (
                          <span className="cur-pill">
                            {__('Current', 'easyjobs')}
                          </span>
                        ) : null}
                      </p>
                      <p className="tl-company">{emp.company_name}</p>
                    </div>
                    <div className="tl-right">
                      <span className="tl-date">
                        {emp.from} – {emp.to || __('Present', 'easyjobs')}
                      </span>
                      {emp.responsibilities ? (
                        <button
                          className="tl-chev"
                          aria-label="Expand"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItem(i);
                          }}
                        >
                          <Icon name="chev" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                  {emp.responsibilities ? (
                    <div className="tl-desc">
                      {emp.responsibilities}
                      <div className="ejc-fade"></div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyIllustration
            svg={EXPERIENCE_SVG}
            text={__('No job experience yet', 'easyjobs')}
          />
        )}
      </section>

      {/* Education — only when present */}
      {educations.length > 0 ? (
        <section className="ejc-card card-pad">
          <h2 className="card-h" style={{ marginBottom: '6px' }}>
            {__('Educational Qualification', 'easyjobs')}
          </h2>
          {educations.map((edu, i) => (
            <div className="edu-row" key={i}>
              <span className="edu-badge">{eduBadge(edu)}</span>
              <div className="edu-mid">
                <span className="edu-inst">{edu.academy_name}</span>
                <span className="edu-field">
                  {edu.degree_name || edu.level_name}
                </span>
              </div>
              {Number(edu.passing_year) > 0 ? (
                <span className="edu-year">{edu.passing_year}</span>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {/* Custom Queries — only when present */}
      {customFields.length > 0 ? (
        <section className="ejc-card card-pad">
          <h2
            className="card-h"
            style={{ marginBottom: '12px', textTransform: 'capitalize' }}
          >
            {__('Custom Queries', 'easyjobs')}
          </h2>
          <div className="cq-list">
            {customFields.map((cf, i) => (
              <div className="cq-row" key={i}>
                <p className="cq-title">{cf.title}</p>
                {cf.value ? <p className="cq-value">{cf.value}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Intro video — always */}
      <section className="ejc-card card-pad">
        <h2 className="card-h" style={{ marginBottom: '14px' }}>
          {__('Intro Video', 'easyjobs')}
        </h2>
        {video.type === 'media' ? (
          <div className="video">
            <video src={video.src} controls controlsList="nodownload"></video>
          </div>
        ) : video.type === 'iframe' ? (
          <div className="video">
            <iframe
              src={video.src}
              title="intro-video"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        ) : (
          <EmptyIllustration
            svg={VIDEO_SVG}
            text={__('No video available', 'easyjobs')}
          />
        )}

        {video.type !== 'none' && videoLink ? (
          <div className="watch-source">
            <span className="watch-source__text">
              <Icon name="ext" />
              <span>
                {__('Or watch from', 'easyjobs')}{' '}
                <a
                  className="watch-source__link"
                  href={safeUrl(videoLink)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {__('source', 'easyjobs')}
                </a>
              </span>
            </span>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default Application;
