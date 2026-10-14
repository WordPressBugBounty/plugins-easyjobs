import React, { useState, useRef, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DateTime from 'react-datetime';
import { Icon } from './icons';
import { ajaxCall } from '../../../util/ajaxCall';

// YYYY-MM-DD → MM/DD/YYYY (what the backend Carbon-parses).
export const toApiDate = (ymd) => {
  if (!ymd) return '';
  const [y, m, d] = String(ymd).split('-');
  return y && m && d ? `${m}/${d}/${y}` : '';
};
// "17 Jun, 2026"/ISO/MM-DD-YYYY → YYYY-MM-DD for seeding the date input.
export const toInputDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return '';
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
};
// Today as YYYY-MM-DD — the min selectable expire date (matches the app).
const todayInput = () => toInputDate(new Date());
const startOfToday = () => new Date(`${todayInput()}T00:00:00`);

/**
 * Shared assessment expire-date picker (react-datetime calendar, like the app).
 * Holds/emits a YYYY-MM-DD string; disallows past dates; read-only input so the
 * value can only come from the calendar. Controlled open state so clicking the
 * field/icon toggles the calendar (react-datetime then disables its own
 * outside-click + close-on-select, so we handle both here).
 */
export const ExpireDatePicker = ({ value, onChange, hasError }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div
      className={`asmt-date ${open ? 'is-open' : ''} ${
        hasError ? 'has-err' : ''
      }`}
      ref={wrapRef}
    >
      <DateTime
        open={open}
        value={value ? new Date(`${value}T00:00:00`) : ''}
        dateFormat="MM/DD/YYYY"
        timeFormat={false}
        isValidDate={(current) => current.isSameOrAfter(startOfToday())}
        inputProps={{
          placeholder: __('mm/dd/yyyy', 'easyjobs'),
          readOnly: true,
          className: 'asmt-date-input',
          onMouseDown: () => setOpen((o) => !o),
        }}
        onChange={(val) => {
          if (
            val &&
            typeof val === 'object' &&
            typeof val.isValid === 'function' &&
            val.isValid()
          ) {
            onChange(val.format('YYYY-MM-DD'));
            setOpen(false);
          } else {
            onChange('');
          }
        }}
      />
      <span
        className="asmt-date-ic"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
      >
        <Icon name="calendar" />
      </span>
    </div>
  );
};

// Shared react-select props for the assessment modals (indigo theme lives in
// SCSS via classNamePrefix; menu opens inline within the overflow-visible modal).
export const selectBase = {
  classNamePrefix: 'react-select',
  menuPlacement: 'auto',
  noOptionsMessage: () => __('No assessments available.', 'easyjobs'),
};

// A company assessment option may arrive flagged as already assigned to this
// candidate (key varies by API version) — tolerate the common shapes.
const optAssigned = (o) =>
  !!(o?.is_assigned ?? o?.assigned ?? o?.is_selected ?? o?.selected);

/**
 * Assign Assessment modal — EasyJobs platform only. Faithful to the app: a
 * platform select (fixed to EasyJobs here), an assessment dropdown sourced from
 * the company's assessments, and a required expire date. Validates client-side
 * before hitting the (nonce + capability guarded) AJAX endpoint. Shared by the
 * Evaluation tab and the candidate-header menu.
 */
