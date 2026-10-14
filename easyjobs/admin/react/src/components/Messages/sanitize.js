/**
 * Sanitizes backend-supplied HTML before it is injected via
 * dangerouslySetInnerHTML, to prevent stored XSS from candidate messages and
 * display names. Allows only safe rich-text formatting; strips scripts, event
 * handlers (onerror/onclick/…) and dangerous URL protocols (javascript:/data:).
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
const ALLOWED_ATTR = {
  A: new Set(['href', 'target', 'rel']),
  SPAN: new Set(['class']),
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

// Allow http(s), mailto, tel, anchors, and relative/protocol-relative URLs only.
const isSafeUrl = (value) => {
  const url = String(value || '').trim();
  // A leading scheme like "javascript:"/"data:" — permit only a safe set.
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) {
    return /^(https?|mailto|tel):/i.test(url);
  }
  return true; // relative, anchor (#…), or protocol-relative (//host)
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
        if (name === 'href' && !isSafeUrl(val)) continue;
        el.setAttribute(name, val);
      }
    }
    cleanInto(child, el, doc);
    out.appendChild(el);
  }
};

/**
 * Guard a URL used as an href / src / window.open target against dangerous
 * schemes (javascript:, data:, vbscript:, …). Returns the trimmed URL when it
 * uses a safe scheme (http/https/mailto/tel) or is relative/anchor/protocol-
 * relative; otherwise returns '' so the sink renders inert instead of executing.
 */
export const safeUrl = (value) => {
  const url = String(value == null ? '' : value).trim();
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
