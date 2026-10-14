import React, { useState, useEffect, useRef, useCallback } from 'react';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-toastify';
import { Icon } from '../icons';
import { ajaxCall, fileUpload } from '../../../../util/ajaxCall';
import { streamFile } from '../../../../util/streamFile';

/**
 * Attachment panel — Files & Attachments and Custom Fields, both fully wired to
 * the plugin's AJAX endpoints, matching the app-end design. (Download/preview
 * are placeholders pending a streaming proxy endpoint.)
 */
const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'];
const PDF_EXTS = ['pdf'];
const DOC_EXTS = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'];
const ACCEPT =
  '.jpg,.png,.jpeg,.gif,.svg,.mp3,.mp4,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar';
const ACCEPTED_EXTS = [
  'jpg',
  'png',
  'jpeg',
  'gif',
  'svg',
  'mp3',
  'mp4',
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'xls',
  'xlsx',
  'zip',
  'rar',
];
const MAX_MB = 2;

const FIELD_TYPES = ['Text', 'Number', 'Date', 'URL', 'Email', 'Phone'];

const stripHtml = (v) => String(v || '').replace(/<[^>]*>/g, '');
const extOf = (a) => {
  if (a?.extension) return String(a.extension).toLowerCase();
  const fn = a?.file_name || a?.name || '';
  return fn.includes('.') ? fn.split('.').pop().toLowerCase() : '';
};
const categoryByExt = (ext) => {
  ext = (ext || '').toLowerCase();
  if (PDF_EXTS.includes(ext)) return 'pdf';
  if (IMAGE_EXTS.includes(ext)) return 'img';
  if (DOC_EXTS.includes(ext)) return 'doc';
  return 'gen';
};
const iconClassOf = (cat) =>
  ({ pdf: 'fi-pdf', img: 'fi-img', doc: 'fi-doc', gen: 'fi-gen' })[cat];
const iconNameOf = (cat) =>
  ({ pdf: 'file-txt', img: 'image', doc: 'file', gen: 'file' })[cat];
