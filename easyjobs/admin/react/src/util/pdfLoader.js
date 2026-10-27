/**
 * Loads pdf.js at runtime and configures its worker.
 * Avoids bundling pdfjs-dist into the React build. Resolves with `window.pdfjsLib`.
 * Rejects if the script can't load (caller should fall back to an iframe).
 *
 * The files ship with the plugin in `admin/assets/vendor/pdfjs/` (see the
 * readme.txt there). WordPress.org does not allow plugins to load code from a
 * third-party CDN, so never point this at an external host.
 *
 * pdf.js 4+ is an ES module. It is injected with `<script type="module">` and
 * sets `globalThis.pdfjsLib` itself. The files are renamed from `.mjs` to `.js`
 * because module scripts and module workers are rejected unless the server
 * sends a JavaScript MIME type, and many servers do not map `.mjs`.
 *
 * Security: resumes are candidate-uploaded PDFs rendered inside wp-admin, so a
 * pdf.js bug that runs script would run it with the admin's session. pdf.js
 * < 4.2.67 is affected by CVE-2024-4367 (arbitrary JS via a crafted font).
 * Keep this on a current pdf.js release and always open documents with
 * getPdfDocumentOptions().
 */
export const PDFJS_VERSION = '5.7.284';
export const PDFJS_PATH = 'admin/assets/vendor/pdfjs';

/**
 * Base URL of the bundled pdf.js files, from the localized `easyJobsJs.plugin_url`.
 * Falls back to a URL relative to wp-admin, where the React app runs.
 */
export function getPdfJsBaseUrl() {
  const pluginUrl =
    typeof window !== 'undefined' && window.easyJobsJs?.plugin_url
      ? window.easyJobsJs.plugin_url
      : '../wp-content/plugins/easyjobs/';
  return `${pluginUrl.replace(/\/+$/, '')}/${PDFJS_PATH}`;
}

/**
 * Options for `pdfjsLib.getDocument()` when opening an untrusted
 * (candidate-supplied) PDF.
 *
 * - `isEvalSupported: false` — never compile font glyphs with `new Function`
 *   (the CVE-2024-4367 sink). pdf.js 5 no longer has that code path; the flag
 *   keeps an older copy safe if one is ever loaded instead.
 * - `enableXfa: false` — do not render XFA forms (HTML built from the PDF).
 * - `useWasm: false` + `wasmUrl` — decode JPEG 2000 / JBIG2 images with the
 *   bundled JavaScript decoders, so no WebAssembly binaries ship with the plugin.
 *
 * @param {string} url Same-origin stream URL of the PDF.
 * @return {Object} getDocument() parameters.
 */
export function getPdfDocumentOptions(url) {
  return {
    url,
    withCredentials: true,
    isEvalSupported: false,
    enableXfa: false,
    useWasm: false,
    wasmUrl: `${getPdfJsBaseUrl()}/wasm/`,
  };
}

let pdfjsPromise = null;

export function loadPdfJs() {
  if (typeof window !== 'undefined' && window.pdfjsLib) {
    return Promise.resolve(window.pdfjsLib);
  }
  if (pdfjsPromise) return pdfjsPromise;

  const base = getPdfJsBaseUrl();
  pdfjsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = `${base}/pdf.min.js?ver=${PDFJS_VERSION}`;
    script.onload = () => {
      const lib = window.pdfjsLib;
      if (lib) {
        try {
          lib.GlobalWorkerOptions.workerSrc = `${base}/pdf.worker.min.js?ver=${PDFJS_VERSION}`;
        } catch (e) {
          /* noop */
        }
        resolve(lib);
      } else {
        pdfjsPromise = null;
        reject(new Error('pdfjsLib unavailable after load'));
      }
    };
    script.onerror = () => {
      pdfjsPromise = null;
      reject(new Error('Failed to load pdf.js'));
    };
    document.head.appendChild(script);
  });

  return pdfjsPromise;
}
