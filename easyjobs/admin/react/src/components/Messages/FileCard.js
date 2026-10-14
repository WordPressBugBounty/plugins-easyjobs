import { __ } from '@wordpress/i18n';
import React from 'react';

const DownloadIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Derive a file extension label from the URL (preferred) or name.
const getExt = (name, url) => {
  const src = String(url || name || '')
    .split('?')[0]
    .split('#')[0];
  const m = src.match(/\.([a-zA-Z0-9]+)$/);
  return m ? m[1].toUpperCase() : 'FILE';
};

const FileGlyph = ({ ext }) => (
  <span className="ej-file__glyph">
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 3.5h10.5L26 11v17.5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-23a2 2 0 0 1 2-2z"
        fill="#eef2ff"
        stroke="#c6d3fd"
        strokeWidth="1.2"
      />
      <path
        d="M18.5 3.5V11H26"
        fill="none"
        stroke="#c6d3fd"
        strokeWidth="1.2"
      />
    </svg>
    <span className="ej-file__ext">{ext}</span>
  </span>
);

/**
 * Attachment card used both in the Files side panel (variant="panel") and inside
 * chat bubbles (variant="bubble"). Links to the file (opens / downloads).
 */
const FileCard = ({ url, name, size, variant = 'panel' }) => (
  <a
    className={`ej-file ej-file--${variant}`}
    href={url}
    target="_blank"
    rel="noreferrer"
    download
    title={name || ''}
  >
    <FileGlyph ext={getExt(name, url)} />
    <span className="ej-file__main">
      <span className="ej-file__name">
        {name || __('Attachment', 'easyjobs')}
      </span>
      {size ? <span className="ej-file__size">{size}</span> : null}
    </span>
    <span className="ej-file__dl" aria-hidden="true">
      <DownloadIcon />
    </span>
  </a>
);

export default FileCard;