const formatSize = (bytes) => {
  bytes = parseInt(bytes, 10) || 0;
  if (bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

// Build a clickable link for URL / Email / Phone typed custom fields.
const fieldLink = (f) => {
  const v = String(f?.value || '').trim();
  if (!v) return null;
  if (f.type === 'URL') return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  if (f.type === 'Email') return `mailto:${v}`;
  if (f.type === 'Phone') return `tel:${v}`;
  return null;
};

const Attachment = ({ candidateDetails }) => {
  const candidateId = candidateDetails?.candidate?.id;

  // ── Files & attachments ──
  const [attachments, setAttachments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    comment: '',
    file: null,
  });
  const [fileError, setFileError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [editAtt, setEditAtt] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', comment: '' });
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleteAtt, setDeleteAtt] = useState(null);
  const fileInputRef = useRef(null);
  const uploadNameRef = useRef(null);
  const editNameRef = useRef(null);

  const fetchAttachments = useCallback(() => {
    if (!candidateId) return;
    ajaxCall('easyjobs_get_attachments', { candidate_id: candidateId }).then(
      (res) => {
        setAttachments(
          res?.status === 'success' && Array.isArray(res.data) ? res.data : [],
        );
      },
    );
  }, [candidateId]);

  // ── Custom fields ──
  const [fields, setFields] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ label: '', value: '', type: 'Text' });
  const [saving, setSaving] = useState(false);
  const [deleteField, setDeleteField] = useState(null);
  const labelRef = useRef(null);

  const fetchFields = useCallback(() => {
    if (!candidateId) return;
    ajaxCall('easyjobs_get_custom_fields', { candidate_id: candidateId }).then(
      (res) => {
        setFields(
          res?.status === 'success' && Array.isArray(res.data) ? res.data : [],
        );
      },
    );
  }, [candidateId]);

  useEffect(() => {
    setShowUpload(false);
    setEditAtt(null);
    setShowAdd(false);
    setEditingId(null);
    fetchAttachments();
    fetchFields();
  }, [fetchAttachments, fetchFields]);

  // ── Attachment helpers ──
  const totalBytes = attachments.reduce(
    (s, a) => s + (parseInt(a.file_size, 10) || 0),
    0,
  );
  const summaryLine = (() => {
    const c = attachments.length;
    const label = c === 1 ? __('file', 'easyjobs') : __('files', 'easyjobs');
    return totalBytes > 0
      ? `${c} ${label} · ${formatSize(totalBytes)} ${__('total', 'easyjobs')}`
      : `${c} ${label}`;
  })();
  const filterChips = (() => {
    const chips = [{ key: 'all', label: __('All', 'easyjobs') }];
    const cats = new Set(attachments.map((a) => categoryByExt(extOf(a))));
    if (cats.has('pdf'))
      chips.push({ key: 'pdf', label: __('PDFs', 'easyjobs') });
    if (cats.has('img'))
      chips.push({ key: 'img', label: __('Images', 'easyjobs') });
    if (cats.has('doc'))
      chips.push({ key: 'doc', label: __('Documents', 'easyjobs') });
    if (cats.has('gen'))
      chips.push({ key: 'gen', label: __('Others', 'easyjobs') });
    return chips;
  })();
  const filteredAttachments =
    activeFilter === 'all'
      ? attachments
      : attachments.filter((a) => categoryByExt(extOf(a)) === activeFilter);
  const metaLine = (a) => {
    const parts = [];
    if (parseInt(a.file_size, 10) > 0) parts.push(formatSize(a.file_size));
    const ext = extOf(a);
    if (ext) parts.push(ext.toUpperCase());
    if (a?.creator?.name) parts.push(stripHtml(a.creator.name));
    if (a?.created_at) parts.push(a.created_at);
    return parts.join(' · ');
  };

  // ── Upload flow ──
  const resetUpload = () => {
    setUploadForm({ name: '', comment: '', file: null });
    setFileError('');
    setDragOver(false);
  };
  const openUpload = () => {
    resetUpload();
    setShowUpload(true);
    setTimeout(() => uploadNameRef.current && uploadNameRef.current.focus(), 0);
  };
  const closeUpload = () => {
    setShowUpload(false);
    resetUpload();
  };
  const pickFile = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_EXTS.includes(ext)) {
      toast.error(__('File type not supported!', 'easyjobs'), {
        autoClose: 1800,
      });
      return;
    }
    if (file.size / 1024 / 1024 > MAX_MB) {
      setFileError(__('File size should be under 2 MB!', 'easyjobs'));
      toast.error(__('File size should be under 2 MB!', 'easyjobs'), {
        autoClose: 1800,
      });
      return;
    }
    setFileError('');
    setUploadForm((s) => ({
      ...s,
      file,
      name: s.name || file.name.replace(/\.[^.]+$/, ''),
    }));
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer?.files?.[0]);
  };
  const doUpload = () => {
    if (uploading || !uploadForm.name.trim() || !uploadForm.file) return;
    setUploading(true);
    fileUpload(
      'easyjobs_upload_attachment',
      { key: 'attachment', file: uploadForm.file, name: uploadForm.file.name },
      {
        candidate_id: candidateId,
        name: uploadForm.name,
        comment: uploadForm.comment,
      },
    ).then((res) => {
      setUploading(false);
      if (res?.status === 'success') {
        toast.success(__('Attachment uploaded', 'easyjobs'), {
          autoClose: 1200,
        });
        closeUpload();
        fetchAttachments();
      } else {
        toast.error(res?.message || __('Something went wrong', 'easyjobs'), {
          autoClose: 2000,
        });
      }
    });
  };

  // ── Edit flow ──
  const openEdit = (a) => {
    setEditAtt(a);
    setEditForm({ name: a.name || '', comment: a.comment || '' });
    setTimeout(() => {
      const el = editNameRef.current;
      if (el) {
        el.focus();
        const len = el.value.length;
        el.setSelectionRange(len, len); // place caret at the end of existing text
      }
    }, 0);
  };
  const saveEdit = () => {
    if (savingEdit || !editForm.name.trim()) return;
    setSavingEdit(true);
    ajaxCall('easyjobs_update_attachment', {
      candidate_id: candidateId,
      attachment_id: editAtt.id,
      name: editForm.name,
      comment: editForm.comment,
    }).then((res) => {
      setSavingEdit(false);
      if (res?.status === 'success') {
        toast.success(__('Attachment updated', 'easyjobs'), {
          autoClose: 1200,
        });
        setEditAtt(null);
        fetchAttachments();
      } else {
        toast.error(res?.message || __('Something went wrong', 'easyjobs'), {
          autoClose: 2000,
        });
      }
    });
  };
  const confirmDeleteAtt = () => {
    const a = deleteAtt;
    if (!a) return;
    setDeleteAtt(null);
    ajaxCall('easyjobs_delete_attachment', {
      candidate_id: candidateId,
      attachment_id: a.id,
    }).then((res) => {
      if (res?.status === 'success') {
        toast.success(__('Attachment removed', 'easyjobs'), {
          autoClose: 1200,
        });
        fetchAttachments();
      } else {
        toast.error(res?.message || __('Something went wrong', 'easyjobs'), {
          autoClose: 2000,
        });
      }
    });
  };
  // Stream via POST → clean blob: URL (no admin-ajax.php / nonce in the address bar).
  const downloadFile = (a) =>
    streamFile(
      'easyjobs_stream_attachment',
      { id: candidateId, attachment_id: a.id, download: 1 },
      { download: true, filename: a.file_name || a.name },
    );
  const previewFile = (a) =>
    streamFile('easyjobs_stream_attachment', {
      id: candidateId,
      attachment_id: a.id,
    });

  // ── Custom-field flow ──
  const resetForm = () => setForm({ label: '', value: '', type: 'Text' });
  const startAdd = () => {
    setEditingId(null);
    resetForm();
    setShowAdd(true);
    setTimeout(() => labelRef.current && labelRef.current.focus(), 0);
  };
  const editField = (f) => {
    setShowAdd(false);
    setEditingId(f.id);
    setForm({
      label: f.label || '',
      value: f.value || '',
      type: f.type || 'Text',
    });
  };
  const cancelCf = () => {
    setShowAdd(false);
    setEditingId(null);
    resetForm();
  };
  const saveCf = () => {
    if (saving) return;
    if (!form.label.trim()) {
      toast.error(__('Field name is required', 'easyjobs'), {
        autoClose: 1500,
      });
      return;
    }
    setSaving(true);
    ajaxCall('easyjobs_save_custom_field', {
      candidate_id: candidateId,
      field_id: editingId || '',
      label: form.label,
      value: form.value,
      type: form.type || 'Text',
    }).then((res) => {
      setSaving(false);
      if (res?.status === 'success') {
        toast.success(
          editingId
            ? __('Field updated', 'easyjobs')
            : __('Field added', 'easyjobs'),
          { autoClose: 1200 },
        );
        cancelCf();
        fetchFields();
      } else {
        toast.error(res?.message || __('Something went wrong', 'easyjobs'), {
          autoClose: 1800,
        });
      }
    });
  };
  const confirmDeleteField = () => {
    const f = deleteField;
    if (!f) return;
    setDeleteField(null);
    ajaxCall('easyjobs_delete_custom_field', {
      candidate_id: candidateId,
      field_id: f.id,
    }).then((res) => {
      if (res?.status === 'success') {
        toast.success(__('Field removed', 'easyjobs'), { autoClose: 1200 });
        if (editingId === f.id) cancelCf();
        fetchFields();
      } else {
        toast.error(res?.message || __('Something went wrong', 'easyjobs'), {
          autoClose: 1800,
        });
      }
    });
  };
  const cfForm = (keyPrefix) => (
    <div className="att-cf-add show" key={keyPrefix}>
      <input
        type="text"
        value={form.label}
        onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))}
        placeholder={__('Field name', 'easyjobs')}
        maxLength={191}
        ref={labelRef}
        onKeyDown={(e) => e.key === 'Enter' && saveCf()}
      />
      <div className="att-cf-add-val">
        <select
          className="att-type-sel"
          value={form.type}
          onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
        >
          {FIELD_TYPES.map((t) => (
            <option key={t} value={t}>
              {__(t, 'easyjobs')}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={form.value}
          onChange={(e) => setForm((s) => ({ ...s, value: e.target.value }))}
          placeholder={__('Value', 'easyjobs')}
          maxLength={2000}
          onKeyDown={(e) => e.key === 'Enter' && saveCf()}
        />
      </div>
      <div className="att-cf-add-acts">
        <button
          className="att-icon-sm ok"
          onClick={saveCf}
          aria-label={__('Save field', 'easyjobs')}
          disabled={saving}
        >
          <Icon name="check" />
        </button>
        <button
          className="att-icon-sm no"
          onClick={cancelCf}
          aria-label={__('Cancel', 'easyjobs')}
        >
          <Icon name="close" />
        </button>
      </div>
    </div>
  );

  const filesEmpty = attachments.length === 0;
  const hasFields = fields.length > 0;

  return (
    <div className="panel active" data-testid="ej-candidate-tabpanel">
      {/* ── Files & Attachments ── */}
      <section className="ejc-card card-pad">
        <div
          className="h-row"
          style={{ marginBottom: filesEmpty ? 0 : '14px' }}
        >
          <div>
            <h2 className="card-h">{__('Files & Attachments', 'easyjobs')}</h2>
            <div className="att-subln">
              {filesEmpty
                ? __('Documents related to this candidate', 'easyjobs')
                : summaryLine}
            </div>
          </div>
          {!filesEmpty ? (
            <button className="btn-outline" onClick={openUpload}>
              <Icon name="upload" />
              {__('Upload file', 'easyjobs')}
            </button>
          ) : null}
        </div>

        {!filesEmpty && filterChips.length > 1 ? (
          <div className="file-filters">
            {filterChips.map((c) => (
              <button
                key={c.key}
                className={`fchip ${activeFilter === c.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
        ) : null}

        {!filesEmpty ? (
          <div className="att-file-list">
            {filteredAttachments.map((a) => {
              const cat = categoryByExt(extOf(a));
              return (
                <div className="att-file-row" key={a.id}>
                  <span className={`att-file-ic ${iconClassOf(cat)}`}>
                    <Icon name={iconNameOf(cat)} />
                  </span>
                  <div className="att-file-mid">
                    <span
                      className="att-file-name"
                      onClick={() => downloadFile(a)}
                    >
                      {a.name}
                    </span>
                    <div className="att-file-meta">{metaLine(a)}</div>
                    {a.comment ? (
                      <div className="att-file-desc" title={a.comment}>
                        &quot;{a.comment}&quot;
                      </div>
                    ) : null}
                  </div>
                  <div className="att-file-acts">
                    <button
                      className="att-act-btn"
                      onClick={() => downloadFile(a)}
                      aria-label={__('Download', 'easyjobs')}
                    >
                      <Icon name="download" />
                    </button>
                    <button
                      className="att-act-btn"
                      onClick={() => previewFile(a)}
                      aria-label={__('Preview', 'easyjobs')}
                    >
                      <Icon name="eye" />
                    </button>
                    <button
                      className="att-act-btn"
                      onClick={() => openEdit(a)}
                      aria-label={__('Edit', 'easyjobs')}
                    >
                      <Icon name="pen" />
                    </button>
                    <button
                      className="att-act-btn del"
                      onClick={() => setDeleteAtt(a)}
                      aria-label={__('Delete', 'easyjobs')}
                    >
                      <Icon name="trash" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="att-empty">
            <div className="ic">
              <Icon name="folder-open" />
            </div>
            <h3>{__('No files uploaded yet', 'easyjobs')}</h3>
            <p>
              {__(
                'Add reference letters, certificates, portfolio samples, or any documents related to this candidate.',
                'easyjobs',
              )}
            </p>
            <button className="btn-outline" onClick={openUpload}>
              <Icon name="upload" />
              {__('Upload file', 'easyjobs')}
            </button>
          </div>
        )}
      </section>

      {/* ── Custom fields ── */}
      <section className="ejc-card card-pad">
        <div
          className="h-row"
          style={{ marginBottom: hasFields || showAdd ? '14px' : 0 }}
        >
          <div>
            <h2 className="card-h">{__('Custom Fields', 'easyjobs')}</h2>
            <div className="att-subln">
              {__('Add any additional info about this candidate', 'easyjobs')}
            </div>
          </div>
          {hasFields || showAdd ? (
            <button className="btn-outline" onClick={startAdd}>
              <Icon name="plus" />
              {__('Add field', 'easyjobs')}
            </button>
          ) : null}
        </div>

        {hasFields ? (
          <div className="att-cf-list">
            {fields.map((f) =>
              editingId === f.id ? (
                cfForm(`edit-${f.id}`)
              ) : (
                <div className="att-cf-row" key={f.id}>
                  <span className="att-cf-label">{f.label}</span>
                  <span className="att-cf-value">
                    {fieldLink(f) ? (
                      <a href={fieldLink(f)} target="_blank" rel="noreferrer">
                        {f.value}
                        {f.type === 'URL' ? <Icon name="ext" /> : null}
                      </a>
                    ) : (
                      f.value
                    )}
                  </span>
                  <div className="att-cf-acts">
                    <button
                      className="att-act-btn"
                      onClick={() => editField(f)}
                      aria-label={__('Edit', 'easyjobs')}
                    >
                      <Icon name="pen" />
                    </button>
                    <button
                      className="att-act-btn del"
                      onClick={() => setDeleteField(f)}
                      aria-label={__('Delete', 'easyjobs')}
                    >
                      <Icon name="trash" />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        ) : null}

        {showAdd ? cfForm('add') : null}

        {!hasFields && !showAdd ? (
          <div className="att-empty" style={{ padding: '48px 24px' }}>
            <div className="ic">
              <Icon name="list-plus" />
            </div>
            <h3>{__('No custom fields yet', 'easyjobs')}</h3>
            <p>
              {__(
                'Track additional info like notice period, alternate contact, current employer, or anything else specific to this candidate.',
                'easyjobs',
              )}
            </p>
            <button className="btn-outline" onClick={startAdd}>
              <Icon name="plus" />
              {__('Add field', 'easyjobs')}
            </button>
          </div>
        ) : null}
      </section>

      {/* ── Upload modal ── */}
      {showUpload ? (
        <div
          className="att-modal-overlay"
          onMouseDown={(e) => e.target === e.currentTarget && closeUpload()}
        >
          <div className="att-modal" role="dialog" aria-modal="true">
            <div className="att-modal-head">
              <h3>{__('Upload file', 'easyjobs')}</h3>
              <button
                className="att-modal-close"
                onClick={closeUpload}
                aria-label={__('Close', 'easyjobs')}
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="att-mfield">
              <label className="att-mlabel">
                {__('File name', 'easyjobs')}
                <span className="att-mhelp">
                  {' '}
                  {__(
                    '· e.g., Portfolio, Reference Letter, Interview Notes',
                    'easyjobs',
                  )}
                </span>
              </label>
              <input
                type="text"
                ref={uploadNameRef}
                value={uploadForm.name}
                onChange={(e) =>
                  setUploadForm((s) => ({ ...s, name: e.target.value }))
                }
                placeholder={__('Add Attachment Name', 'easyjobs')}
                maxLength={100}
              />
            </div>

            <div className="att-mfield">
              <label className="att-mlabel">
                {__('Description', 'easyjobs')}
                <span className="att-mhelp">
                  {' '}
                  {__('· Optional', 'easyjobs')}
                </span>
              </label>
              <textarea
                rows={3}
                maxLength={200}
                value={uploadForm.comment}
                onChange={(e) =>
                  setUploadForm((s) => ({ ...s, comment: e.target.value }))
                }
                placeholder={__(
                  'Write brief description of the purpose of this note or document',
                  'easyjobs',
                )}
              ></textarea>
            </div>

            <div className="att-mfield">
              <label className="att-mlabel">{__('File', 'easyjobs')}</label>
              {!uploadForm.file ? (
                <div
                  className={`att-dropzone ${dragOver ? 'drag' : ''}`}
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                  }}
                  onDrop={onDrop}
                >
                  <Icon name="upload-cloud" />
                  <span className="att-dz-txt">
                    {__('Drop a file here or', 'easyjobs')}{' '}
                    <b>{__('browse', 'easyjobs')}</b>
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept={ACCEPT}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      pickFile(e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                </div>
              ) : (
                <div className="att-file-pick">
                  <span
                    className={`att-fp-ic ${iconClassOf(
                      categoryByExt(
                        uploadForm.file.name.split('.').pop().toLowerCase(),
                      ),
                    )}`}
                  >
                    <Icon
                      name={iconNameOf(
                        categoryByExt(
                          uploadForm.file.name.split('.').pop().toLowerCase(),
                        ),
                      )}
                    />
                  </span>
                  <div className="att-fp-mid">
                    <div className="att-fp-name">{uploadForm.file.name}</div>
                    <div className="att-fp-size">
                      {formatSize(uploadForm.file.size)} ·{' '}
                      {__('Ready', 'easyjobs')}
                    </div>
                    <div className="att-fp-bar">
                      <div
                        className="att-fp-fill"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                  <button
                    className="att-fp-x"
                    onClick={() => setUploadForm((s) => ({ ...s, file: null }))}
                    aria-label={__('Remove file', 'easyjobs')}
                  >
                    <Icon name="close" />
                  </button>
                </div>
              )}
              <div className="att-dz-help">
                {__(
                  'PDF, DOC, DOCX, JPG, PNG and more · up to 2 MB',
                  'easyjobs',
                )}
              </div>
              {fileError ? (
                <div className="att-error att-dz-error">
                  <Icon name="alert" />
                  <span>{fileError}</span>
                </div>
              ) : null}
            </div>

            <div className="att-modal-foot">
              <button className="att-btn-ghost" onClick={closeUpload}>
                {__('Cancel', 'easyjobs')}
              </button>
              <button
                className="att-btn-solid"
                disabled={
                  !uploadForm.name.trim() || !uploadForm.file || uploading
                }
                onClick={doUpload}
              >
                {uploading
                  ? __('Uploading...', 'easyjobs')
                  : __('Upload', 'easyjobs')}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Edit-attachment modal ── */}
      {editAtt ? (
        <div
          className="att-modal-overlay"
          onMouseDown={(e) => e.target === e.currentTarget && setEditAtt(null)}
        >
          <div className="att-modal" role="dialog" aria-modal="true">
            <div className="att-modal-head">
              <h3>{__('Update Attachment', 'easyjobs')}</h3>
              <button
                className="att-modal-close"
                onClick={() => setEditAtt(null)}
                aria-label={__('Close', 'easyjobs')}
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="att-mfield">
              <label className="att-mlabel">{__('Comment', 'easyjobs')}</label>
              <textarea
                ref={editNameRef}
                rows={3}
                maxLength={200}
                value={editForm.comment}
                onChange={(e) =>
                  setEditForm((s) => ({ ...s, comment: e.target.value }))
                }
                placeholder={__('Add comment', 'easyjobs')}
              ></textarea>
            </div>
            <div className="att-modal-foot">
              <button
                className="att-btn-ghost"
                onClick={() => setEditAtt(null)}
              >
                {__('Cancel', 'easyjobs')}
              </button>
              <button
                className="att-btn-solid"
                disabled={!editForm.name.trim() || savingEdit}
                onClick={saveEdit}
              >
                {savingEdit
                  ? __('Updating...', 'easyjobs')
                  : __('Update', 'easyjobs')}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Delete confirmations (plugin's global dialog) ── */}
      <div
        className="dg-wrapper ej-candidate-confirmation"
        style={{ display: deleteAtt ? 'flex' : 'none' }}
      >
        <div className="dg-backdrop"></div>
        <div className="dg-container">
          <div className="dg-content-cont dg-content-cont--floating">
            <div className="dg-main-content">
              <div className="dg-view-wrapper">
                <div className="dg-content-body dg-content-body--has-title">
                  <h6 className="dg-title">{__('Confirmation', 'easyjobs')}</h6>
                  <div className="dg-content">
                    {__(
                      'Are you sure, you want to remove this attachment?',
                      'easyjobs',
                    )}
                  </div>
                </div>
                <div className="dg-content-footer">
                  <button
                    className="dg-btn dg-btn--cancel"
                    onClick={() => setDeleteAtt(null)}
                  >
                    <span>{__('No', 'easyjobs')}</span>
                  </button>
                  <button
                    className="dg-btn dg-btn--ok dg-pull-right"
                    onClick={confirmDeleteAtt}
                  >
                    <span className="dg-btn-content">
                      {__('Yes', 'easyjobs')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="dg-wrapper ej-candidate-confirmation"
        style={{ display: deleteField ? 'flex' : 'none' }}
      >
        <div className="dg-backdrop"></div>
        <div className="dg-container">
          <div className="dg-content-cont dg-content-cont--floating">
            <div className="dg-main-content">
              <div className="dg-view-wrapper">
                <div className="dg-content-body dg-content-body--has-title">
                  <h6 className="dg-title">{__('Confirmation', 'easyjobs')}</h6>
                  <div className="dg-content">
                    {__(
                      'Are you sure, you want to remove this field?',
                      'easyjobs',
                    )}
                  </div>
                </div>
                <div className="dg-content-footer">
                  <button
                    className="dg-btn dg-btn--cancel"
                    onClick={() => setDeleteField(null)}
                  >
                    <span>{__('No', 'easyjobs')}</span>
                  </button>
                  <button
                    className="dg-btn dg-btn--ok dg-pull-right"
                    onClick={confirmDeleteField}
                  >
                    <span className="dg-btn-content">
                      {__('Yes', 'easyjobs')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attachment;
