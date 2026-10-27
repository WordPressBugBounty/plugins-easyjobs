/**
 * Sanitizes backend-supplied HTML before it is injected via
 * dangerouslySetInnerHTML, to prevent stored XSS from candidate messages and
 * display names. Allows only safe rich-text formatting; strips scripts, event
 * handlers (onerror/onclick/…) and dangerous URL protocols (javascript:/data:),
 * including control-character-obfuscated ones (see normalizeUrl()).
 *
 * Implementation uses the browser's built-in DOMParser (no external dependency).
 * `parseFromString(html, 'text/html')` returns an INERT, disconnected document:
 * nothing loads or executes during parsing (no onerror/onload, no scripts). We
 * then rebuild a fresh tree from a strict allowlist, so disallowed markup can
 * never reach the live DOM.
 */

// Inline formatting tags we keep.
const ALLOWED_TAGS = new Set([
  'A',
  'B',
  'STRONG',
  'I',
  'EM',
  'U',
  'S',
  'STRIKE',
  'DEL',
  'BR',
  'P',
  'UL',
  'OL',
  'LI',
  'SPAN',
  'BLOCKQUOTE',
]);

// Per-tag attribute allowlist. Tags not listed keep no attributes.
// No `class` anywhere: candidate HTML must not borrow wp-admin classes
// (`hidden`, `notice`, `screen-reader-text`, …) to hide or fake UI.
const ALLOWED_ATTR = {
  A: new Set(['href', 'target', 'rel']),
};

// Tags dropped entirely (content discarded) — executable / mXSS-prone elements.
const DROP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'IFRAME',
  'OBJECT',
  'EMBED',
  'SVG',
  'MATH',
  'TEMPLATE',
  'NOSCRIPT',
  'LINK',
  'META',
  'BASE',
  'FORM',
  'INPUT',
  'BUTTON',
  'TEXTAREA',
  'SELECT',
  'OPTION',
]);

// Schemes a candidate-supplied URL may use. Everything else (javascript:,
// data:, vbscript:, blob:, file:, …) is rejected.
const SAFE_SCHEME = /^(?:https?|mailto|tel):/i;

// ASCII C0 controls (U+0000–U+001F) and DEL (U+007F).
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

/**
 * Normalize a URL the way the browser will before it reads the scheme.
 *
 * The WHATWG URL parser strips leading/trailing C0 controls and spaces and
 * removes every tab/LF/CR anywhere in the string. So `java\nscript:alert(1)`
 * (or `<a href="java&#10;script:…">`, which DOMParser decodes to a literal LF)
 * is executed as `javascript:alert(1)`. If we validated the raw string, the
 * newline would break our scheme regex and the URL would slip through as
 * "relative". Removing all C0 controls (a superset of what the browser drops)
 * and trimming means the string we validate is the string we emit, and no
 * control character ever reaches the DOM.
 *
 * @param {*} value Raw URL (any type; nullish becomes '').
 * @return {string} URL without control characters, trimmed.
 */
const normalizeUrl = (value) =>
  String(value == null ? '' : value)
    .replace(CONTROL_CHARS, '')
    .trim();

/**
 * Validate an already-normalized URL. Fails closed: any colon that appears
 * before the first `/`, `?` or `#` means the URL has (or may be parsed as
 * having) a scheme, and only http(s)/mailto/tel are allowed. URLs with no such
 * colon are relative, anchors (#…) or protocol-relative (//host).
 *
 * @param {string} url Output of normalizeUrl().
 * @return {boolean} True when the URL may be emitted.
 */
const isSafeUrl = (url) => {
  const colon = url.indexOf(':');
  if (colon === -1) return true;
  const delimiter = url.search(/[/?#]/);
  if (delimiter !== -1 && delimiter < colon) return true;
  return SAFE_SCHEME.test(url);
};

// Recursively copy `node`'s children into `out` (a clean element), applying the
// allowlist. Disallowed-but-harmless tags are unwrapped (their text is kept);
// DROP_TAGS are removed with their content.
const cleanInto = (node, out, doc) => {
  const children = node.childNodes;
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];

    if (child.nodeType === 3) {
      // Text node — always safe; re-escaped on serialization.
      out.appendChild(doc.createTextNode(child.nodeValue));
      continue;
    }
    if (child.nodeType !== 1) {
      // Comments / processing instructions / etc. — drop.
      continue;
    }

    const tag = child.tagName;

    if (DROP_TAGS.has(tag)) {
      continue; // remove element and its content
    }

    if (!ALLOWED_TAGS.has(tag)) {
      // Unknown but harmless wrapper — unwrap: keep its (sanitized) children.
      cleanInto(child, out, doc);
      continue;
    }

    // Allowed tag → recreate with only allowlisted attributes.
    const el = doc.createElement(tag);
    const allowed = ALLOWED_ATTR[tag];
    if (allowed) {
      const attrs = child.attributes;
      for (let a = 0; a < attrs.length; a += 1) {
        const name = attrs[a].name.toLowerCase();
        const val = attrs[a].value;
        if (!allowed.has(name)) continue;
        if (name === 'href') {
          // Emit the normalized URL, never the raw value.
          const href = safeUrl(val);
          if (href) el.setAttribute('href', href);
          continue;
        }
        el.setAttribute(name, val);
      }
      // A target'd link must not hand the opener to the destination
      // (reverse tabnabbing), whatever rel the source supplied.
      if (tag === 'A' && el.hasAttribute('target')) {
        el.setAttribute('rel', 'noopener noreferrer');
      }
    }
    cleanInto(child, el, doc);
    out.appendChild(el);
  }
};

/**
 * Guard a URL used as an href / src / window.open target against dangerous
 * schemes (javascript:, data:, vbscript:, …), including scheme names split by
 * control characters (`java\tscript:`) or prefixed by them (`\x01javascript:`).
 * Returns the normalized URL (control characters removed, trimmed) when it uses
 * a safe scheme (http/https/mailto/tel) or is relative/anchor/protocol-
 * relative; otherwise returns '' so the sink renders inert instead of executing.
 *
 * @param {*} value Candidate-supplied URL.
 * @return {string} Safe, normalized URL, or ''.
 */
export const safeUrl = (value) => {
  const url = normalizeUrl(value);
  return isSafeUrl(url) ? url : '';
};

// Escape fallback if DOMParser is unavailable (non-browser context) — fail closed.
const escapeText = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const sanitizeHtml = (html) => {
  const input = String(html == null ? '' : html);
  if (!input) return '';
  if (typeof DOMParser === 'undefined') {
    return escapeText(input);
  }
  try {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    const out = doc.createElement('div');
    cleanInto(doc.body, out, doc);
    return out.innerHTML;
  } catch (e) {
    return escapeText(input);
  }
};

export default sanitizeHtml;
