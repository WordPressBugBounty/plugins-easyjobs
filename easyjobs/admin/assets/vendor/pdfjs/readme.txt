PDF.js 3.11.174 (Mozilla) - https://mozilla.github.io/pdf.js/
Source: https://github.com/mozilla/pdf.js/tree/v3.11.174
Files copied unchanged from the npm package pdfjs-dist@3.11.174 (build/).
License: Apache License 2.0 (see LICENSE.txt).

Used by the admin candidate resume viewer
(admin/react/src/util/pdfLoader.js). Bundled locally so the plugin does not
load code from a third-party CDN.

To update: npm pack pdfjs-dist@<version>, copy build/pdf.min.js and
build/pdf.worker.min.js here, then update PDFJS_VERSION in
admin/react/src/util/pdfLoader.js and the version above.
