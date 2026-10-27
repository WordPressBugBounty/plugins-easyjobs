import { __, sprintf } from '@wordpress/i18n';
import React, { useEffect, useRef, useState } from 'react';
import Icon from './icons';
import { safeUrl } from './sanitize';

// Matches the app's allowUploadFileExtension list.
const FILE_ACCEPT =
  '.jpg,.png,.jpeg,.gif,.svg,.mp3,.mp4,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar';
const IMAGE_ACCEPT = 'image/*';

// Toolbar tools → execCommand mapping (link/paperclip/image are special-cased).
const TOOLS = [
  { name: 'bold', cmd: 'bold', label: __('Bold', 'easyjobs') },
  { name: 'italic', cmd: 'italic', label: __('Italic', 'easyjobs') },
  { name: 'underline', cmd: 'underline', label: __('Underline', 'easyjobs') },
  {
    name: 'strike',
    cmd: 'strikeThrough',
    label: __('Strikethrough', 'easyjobs'),
  },
  { divider: true },
  {
    name: 'list',
    cmd: 'insertUnorderedList',
    label: __('Bullet list', 'easyjobs'),
  },
  {
    name: 'listOrdered',
    cmd: 'insertOrderedList',
    label: __('Numbered list', 'easyjobs'),
  },
  { divider: true },
  { name: 'link', label: __('Insert link', 'easyjobs') },
  { name: 'paperclip', label: __('Attach file', 'easyjobs') },
  { name: 'image', label: __('Attach image', 'easyjobs') },
];

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5 13l4 4L19 7"
      stroke="#16a34a"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const CrossIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="#dc2626"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const UnlinkIcon = () => (
  <svg
    width="22"
    height="18"
    viewBox="0 0 28 22"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M11 7H8a4 4 0 0 0 0 8h3M16 7h1a4 4 0 0 1 3.4 6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11h6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M21 15l5 5M26 15l-5 5"
      stroke="#dc2626"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
const InfoIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="8" fill="#fd4760" />
    <rect x="9" y="8.5" width="2" height="5.7" rx="1" fill="#fff" />
    <circle cx="10" cy="6.2" r="1.1" fill="#fff" />
  </svg>
);
const ChevronRight = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M7.5 5l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Plugin subscription settings page (relative to /wp-admin/).
const SUBSCRIPTION_URL = 'admin.php?page=easyjobs-settings&tab=subscription';

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const Composer = ({ recipient, sending, onSend, disabled, upgradeUrl }) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const linkInputRef = useRef(null);
  const savedRange = useRef(null);
  const currentLink = useRef(null); // the <a> being previewed / edited

  const [isEmpty, setIsEmpty] = useState(true);
  const [active, setActive] = useState({});
  // Link popup: null | 'edit' (URL input) | 'preview' (existing link balloon)
  const [linkMode, setLinkMode] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [linkPos, setLinkPos] = useState({ top: 58, left: 16 });
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState(null); // data-URL base64

  useEffect(() => {
    if (linkMode === 'edit' && linkInputRef.current) {
      linkInputRef.current.focus();
      linkInputRef.current.select();
    }
  }, [linkMode]);

  const refreshActive = () => {
    if (typeof document.queryCommandState !== 'function') return;
    try {
      setActive({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
      });
    } catch (e) {
      /* queryCommandState can throw if focus isn't in the editor */
    }
  };

  // Position a popup just below the given client rect, relative to the composer.
  const positionToRect = (rect) => {
    const composer =
      editorRef.current && editorRef.current.closest('.ej-msg-composer');
    if (!composer || !rect) return;
    const cr = composer.getBoundingClientRect();
    setLinkPos({
      top: rect.bottom - cr.top + 8,
      left: Math.max(8, Math.min(rect.left - cr.left, cr.width - 220)),
    });
  };

  // Detect whether the caret is inside an <a> and show the preview balloon.
  const detectLink = () => {
    if (linkMode === 'edit') return;
    const sel = window.getSelection();
    const el = editorRef.current;
    if (!sel || !sel.anchorNode || !el || !el.contains(sel.anchorNode)) {
      if (linkMode === 'preview') setLinkMode(null);
      return;
    }
    const base =
      sel.anchorNode.nodeType === 3
        ? sel.anchorNode.parentElement
        : sel.anchorNode;
    const a = base && base.closest ? base.closest('a') : null;
    if (a && el.contains(a)) {
      currentLink.current = a;
      setPreviewUrl(a.getAttribute('href') || '');
      positionToRect(a.getBoundingClientRect());
      setLinkMode('preview');
    } else if (linkMode === 'preview') {
      setLinkMode(null);
    }
  };

  // The editor is "empty" only when it has neither text nor structural content
  // (lists, links, images…). An empty <li> has no text but is NOT empty.
  const isEditorEmpty = (el) => {
    if (!el) return true;
    if (el.textContent.replace(/\u200B/g, '').trim()) return false;
    if (el.querySelector('ul, ol, li, img, a, table, blockquote, hr'))
      return false;
    return true;
  };

  const handleInput = () => {
    const el = editorRef.current;
    const empty = isEditorEmpty(el);
    // Strip leftover markup (stray <br>/empty tags) so the caret resets cleanly
    // and the placeholder shows. Lists/links keep the editor non-empty, so this
    // never wipes real content.
    if (empty && el && el.innerHTML !== '') {
      el.innerHTML = '';
    }
    setIsEmpty(empty);
    refreshActive();
  };

  const exec = (cmd) => {
    if (editorRef.current) editorRef.current.focus();
    document.execCommand(cmd, false, null);
    handleInput();
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (
      sel &&
      sel.rangeCount &&
      editorRef.current &&
      editorRef.current.contains(sel.anchorNode)
    ) {
      savedRange.current = sel.getRangeAt(0);
    } else {
      savedRange.current = null;
    }
  };

  const restoreSelection = () => {
    if (editorRef.current) editorRef.current.focus();
    if (savedRange.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  // Toolbar link button → open the URL input for a NEW link.
  const openLink = () => {
    saveSelection();
    currentLink.current = null;
    setLinkUrl('');
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      const r = sel.getRangeAt(0).getBoundingClientRect();
      if (r.width || r.height) positionToRect(r);
    }
    setLinkMode('edit');
  };

  // Edit an existing link (from the preview balloon).
  const editLink = () => {
    const a = currentLink.current;
    if (!a) return;
    setLinkUrl(a.getAttribute('href') || '');
    setLinkMode('edit');
  };

  const applyLink = () => {
    const url = safeUrl(linkUrl.trim());
    setLinkMode(null);
    if (!url) return;
    if (currentLink.current) {
      // Update the existing link in place.
      currentLink.current.setAttribute('href', url);
      currentLink.current.setAttribute('target', '_blank');
      currentLink.current.setAttribute('rel', 'noreferrer');
      currentLink.current = null;
    } else {
      restoreSelection();
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) {
        document.execCommand('createLink', false, url);
      } else {
        document.execCommand(
          'insertHTML',
          false,
          `<a href="${escapeHtml(
            url,
          )}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a>`,
        );
      }
    }
    setLinkUrl('');
    handleInput();
  };

  const cancelLink = () => {
    setLinkMode(null);
    setLinkUrl('');
    currentLink.current = null;
    if (editorRef.current) editorRef.current.focus();
  };

  const unlink = () => {
    const a = currentLink.current;
    setLinkMode(null);
    if (!a || !a.parentNode) return;
    const parent = a.parentNode;
    while (a.firstChild) parent.insertBefore(a.firstChild, a);
    parent.removeChild(a);
    currentLink.current = null;
    if (editorRef.current) editorRef.current.focus();
    handleInput();
  };

  const onToolClick = (tool) => {
    if (tool.cmd) {
      exec(tool.cmd);
    } else if (tool.name === 'link') {
      openLink();
    } else if (tool.name === 'paperclip') {
      fileInputRef.current && fileInputRef.current.click();
    } else if (tool.name === 'image') {
      imageInputRef.current && imageInputRef.current.click();
    }
  };

  const onFilePicked = (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => setFileData(reader.result);
    reader.readAsDataURL(f);
  };

  const removeFile = () => {
    setFileName('');
    setFileData(null);
  };

  const submit = () => {
    const el = editorRef.current;
    const text = el ? el.textContent.trim() : '';
    // Normalize non-breaking spaces that contentEditable inserts, and trim trailing
    // whitespace / <br> so we don't store stray "&nbsp;" / blank lines.
    let html = el ? el.innerHTML : '';
    html = html
      .replace(/&nbsp;/gi, ' ')
      .replace(/(?:\s|<br\s*\/?>)+$/gi, '')
      .trim();
    if ((!text && !fileData) || sending || typeof onSend !== 'function') {
      return;
    }
    onSend({ message: text ? html : '', file: fileData || null });
    if (el) el.innerHTML = '';
    setIsEmpty(true);
    setActive({});
    setLinkMode(null);
    removeFile();
  };

  const canSend = !sending && !disabled && (!isEmpty || !!fileData);
  const popupStyle = { top: `${linkPos.top}px`, left: `${linkPos.left}px` };

  return (
    <div className="ej-msg-composer" data-testid="ej-msg-composer">
      {fileName ? (
        <div className="ej-msg-composer__file">
          <Icon name="paperclip" size={13} />
          <span className="ej-msg-composer__file-name">{fileName}</span>
          <button
            type="button"
            className="ej-msg-composer__file-remove"
            onClick={removeFile}
            aria-label={__('Remove attachment', 'easyjobs')}
          >
            <Icon name="close" size={11} />
          </button>
        </div>
      ) : null}

      {disabled ? (
        <div className="ej-msg-composer__locked">
          <span className="ej-msg-composer__locked-info">
            <InfoIcon />
            <span>
              {__(
                'Candidate limit reached! Upgrade your plan to continue.',
                'easyjobs',
              )}
            </span>
          </span>
          <a className="ej-msg-composer__upgrade" href={SUBSCRIPTION_URL}>
            <span>{__('Upgrade Now', 'easyjobs')}</span>
            <ChevronRight />
          </a>
        </div>
      ) : (
        <div
          ref={editorRef}
          data-testid="ej-msg-composer-input"
          className={`ej-msg-composer__input ${isEmpty ? 'is-empty' : ''}`}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          data-placeholder={sprintf(
            __('Type a message to %s…', 'easyjobs'),
            recipient || '',
          )}
          onInput={handleInput}
          onKeyUp={() => {
            refreshActive();
            detectLink();
          }}
          onMouseUp={() => {
            refreshActive();
            detectLink();
          }}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={FILE_ACCEPT}
        hidden
        onChange={onFilePicked}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        hidden
        onChange={onFilePicked}
      />

      {linkMode === 'edit' ? (
        <div
          className="ej-msg-linkbox"
          style={popupStyle}
          role="dialog"
          aria-label={__('Link URL', 'easyjobs')}
        >
          <span className="ej-msg-linkbox__field">
            <label>{__('Link URL', 'easyjobs')}</label>
            <input
              ref={linkInputRef}
              type="url"
              value={linkUrl}
              placeholder="https://"
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  applyLink();
                } else if (e.key === 'Escape') {
                  cancelLink();
                }
              }}
            />
          </span>
          <button
            type="button"
            className="ej-msg-linkbox__ok"
            onClick={applyLink}
            aria-label={__('Apply', 'easyjobs')}
          >
            <CheckIcon />
          </button>
          <button
            type="button"
            className="ej-msg-linkbox__cancel"
            onClick={cancelLink}
            aria-label={__('Cancel', 'easyjobs')}
          >
            <CrossIcon />
          </button>
        </div>
      ) : null}

      {linkMode === 'preview' ? (
        <div className="ej-msg-linkprev" style={popupStyle} role="dialog">
          <a
            className="ej-msg-linkprev__url"
            href={safeUrl(previewUrl)}
            target="_blank"
            rel="noreferrer"
          >
            {previewUrl}
          </a>
          <button
            type="button"
            className="ej-msg-linkprev__btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={editLink}
            aria-label={__('Edit link', 'easyjobs')}
            title={__('Edit link', 'easyjobs')}
          >
            <Icon name="pen" size={16} />
          </button>
          <button
            type="button"
            className="ej-msg-linkprev__btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={unlink}
            aria-label={__('Unlink', 'easyjobs')}
            title={__('Unlink', 'easyjobs')}
          >
            <UnlinkIcon />
          </button>
        </div>
      ) : null}

      <div className="ej-msg-composer__bar">
        <div className="ej-msg-tools">
          {TOOLS.map((t, i) =>
            t.divider ? (
              <span
                key={`d${i}`}
                className="ej-msg-tools__divider"
                aria-hidden="true"
              />
            ) : (
              <button
                key={t.name}
                type="button"
                className={`ej-msg-tool ${active[t.cmd] ? 'is-active' : ''}`}
                title={t.label}
                aria-label={t.label}
                disabled={disabled}
                // Keep the editor selection when clicking a tool.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onToolClick(t)}
              >
                <Icon name={t.name} size={17} />
              </button>
            ),
          )}
        </div>

        <div className="ej-msg-composer__actions">
          <button
            type="button"
            data-testid="ej-msg-send"
            className="ej-msg-btn ej-msg-btn--primary ej-msg-send"
            onClick={submit}
            disabled={!canSend}
          >
            <Icon name="send" size={16} />
            <span>
              {sending ? __('Sending…', 'easyjobs') : __('Send', 'easyjobs')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Composer;
