import React from 'react';

/**
 * Icon sprite + helper, ported from the app-end "Candidate Profile" design.
 * <IconSprite/> is rendered once at the top of the Details tree; <Icon name="mail"/>
 * references a symbol by id (`#i-mail`).
 */
export const Icon = ({ name, className = '' }) => (
  <svg className={className} aria-hidden="true">
    <use href={`#i-${name}`} xlinkHref={`#i-${name}`} />
  </svg>
);

export const IconSprite = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <symbol id="i-chev" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 9l6 6 6-6"
        />
      </symbol>
      <symbol id="i-arr-l" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 12H5M11 18l-6-6 6-6"
        />
      </symbol>
      <symbol id="i-chev-l" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 6l-6 6 6 6"
        />
      </symbol>
      <symbol id="i-chev-r" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 6l6 6-6 6"
        />
      </symbol>
      <symbol id="i-mail" viewBox="0 0 24 24">
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.5 6.5l8.5 6 8.5-6"
        />
      </symbol>
      <symbol id="i-phone" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8 9.6a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"
        />
      </symbol>
      <symbol id="i-star" viewBox="0 0 24 24">
        <path
          d="M12 2.5l2.9 5.9 6.6 1-4.8 4.6 1.2 6.6L12 17.5 6.1 20.6l1.2-6.6L2.5 9.4l6.6-1z"
          strokeLinejoin="round"
        />
      </symbol>
      <symbol id="i-dot3v" viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="1.7" fill="currentColor" />
        <circle cx="12" cy="12" r="1.7" fill="currentColor" />
        <circle cx="12" cy="19" r="1.7" fill="currentColor" />
      </symbol>
      <symbol id="i-check" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 6L9 17l-5-5"
        />
      </symbol>
      <symbol id="i-download" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
        />
      </symbol>
      <symbol id="i-share" viewBox="0 0 24 24">
        <circle
          cx="18"
          cy="5"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle
          cx="6"
          cy="12"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle
          cx="18"
          cy="19"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"
        />
      </symbol>
      <symbol id="i-archive" viewBox="0 0 24 24">
        <rect
          x="3"
          y="4"
          width="18"
          height="4"
          rx="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 8v11a1 1 0 001 1h12a1 1 0 001-1V8M10 12h4"
        />
      </symbol>
      <symbol id="i-trash" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
        />
      </symbol>
      <symbol id="i-file-txt" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 2v6h6M8 13h8M8 17h6"
        />
      </symbol>
      <symbol id="i-file" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 2v6h6M8 13h8M8 17h6"
        />
      </symbol>
      <symbol id="i-cursor" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 9l5 12 1.8-5.2L21 15zM7.2 4.8l.9.9M3 7.5h1.3M7.5 3v1.3M4.8 7.2l-.9.9"
        />
      </symbol>
      <symbol id="i-clipboard" viewBox="0 0 24 24">
        <rect
          x="8"
          y="3"
          width="8"
          height="4"
          rx="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 5h2a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2M9 13l2 2 4-4"
        />
      </symbol>
      <symbol id="i-chat" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        />
      </symbol>
      <symbol id="i-clip" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.4 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
        />
      </symbol>
      <symbol id="i-copy" viewBox="0 0 24 24">
        <rect
          x="9"
          y="9"
          width="12"
          height="12"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
        />
      </symbol>
      <symbol id="i-pen" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20h9M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4z"
        />
      </symbol>
      <symbol id="i-up" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 14l5-5 5 5"
        />
      </symbol>
      <symbol id="i-down" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 10l5 5 5-5"
        />
      </symbol>
      <symbol id="i-ext" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
        />
      </symbol>
      <symbol id="i-play" viewBox="0 0 24 24">
        <path d="M7 4v16l13-8z" />
      </symbol>
      <symbol id="i-at" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.9 7.9"
        />
      </symbol>
      <symbol id="i-info" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          d="M12 16v-4M12 8h.01"
        />
      </symbol>
      <symbol id="i-sparkles" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3l1.7 4.6L18.3 9.3l-4.6 1.7L12 15.6l-1.7-4.6L5.7 9.3l4.6-1.7zM19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"
        />
      </symbol>
      <symbol id="i-refresh" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 3v6h-6M3 21v-6h6M3.5 9a9 9 0 0114.9-3.4L21 8M20.5 15A9 9 0 015.6 18.4L3 16"
        />
      </symbol>
      <symbol id="i-plus" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          d="M12 5v14M5 12h14"
        />
      </symbol>
      <symbol id="i-clip-list" viewBox="0 0 24 24">
        <rect
          x="8"
          y="3"
          width="8"
          height="4"
          rx="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 5h2a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2M8.5 12h.01M8.5 16h.01M12 12h3.5M12 16h3.5"
        />
      </symbol>
      <symbol id="i-eye" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </symbol>
      <symbol id="i-folder-open" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 19l2.3-7a1 1 0 01.95-.7H22l-2.3 7a1 1 0 01-.95.7zM5 19a1 1 0 01-1-1V6a2 2 0 012-2h3.5l2 3H18a2 2 0 012 2v2"
        />
      </symbol>
      <symbol id="i-upload-cloud" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 16l-4-4-4 4M12 12v9M20.4 18.6A5 5 0 0018 9.5h-1.3A8 8 0 103 16.3"
        />
      </symbol>
      <symbol id="i-list-plus" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 6h10M11 12h6M11 18h10M4 6h.01M4 12h.01M7 15v6M4 18h6"
        />
      </symbol>
      <symbol id="i-close" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 6L6 18M6 6l12 12"
        />
      </symbol>
      <symbol id="i-upload" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 9l5-5 5 5M12 4v12"
        />
      </symbol>
      <symbol id="i-alert" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          d="M12 8v5M12 16h.01"
        />
      </symbol>
      <symbol id="i-send" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M22 2L11 13M22 2l-7 20-4-9-9-4z"
        />
      </symbol>
      <symbol id="i-bold" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.5 4H13a4 4 0 010 8H6.5zM6.5 12H14a4 4 0 010 8H6.5z"
        />
      </symbol>
      <symbol id="i-italic" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          d="M19 4h-7M12 20H5M15 4L9 20"
        />
      </symbol>
      <symbol id="i-link" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.5 1.5M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.5-1.5"
        />
      </symbol>
      <symbol id="i-image" viewBox="0 0 24 24">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle
          cx="8.5"
          cy="8.5"
          r="1.7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 15l-5-5L5 21"
        />
      </symbol>
      <symbol id="i-linkedin" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M4.98 3.5A2.5 2.5 0 102.5 6 2.5 2.5 0 004.98 3.5zM3 8.98h4V21H3zM9.5 8.98h3.8v1.64h.06A4.17 4.17 0 0117 8.5c4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.27 0-2.9-1.77-2.9s-2.04 1.38-2.04 2.8V21h-4z"
        />
      </symbol>
      <symbol id="i-fb" viewBox="0 0 320 512">
        <path
          fill="currentColor"
          d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
        />
      </symbol>
      <symbol id="i-x" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M18.24 2.25h3.3l-7.2 8.24L23 21.75h-6.63l-5.2-6.79-5.94 6.79H1.92l7.7-8.8L1.25 2.25H8l4.7 6.21zm-1.16 17.52h1.83L7.01 4.13H5.04z"
        />
      </symbol>
      <symbol id="i-globe" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          d="M3 12h18M12 3a14 14 0 010 18 14 14 0 010-18z"
        />
      </symbol>
      <symbol id="i-briefcase" viewBox="0 0 24 24">
        <rect
          x="3"
          y="8"
          width="18"
          height="12"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2M3 13h18"
        />
      </symbol>
      <symbol id="i-calendar" viewBox="0 0 24 24">
        <rect
          x="3"
          y="4.5"
          width="18"
          height="17"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          d="M16 2.5v4M8 2.5v4M3 9.5h18"
        />
      </symbol>
      {/* App-end eicon glyphs (1024 grid) for the Candidate Details rows */}
      <symbol id="i-briefcase-open" viewBox="0 0 1024 1024">
        <path
          fill="currentColor"
          d="M256 204.8v-153.6c0-28.277 22.923-51.2 51.2-51.2h409.6c28.278 0 51.2 22.923 51.2 51.2v153.6h204.8c28.278 0 51.2 22.923 51.2 51.2v716.8c0 28.278-22.922 51.2-51.2 51.2h-921.6c-28.277 0-51.2-22.922-51.2-51.2v-716.8c0-28.277 22.923-51.2 51.2-51.2h204.8zM921.6 614.4h-819.2v307.2h819.2v-307.2zM921.6 307.2h-819.2v204.8h153.6v-102.4h102.4v102.4h307.2v-102.4h102.4v102.4h153.6v-204.8zM358.4 102.4v102.4h307.2v-102.4h-307.2z"
        />
      </symbol>
      <symbol id="i-dob" viewBox="0 0 1024 1024">
        <path
          fill="currentColor"
          d="M734.524 481.052c31.594 31.594 31.594 82.817 0 114.411s-82.817 31.594-114.411 0c-31.594-31.594-31.594-82.817 0-114.411s82.817-31.594 114.411 0z"
        />
        <path
          fill="currentColor"
          d="M329.087 783.872l48.53-48.53 41.008 80.901c1.067 2.135 2.135 3.251 3.251 5.387 11.338 15.117 28.601 25.259 48.277 26.965l0.253 0.018c1.385 0.103 3 0.161 4.629 0.161 18.423 0 35.097-7.481 47.152-19.572l120.844-120.844c6.982-6.66 11.323-16.036 11.323-26.425s-4.342-19.765-11.309-26.411l-0.015-0.014-141.322-141.37c-6.762-6.762-16.105-10.946-26.425-10.946-20.639 0-37.371 16.731-37.371 37.371 0 10.32 4.183 19.663 10.946 26.425v0l60.421 60.421-67.943 67.943-20.48-39.941c-5.233-10.592-15.030-18.247-26.751-20.444l-0.232-0.036c-1.732-0.291-3.729-0.456-5.764-0.456-10.499 0-19.965 4.421-26.637 11.504l-0.017 0.018-85.22 85.22c-6.762 6.762-10.946 16.105-10.946 26.425 0 20.639 16.731 37.371 37.371 37.371 10.32 0 19.663-4.183 26.425-10.946v0z"
        />
        <path
          fill="currentColor"
          d="M912.718 119.291h-117.591v-72.262c-0.137-24.979-20.349-45.191-45.314-45.328h-54.998c-24.979 0.137-45.191 20.349-45.328 45.314v71.159h-274.054v-71.146c-0.138-25.013-20.404-45.245-45.417-45.328h-54.896c-24.979 0.137-45.191 20.349-45.328 45.314v71.159h-117.591c-0.029 0-0.063 0-0.097 0-61.915 0-112.106 50.192-112.106 112.106 0 0.051 0 0.103 0 0.153v-0.008 679.673c0 0.029 0 0.063 0 0.097 0 61.915 50.192 112.106 112.106 112.106 0.034 0 0.069 0 0.103 0h799.442c0.072 0 0.157 0 0.243 0 61.915 0 112.106-50.192 112.106-112.106 0-0.034 0-0.069 0-0.103v0.005-679.673c0-0.058 0-0.127 0-0.194 0-61.271-49.67-110.942-110.942-110.942-0.12 0-0.239 0-0.359 0.001h0.019zM925.676 875.595c0 26.803-21.728 48.53-48.53 48.53v0h-729.321c-26.803 0-48.53-21.728-48.53-48.53v0-494.14h825.314v494.14z"
        />
      </symbol>
      <symbol id="i-id" viewBox="0 0 1024 1024">
        <path
          fill="currentColor"
          d="M300.023 541.984c-66.246 0.084-119.926 53.764-120.009 120.002v29.991c0.042 16.543 13.441 29.943 29.98 29.984h180.018c16.543-0.042 29.943-13.441 29.984-29.98v-29.987c-0.083-66.233-53.742-119.905-119.962-120.009h-0.010z"
        />
        <path
          fill="currentColor"
          d="M300.023 302.002c-33.14 0-60.005 26.865-60.005 60.005s26.865 60.005 60.005 60.005c33.14 0 60.005-26.865 60.005-60.005v0c-0.042-33.123-26.882-59.963-60.001-60.005h-0.004z"
        />
        <path
          fill="currentColor"
          d="M934.012 121.988h-844.023c-49.674 0.062-89.926 40.314-89.988 89.982v600.015c0.042 49.69 40.301 89.962 89.982 90.025h844.029c49.674-0.062 89.926-40.314 89.988-89.982v-600.052c-0.062-49.674-40.314-89.926-89.982-89.988h-0.006zM634.135 302.002h180.014c16.57 0 30.002 13.433 30.002 30.002s-13.433 30.002-30.002 30.002v0h-180.014c-16.57 0-30.002-13.433-30.002-30.002s13.433-30.002 30.002-30.002v0zM480.184 692.014c-0.062 49.674-40.314 89.926-89.982 89.988h-180.203c-49.674-0.062-89.926-40.314-89.988-89.982v-29.99c0.104-99.377 80.636-179.91 180.003-180.014h0.010c-66.279 0-120.009-53.73-120.009-120.009s53.73-120.009 120.009-120.009c66.279 0 120.009 53.73 120.009 120.009v0c-0.084 66.246-53.764 119.926-120.002 120.009h-0.008c99.427 0.021 180.035 80.565 180.16 179.965v0.012zM874.191 721.998h-300.17c-16.57 0-30.002-13.433-30.002-30.002s13.433-30.002 30.002-30.002v0h300.023c16.562 0.011 29.984 13.439 29.984 30.002 0 16.57-13.433 30.002-30.002 30.002-0.006 0-0.013 0-0.019 0h0.001zM874.191 601.988h-300.17c-16.57 0-30.002-13.433-30.002-30.002s13.433-30.002 30.002-30.002v0h300.023c16.613 0.011 30.076 13.48 30.076 30.094 0 16.62-13.474 30.094-30.094 30.094-0.006 0-0.013 0-0.019 0h0.001zM874.191 481.979h-300.17c-16.57 0-30.002-13.433-30.002-30.002s13.433-30.002 30.002-30.002v0h300.023c16.562 0.011 29.984 13.439 29.984 30.002 0 16.57-13.433 30.002-30.002 30.002-0.006 0-0.013 0-0.019 0h0.001z"
        />
      </symbol>
      <symbol id="i-cal-num" viewBox="0 0 1024 1024">
        <path
          fill="currentColor"
          d="M418.907 791.229c-25.688-0.029-46.505-20.846-46.534-46.531l-0-0.003c0-12.85-10.417-23.267-23.267-23.267s-23.267 10.417-23.267 23.267h-0c-0 0.004-0 0.010-0 0.015 0 51.4 41.668 93.068 93.068 93.068s93.068-41.668 93.068-93.068c0-27.758-12.153-52.679-31.428-69.73l-0.099-0.086c19.374-17.137 31.526-42.057 31.526-69.816 0-51.4-41.668-93.068-93.068-93.068s-93.068 41.668-93.068 93.068c0 0.005 0 0.011 0 0.016l-0-0.001c0 12.85 10.417 23.267 23.267 23.267s23.267-10.417 23.267-23.267v0c-0-25.7 20.834-46.534 46.534-46.534s46.534 20.834 46.534 46.534c0 25.7-20.834 46.534-46.534 46.534l0-0c-12.85 0-23.267 10.417-23.267 23.267s10.417 23.267 23.267 23.267v0c25.7 0 46.534 20.834 46.534 46.534s-20.834 46.534-46.534 46.534v0z"
        />
        <path
          fill="currentColor"
          d="M581.877 558.61h23.217v255.987c0 12.85 10.417 23.267 23.267 23.267s23.267-10.417 23.267-23.267v-279.254c0-12.85-10.417-23.267-23.267-23.267v0h-46.484c-12.85 0-23.267 10.417-23.267 23.267s10.417 23.267 23.267 23.267v0z"
        />
        <path
          fill="currentColor"
          d="M930.932 93.068h-116.385c-12.85 0-23.267 10.417-23.267 23.267v0 116.385c0.001 0.082 0.001 0.18 0.001 0.277 0 25.7-20.834 46.534-46.534 46.534s-46.534-20.834-46.534-46.534c0-20.158 12.818-37.323 30.748-43.788l0.324-0.102c9.084-3.303 15.456-11.861 15.461-21.907l0-0.001v-143.933c0-12.85-10.417-23.267-23.267-23.267s-23.267 10.417-23.267 23.267v69.801h-349.106c-12.85 0-23.267 10.417-23.267 23.267v0 116.385c0.001 0.082 0.001 0.18 0.001 0.277 0 25.7-20.834 46.534-46.534 46.534s-46.534-20.834-46.534-46.534c0-20.158 12.818-37.323 30.748-43.788l0.324-0.102c9.084-3.303 15.456-11.861 15.461-21.907l0-0.001v-143.933c0-12.85-10.417-23.267-23.267-23.267s-23.267 10.417-23.267 23.267l-0-0v69.801h-139.703c-51.412 0.057-93.068 41.748-93.068 93.169 0 0.035 0 0.071 0 0.106l-0-0.006v744.595c0.057 51.377 41.691 93.011 93.063 93.068l665.23 0c12.846-0.011 24.472-5.224 32.886-13.648l0-0 219.173-219.072c8.424-8.414 13.637-20.040 13.648-32.884l0-0.002v-572.056c0-0.030 0-0.065 0-0.101 0-51.42-41.656-93.111-93.063-93.169l-0.005-0zM930.932 744.695h-93.118c-51.377 0.057-93.011 41.691-93.068 93.063l-0 0.005v93.068h-651.678v-558.458h837.864z"
        />
      </symbol>
      <symbol id="i-info-fill" viewBox="0 0 12 12">
        <path
          fill="currentColor"
          d="M5.83333 0C9.05508 0 11.6667 2.61158 11.6667 5.83333C11.6679 7.36486 11.0667 8.83543 9.99302 9.92754C8.91931 11.0197 7.45917 11.6457 5.92785 11.6705C4.39652 11.6953 2.91686 11.1169 1.80833 10.0602C0.6998 9.00341 0.0513266 7.55309 0.00291673 6.02233L0 5.83333L0.0023333 5.67C0.0886666 2.52408 2.66583 0 5.83333 0ZM5.83333 5.25H5.25L5.18175 5.25408C5.03997 5.27095 4.9093 5.33922 4.81449 5.44598C4.71968 5.55273 4.66732 5.69056 4.66732 5.83333C4.66732 5.97611 4.71968 6.11393 4.81449 6.22069C4.9093 6.32744 5.03997 6.39572 5.18175 6.41258L5.25 6.41667V8.16667L5.25408 8.23492C5.26944 8.36513 5.32821 8.48637 5.42092 8.57908C5.51363 8.67179 5.63487 8.73056 5.76508 8.74592L5.83333 8.75H6.41667L6.48492 8.74592C6.61513 8.73056 6.73637 8.67179 6.82908 8.57908C6.92179 8.48637 6.98056 8.36513 6.99592 8.23492L7 8.16667L6.99592 8.09842C6.98197 7.9794 6.93171 7.86757 6.85198 7.77813C6.77224 7.68868 6.66689 7.62596 6.55025 7.5985L6.48492 7.58683L6.41667 7.58333V5.83333L6.41258 5.76508C6.39723 5.63487 6.33845 5.51363 6.24574 5.42092C6.15303 5.32821 6.03179 5.26944 5.90158 5.25408L5.83333 5.25ZM5.83917 3.5L5.76508 3.50408C5.62331 3.52095 5.49263 3.58922 5.39782 3.69598C5.30301 3.80274 5.25065 3.94055 5.25065 4.08333C5.25065 4.22611 5.30301 4.36393 5.39782 4.47069C5.49263 4.57744 5.62331 4.64572 5.76508 4.66258L5.83333 4.66667L5.90742 4.66258C6.0492 4.64572 6.17987 4.57744 6.27468 4.47069C6.36949 4.36393 6.42185 4.22611 6.42185 4.08333C6.42185 3.94055 6.36949 3.80274 6.27468 3.69598C6.17987 3.58922 6.0492 3.52095 5.90742 3.50408L5.83917 3.5Z"
        />
      </symbol>
      <symbol id="i-user" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="8"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1"
        />
      </symbol>
      <symbol id="i-hash" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"
        />
      </symbol>
      <symbol id="i-emoji" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          d="M8.5 14.5a4 4 0 007 0"
        />
        <circle cx="9" cy="10" r="1" fill="currentColor" />
        <circle cx="15" cy="10" r="1" fill="currentColor" />
      </symbol>
      <symbol id="i-minus" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          d="M5 12h14"
        />
      </symbol>
      <symbol id="i-printer" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 9V3h12v6M6 18H4a1 1 0 01-1-1v-5a2 2 0 012-2h14a2 2 0 012 2v5a1 1 0 01-1 1h-2"
        />
        <rect
          x="6"
          y="14"
          width="12"
          height="7"
          rx="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </symbol>
      <symbol id="i-rotate" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a9 9 0 11-3-6.7L21 8M21 4v4h-4"
        />
      </symbol>
      <symbol id="i-cake" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 20.5h16M6 20.5v-8h12v8M5 12.5a2 2 0 012-2h10a2 2 0 012 2M5 16q1.5 1.5 3.5 0t3.5 0 3.5 0M12 10.5V6.5M11 5.6a1 1 0 102 0c0-.8-1-1.6-1-1.6s-1 .8-1 1.6z"
        />
      </symbol>
      <symbol id="i-id-card" viewBox="0 0 24 24">
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle
          cx="8.5"
          cy="11"
          r="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.5 16.2a3.2 3.2 0 016 0M14 10h4M14 13h4M14 16h2.5"
        />
      </symbol>
      <symbol id="i-calendar-days" viewBox="0 0 24 24">
        <rect
          x="3"
          y="4.5"
          width="18"
          height="16.5"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          d="M16 2.5v4M8 2.5v4M3 9.5h18"
        />
        <path
          fill="currentColor"
          d="M7.4 12.6h1.6v1.6H7.4zM11.2 12.6h1.6v1.6h-1.6zM15 12.6h1.6v1.6H15zM7.4 16.1h1.6v1.6H7.4zM11.2 16.1h1.6v1.6h-1.6z"
        />
      </symbol>
      {/* Contact icons (app's exact glyphs) */}
      <symbol id="i-mail2" viewBox="0 0 16 16">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2 4.66927C2 4.31565 2.14048 3.97651 2.39052 3.72646C2.64057 3.47641 2.97971 3.33594 3.33333 3.33594H12.6667C13.0203 3.33594 13.3594 3.47641 13.6095 3.72646C13.8595 3.97651 14 4.31565 14 4.66927V11.3359C14 11.6896 13.8595 12.0287 13.6095 12.2787C13.3594 12.5288 13.0203 12.6693 12.6667 12.6693H3.33333C2.97971 12.6693 2.64057 12.5288 2.39052 12.2787C2.14048 12.0287 2 11.6896 2 11.3359V4.66927Z"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2 4.66406L8 8.66406L14 4.66406"
        />
      </symbol>
      <symbol id="i-phone2" viewBox="0 0 16 16">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.33333 2.66406H6L7.33333 5.9974L5.66667 6.9974C6.38064 8.44508 7.55231 9.61676 9 10.3307L10 8.66406L13.3333 9.9974V12.6641C13.3333 13.0177 13.1929 13.3568 12.9428 13.6069C12.6928 13.8569 12.3536 13.9974 12 13.9974C9.39951 13.8394 6.94677 12.7351 5.10455 10.8928C3.26234 9.05063 2.15803 6.59789 2 3.9974C2 3.64377 2.14048 3.30464 2.39052 3.05459C2.64057 2.80454 2.97971 2.66406 3.33333 2.66406Z"
        />
      </symbol>
      {/* Tab icons (app's exact glyphs, viewBox 20) */}
      <symbol id="i-tab-application" viewBox="0 0 20 20">
        <rect
          x="5"
          y="2.5"
          width="10"
          height="15"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.08333 5.83333H11.25"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.08333 7.91667H9.58333"
        />
        <circle
          cx="11.6667"
          cy="11.6667"
          r="1.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.16667 15.4167C9.52324 14.4269 10.4766 13.75 11.6667 13.75C12.8568 13.75 13.8101 14.4269 14.1667 15.4167"
        />
      </symbol>
      <symbol id="i-tab-resume" viewBox="0 0 20 20">
        <rect
          x="5"
          y="2.5"
          width="10"
          height="15"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="10"
          cy="7.08333"
          r="1.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.125 11.25C8.4375 10.5417 9.16667 10.0833 10 10.0833C10.8333 10.0833 11.5625 10.5417 11.875 11.25"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.91667 13.3333H12.0833"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.91667 15H12.0833"
        />
      </symbol>
      <symbol id="i-tab-evaluation" viewBox="0 0 20 20">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 3.33331H6.66667C6.22464 3.33331 5.80072 3.50891 5.48816 3.82147C5.17559 4.13403 5 4.55795 5 4.99998V15.8333C5 16.2754 5.17559 16.6993 5.48816 17.0118C5.80072 17.3244 6.22464 17.5 6.66667 17.5H13.3333C13.7754 17.5 14.1993 17.3244 14.5118 17.0118C14.8244 16.6993 15 16.2754 15 15.8333V4.99998C15 4.55795 14.8244 4.13403 14.5118 3.82147C14.1993 3.50891 13.7754 3.33331 13.3333 3.33331H12.5"
        />
        <rect
          x="7.5"
          y="2.5"
          width="5"
          height="3.33333"
          rx="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.91667 11.25L9.16667 12.5L12.0833 9.58331"
        />
      </symbol>
      <symbol id="i-tab-conversation" viewBox="0 0 20 20">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.6667 7.5C11.6667 7.94203 11.4911 8.36595 11.1785 8.67851C10.866 8.99107 10.442 9.16667 10 9.16667H5L1.66667 12.5V3.33333C1.66667 2.89131 1.84226 2.46738 2.15482 2.15482C2.46738 1.84226 2.89131 1.66667 3.33333 1.66667H10C10.442 1.66667 10.866 1.84226 11.1785 2.15482C11.4911 2.46738 11.6667 2.89131 11.6667 3.33333V7.5Z"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 7.5H16.6667C17.1087 7.5 17.5326 7.67559 17.8452 7.98816C18.1577 8.30072 18.3333 8.72464 18.3333 9.16667V18.3333L15 15H10C9.55797 15 9.13405 14.8244 8.82149 14.5118C8.50893 14.1993 8.33333 13.7754 8.33333 13.3333V12.5"
        />
      </symbol>
      <symbol id="i-tab-attachment" viewBox="0 0 20 20">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.875 10.4167L11.0417 16.25C10.337 16.9547 9.38134 17.3506 8.385 17.3506C7.38866 17.3506 6.43298 16.9547 5.72833 16.25C5.02369 15.5454 4.62782 14.5897 4.62782 13.5933C4.62782 12.597 5.02369 11.6413 5.72833 10.9367L11.5617 5.10333C12.0314 4.6336 12.6685 4.36968 13.3333 4.36968C13.9982 4.36968 14.6353 4.6336 15.105 5.10333C15.5747 5.57305 15.8386 6.21018 15.8386 6.875C15.8386 7.53982 15.5747 8.17695 15.105 8.64667L9.26583 14.48C9.03097 14.7148 8.7124 14.8468 8.38 14.8468C8.0476 14.8468 7.72903 14.7148 7.49417 14.48C7.2593 14.2451 7.12736 13.9266 7.12736 13.5942C7.12736 13.2618 7.2593 12.9432 7.49417 12.7083L12.8833 7.32583"
        />
      </symbol>
    </defs>
  </svg>
);
