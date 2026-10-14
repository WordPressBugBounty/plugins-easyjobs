import React from 'react';

/**
 * Inline SVG icon set used only by the Messages screen.
 * Kept local (instead of the shared util/IconSprite.js) so this feature stays
 * self-contained; can be folded into the global sprite later if desired.
 *
 * Usage: <Icon name="search" size={18} />
 */

const PATHS = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </>
  ),
  filter: <path d="M3 5h18M6 12h12M10 19h4" />,
  kebab: (
    <>
      <circle cx="12" cy="5" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="12" cy="19" r="1.4" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  back: <path d="M19 12H5M12 19l-7-7 7-7" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  refresh: (
    <path d="M21 3v6h-6M3 21v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L21 8M20.5 15A9 9 0 0 1 5.6 18.4L3 16" />
  ),
  chevron: <path d="M6 9l6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </>
  ),
  editAlt: (
    <>
      <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>
  ),
  noteEdit: (
    <>
      <path d="M14 4H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h6" />
      <path d="M8 9h7M8 13h4" />
      <path d="M20 13.5l-5.6 5.6-2.5.5.5-2.5 5.6-5.6a1.4 1.4 0 0 1 2 2z" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </>
  ),
  note: (
    <>
      <path d="M4 4h12l4 4v12H4z" />
      <path d="M8 11h8M8 15h5" />
    </>
  ),
  pen: <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />,
  template: (
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      <path d="M8.5 13h7M8.5 16.5h4.5" />
    </>
  ),
  send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />,
  paperclip: (
    <path d="M21.4 11.05l-8.49 8.49a5 5 0 0 1-7.07-7.07l8.49-8.49a3.5 3.5 0 0 1 4.95 4.95l-8.49 8.49a2 2 0 0 1-2.83-2.83l7.78-7.78" />
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </>
  ),
  bold: <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />,
  italic: <path d="M19 5h-6M14 19H8M15 5L9 19" />,
  underline: (
    <>
      <path d="M7 4v6a5 5 0 0 0 10 0V4" />
      <path d="M5 21h14" />
    </>
  ),
  strike: (
    <>
      <path d="M4 12h16" />
      <path d="M7.5 8a3.5 3 0 0 1 3.5-3h2a3.5 3 0 0 1 3.5 3M7 16a3.5 3 0 0 0 3.5 3h2a3.5 3 0 0 0 3.5-3" />
    </>
  ),
  list: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1" />
      <circle cx="4.5" cy="12" r="1" />
      <circle cx="4.5" cy="18" r="1" />
    </>
  ),
  listOrdered: (
    <>
      <path d="M10 6h10M10 12h10M10 18h10" />
      <path d="M4 6h1.5v3M4 9h3M4 14.5h3l-3 3.5h3" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </>
  ),
  reply: <path d="M9 17l-5-5 5-5M4 12h11a5 5 0 0 1 5 5v1" />,
  thumb: (
    <path d="M7 22V11l5-9a2 2 0 0 1 3 1.8V8h5a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 18.6 20H7zM7 22H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3" />
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.5a4 4 0 0 0 7 0" />
      <circle cx="9" cy="10" r="0.6" />
      <circle cx="15" cy="10" r="0.6" />
    </>
  ),
  at: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.9 7.9" />
    </>
  ),
  check2: <path d="M5 12l5 5 8.5-10" />,
  chat: (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  mailOpen: (
    <>
      <path d="M3 9l9-6 9 6v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M3 9l9 6 9-6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </>
  ),
};

const Icon = ({ name, size = 18, className = '', strokeWidth = 1.7 }) => {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`ej-msg-icon ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {path}
    </svg>
  );
};

export default Icon;
