PDF.js 5.7.284 (Mozilla) - https://mozilla.github.io/pdf.js/
Source: https://github.com/mozilla/pdf.js/tree/v5.7.284
License: Apache License 2.0 (see LICENSE.txt).

Used by the admin candidate resume viewer
(admin/react/src/util/pdfLoader.js). Bundled locally so the plugin does not
load code from a third-party CDN.

Files, from the npm package pdfjs-dist@5.7.284. Contents are unchanged; only
the two build files are renamed from .mjs to .js, because module scripts and
module workers are rejected unless the server sends a JavaScript MIME type
and many servers do not map .mjs:
  pdf.min.js                     <- legacy/build/pdf.min.mjs
  pdf.worker.min.js              <- legacy/build/pdf.worker.min.mjs
  wasm/openjpeg_nowasm_fallback.js, wasm/jbig2_nowasm_fallback.js
                                 <- wasm/ (JPEG 2000 / JBIG2 image decoders)
  wasm/LICENSE_*                 <- wasm/ (licences for the decoders)
  LICENSE.txt                    <- LICENSE

The legacy build is used for wider browser support. No WebAssembly binaries
(*.wasm) and no scripting engine (quickjs-eval.*) ship: the viewer opens
documents with useWasm: false, so pdf.js uses the JavaScript decoders above.

Security: keep this on a current release. pdf.js < 4.2.67 is affected by
CVE-2024-4367 (arbitrary JavaScript from a crafted PDF font), and resumes are
candidate-uploaded files rendered inside wp-admin.

To update: npm pack pdfjs-dist@<version>, copy the files listed above (same
renames), then update PDFJS_VERSION in admin/react/src/util/pdfLoader.js, the
version in this file and in README.txt, and run `npm run test:js` and
`composer test:unit` (both check the version and the file list).
