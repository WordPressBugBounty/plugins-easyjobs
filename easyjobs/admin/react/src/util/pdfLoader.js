/**
 * Loads pdf.js (UMD build) at runtime and configures its worker.
 * Avoids bundling pdfjs-dist into the React build. Resolves with `window.pdfjsLib`.
 * Rejects if the script can't load (caller should fall back to an iframe).
 *
 * The files ship with the plugin in `admin/assets/vendor/pdfjs/` (see the
 * readme.txt there). WordPress.org does not allow plugins to load code from a
 * third-party CDN, so never point this at an external host.
 */
export const PDFJS_VERSION = '3.11.174';
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

let pdfjsPromise = null;

export function loadPdfJs() {
  if (typeof window !== 'undefined' && window.pdfjsLib) {
    return Promise.resolve(window.pdfjsLib);
  }
  if (pdfjsPromise) return pdfjsPromise;

  const base = getPdfJsBaseUrl();
  pdfjsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${base}/pdf.min.js?ver=${PDFJS_VERSION}`;
    script.async = true;
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