const AssignAssessmentModal = ({
  candidateId,
  candidateGid,
  jobId,
  onClose,
  onDone,
}) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assessmentId, setAssessmentId] = useState('');
  const [expire, setExpire] = useState('');
  const [showAssigned, setShowAssigned] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;
    ajaxCall('easyjobs_get_assessment_list', {
      candidate_id: candidateId,
      applicant_gid: candidateGid,
    }).then((res) => {
      if (!alive) return;
      if (res?.status === 'success') {
        const d = res.data;
        setList(Array.isArray(d) ? d : d?.data || []);
      } else if (res?.message) {
        toast.error(res.message, { autoClose: 2200 });
      }
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [candidateId, candidateGid]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const hasAssignedFlagged = list.some(optAssigned);
  const options = showAssigned ? list : list.filter((o) => !optAssigned(o));

  const platformOptions = [
    { value: 'easy_jobs', label: __('EasyJobs', 'easyjobs') },
  ];
  const assessmentOptions = options.map((o) => ({
    value: o.id,
    label: o.name || o.title || `#${o.id}`,
  }));
  const selectedAssessment =
    assessmentOptions.find((o) => o.value === assessmentId) || null;

  const submit = () => {
    const next = {};
    if (!assessmentId)
      next.assessment = __('Please select an assessment.', 'easyjobs');
    if (!expire) next.expire = __('Expire date is required.', 'easyjobs');
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    ajaxCall('easyjobs_assign_candidate_assessment', {
      candidate_id: candidateId,
      job_id: jobId,
      assessment_id: assessmentId,
      expire_date: toApiDate(expire),
    }).then((res) => {
      setSubmitting(false);
      if (res?.status === 'success') {
        toast.success(res.message || __('Assessment assigned.', 'easyjobs'), {
          autoClose: 1800,
        });
        onDone();
      } else {
        toast.error(
          res?.message || __('Could not assign the assessment.', 'easyjobs'),
          { autoClose: 2400 },
        );
      }
    });
  };

  return (
    <div
      className="att-modal-overlay"
      onMouseDown={(e) => {
        // Only the backdrop closes the modal; inner clicks must still reach the
        // document so react-datetime's outside-click can dismiss the calendar.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="att-modal att-modal--overflow">
        <div className="att-modal-head">
          <h3>{__('Assign Assessment', 'easyjobs')}</h3>
          <button
            className="att-modal-close"
            onClick={onClose}
            aria-label={__('Close', 'easyjobs')}
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="att-mfield">
          <label className="att-mlabel">
            {__('Select platform', 'easyjobs')}{' '}
            <span className="asmt-req">*</span>
          </label>
          <Select
            {...selectBase}
            className="asmt-rs asmt-rs--disabled"
            options={platformOptions}
            value={platformOptions[0]}
            isDisabled
            isSearchable={false}
          />
        </div>

        <div className="att-mfield">
          <div className="asmt-label-row">
            <label className="att-mlabel">
              {__('Select assessment', 'easyjobs')}{' '}
              <span className="asmt-req">*</span>
            </label>
            {hasAssignedFlagged ? (
              <button
                type="button"
                className="asmt-assigned-link"
                onClick={() => setShowAssigned((v) => !v)}
              >
                {showAssigned
                  ? __('Hide Assigned Assessment', 'easyjobs')
                  : __('Show Assigned Assessment', 'easyjobs')}
              </button>
            ) : null}
          </div>
          <Select
            {...selectBase}
            className={`asmt-rs ${errors.assessment ? 'asmt-rs--err' : ''}`}
            options={assessmentOptions}
            value={selectedAssessment}
            isLoading={loading}
            isDisabled={loading}
            isSearchable={false}
            placeholder={
              loading
                ? __('Loading…', 'easyjobs')
                : __('Select assessment', 'easyjobs')
            }
            onChange={(opt) => {
              setAssessmentId(opt ? opt.value : '');
              if (errors.assessment)
                setErrors((p) => ({ ...p, assessment: undefined }));
            }}
          />
          {errors.assessment ? (
            <p className="att-error">{errors.assessment}</p>
          ) : null}
        </div>

        <div className="att-mfield">
          <label className="att-mlabel">
            {__('Expire date', 'easyjobs')} <span className="asmt-req">*</span>
          </label>
          <ExpireDatePicker
            value={expire}
            hasError={!!errors.expire}
            onChange={(v) => {
              setExpire(v);
              if (errors.expire)
                setErrors((p) => ({ ...p, expire: undefined }));
            }}
          />
          {errors.expire ? <p className="att-error">{errors.expire}</p> : null}
        </div>

        <div className="att-modal-foot asmt-foot">
          <p className="asmt-note">
            {__(
              'Candidate will be notified by message once the assessment is assigned.',
              'easyjobs',
            )}
          </p>
          <div className="asmt-foot-btns">
            <button
              className="att-btn-ghost"
              onClick={onClose}
              disabled={submitting}
            >
              {__('Cancel', 'easyjobs')}
            </button>
            <button
              className="att-btn-solid"
              onClick={submit}
              disabled={submitting}
            >
              {submitting
                ? __('Assigning…', 'easyjobs')
                : __('Assign Assessment', 'easyjobs')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignAssessmentModal;
