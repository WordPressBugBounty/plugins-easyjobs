import { __ } from '@wordpress/i18n';
import { toast } from 'react-toastify';

// Types that are safe to render inline (can't execute script in our origin).
// Everything else (SVG, HTML, unknown) is downloaded instead of previewed, so a
// malicious upload can never run in the wp-admin origin via a blob: URL.
const SAFE_INLINE = /^(application\/pdf|image\/(png|jpe?g|gif|webp|bmp))/i;

/**
 * Stream a same-origin AJAX file endpoint via POST — keeping the nonce out of
 * the URL — and either download it or open it as a clean `blob:` URL. Mirrors
 * how the resume proxy fetches a file, but hides admin-ajax.php + the nonce.
 *
 * @param {string} action   AJAX action (e.g. 'easyjobs_stream_attachment').
 * @param {object} params   Extra POST fields (id, attachment_id, …).
 * @param {object} opts      { download?:bool, filename?:string, errorMessage?:string }
 *                           Without `filename`, the server's Content-Disposition
 *                           name is used. A non-2xx JSON `{ message }` is toasted.
 * @return {Promise<boolean>} true once the file was handed to the browser.
 */
export async function streamFile(action, params = {}, opts = {}) {
  const { download = false, filename, errorMessage } = opts;
  const fd = new FormData();
  fd.append('action', action);
  fd.append('nonce', easyJobsJs.nonce);
  Object.keys(params).forEach((k) => {
    if (params[k] !== undefined && params[k] !== null) fd.append(k, params[k]);
  });

  try {
    const res = await fetch(easyJobsJs.ajax_url, {
      method: 'POST',
      body: fd,
      credentials: 'same-origin',
    });
    if (!res.ok) {
      let message = '';
      try {
        message = (await res.json())?.message || '';
      } catch (e) {
        // Not JSON (bare status from a proxy) — use the generic message.
      }
      throw new Error(message);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const canInline = !download && SAFE_INLINE.test(blob.type || '');

    if (canInline) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || filenameFromHeader(res) || 'file';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    // Give the browser time to consume the blob before releasing it.
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return true;
  } catch (e) {
    toast.error(
      e?.message || errorMessage || __('Could not open the file.', 'easyjobs'),
      { autoClose: 1800 },
    );
    return false;
  }
}

/**
 * Read the file name from a Content-Disposition header, if the server sent one.
 *
 * @param {Response} res Fetch response.
 * @return {string} File name, or '' when absent.
 */
export function filenameFromHeader(res) {
  const header = res?.headers?.get?.('content-disposition') || '';
  const match = header.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  if (!match) return '';
  try {
    return decodeURIComponent(match[1]);
  } catch (e) {
    return match[1];
  }
}
