import React, { useState, useRef, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Icon } from '../icons';
import { getMarkPercentage } from '../../../../util/helper';
import { ajaxCall } from '../../../../util/ajaxCall';
import { getCandidateDetails } from '../../../../redux/actions/candidateActions';
import AssignAssessmentModal, {
  ExpireDatePicker,
  toApiDate,
  toInputDate,
} from '../AssignAssessmentModal';

// The v1 API formats MCQ answers as "Opt1, Opt2," with a trailing comma — strip it.
const cleanAnswer = (s) =>
  String(s ?? '')
    .trim()
    .replace(/,+\s*$/, '')
    .trim();

/**
 * Score ring (SVG, pathLength=100 so dasharray maps to %).
 */
const Ring = ({ percent = 0, fill, size = 134, label, small }) => {
  const r = 52;
  // `fill` drives the animated arc; `percent` drives the static number label.
  const dash = fill === undefined ? percent : fill;
  return (
    <div
      className="ring-wrap"
      style={small ? { width: 54, height: 54 } : { width: size, height: size }}
    >
      <svg className="ring-svg" viewBox="0 0 120 120">
        <circle className="ring-track" cx="60" cy="60" r={r} strokeWidth="10" />
        <circle
          className="ring-fill"
          cx="60"
          cy="60"
          r={r}
          strokeWidth="10"
          pathLength="100"
          strokeDasharray={`${dash} 100`}
        />
      </svg>
      <div className="ring-center">
        <span className="ring-num">{percent}%</span>
        {label ? <span className="ring-lbl">{label}</span> : null}
      </div>
    </div>
  );
};

/**
 * Single screening-question card — matches the app: Q badge + question, an
 * optional status pill, the answer (clamped with Read more), copy-on-hover.
 */
const ScreeningItem = ({ q, index }) => {
  const [open, setOpen] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current)
      setOverflow(
        bodyRef.current.scrollHeight > bodyRef.current.clientHeight + 2,
      );
  }, [q?.answer]);

  // The v1 candidate API has no `is_skipped` flag, so an empty answer means the
  // candidate skipped the question (matches the app's skipped state).
  const skipped = !!q?.is_skipped || !String(q?.answer ?? '').trim();
  const status = skipped
    ? { cls: 'amber', label: __('Skip', 'easyjobs'), icon: null }
    : q?.is_correct
    ? { cls: 'green', label: __('Correct', 'easyjobs'), icon: 'check' }
    : q?.correct_answer
    ? { cls: 'red', label: __('Incorrect', 'easyjobs'), icon: 'x' }
    : null;

  const copy = () => {
    const text = q?.answer || '';
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text);
      toast.success(__('Answer copied', 'easyjobs'), { autoClose: 1000 });
    }
  };

  return (
    <article className="sq">
      <button
        className="sq-copy"
        onClick={copy}
        aria-label={__('Copy answer', 'easyjobs')}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
      <div className="sq-top">
        <span className="sq-badge">Q{index + 1}</span>
        <span className="sq-q">{q?.asked}</span>
      </div>
      {status ? (
        <div className="sq-status">
          <span className={`pill ${status.cls}`}>
            {status.icon === 'check' ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 12l2.5 2.5 4.5-5" />
              </svg>
            ) : status.icon === 'x' ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M9 9l6 6M15 9l-6 6" />
              </svg>
            ) : (
              <span className="dot"></span>
            )}
            {status.label}
          </span>
        </div>
      ) : null}
      <div className="sq-ans">
        <span className="ans-lbl">{__('Answer', 'easyjobs')}</span>
        <div className={`sq-body ${open ? '' : 'clamp'}`} ref={bodyRef}>
          {skipped ? (
            <span className="ans-flag">{__('Skipped', 'easyjobs')}</span>
          ) : (
            cleanAnswer(q?.answer) || '—'
          )}
          {!open && overflow ? <span className="sq-fade"></span> : null}
        </div>
        {!skipped && !q?.is_correct && q?.correct_answer ? (
          <div className="qz-correct sq-correct">
            <span className="ans-lbl">
              {__('Correct Answered', 'easyjobs')}
            </span>
            <div className="ans-val correct">
              {cleanAnswer(q.correct_answer)}
            </div>
          </div>
        ) : null}
        {overflow ? (
          <button className="sq-more" onClick={() => setOpen((v) => !v)}>
            {open ? __('Read less', 'easyjobs') : __('Read more', 'easyjobs')}
          </button>
        ) : null}
      </div>
    </article>
  );
};

// "17 Jun, 2026" — matches the app's date format.
const fmtDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return `${dt.getDate()} ${dt.toLocaleString('en-US', {
    month: 'short',
  })}, ${dt.getFullYear()}`;
};

// Maps the assessment status (numeric or string) to a pill — mirrors the app.
// True when the expire date is before today (date-only comparison).
const isAssessmentExpired = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
};

const assessmentStatus = (a) => {
  const s = a?.status;
  const str = String(s).toLowerCase();
  if (s === 5 || str.includes('complet'))
    return { cls: 'green', label: __('Complete', 'easyjobs') };
  if (s === 2 || str.includes('progress'))
    return { cls: 'amber', label: __('In Progress', 'easyjobs') };
  // EXPIRE status (9) or a passed expire date — an unfinished assessment whose
  // deadline has gone is expired, not pending.
  if (
    s === 9 ||
    str.includes('expire') ||
    isAssessmentExpired(a?.expire_date)
  ) {
    return { cls: 'red', label: __('Expire', 'easyjobs') };
  }
  return { cls: 'neutral', label: __('Pending', 'easyjobs') };
};

/**
 * Single assessment card (collapsed row + expandable detail) — faithful port of
 * the app's EasyJobs assessment card: stat grid + result question list.
 */
const AssessmentCard = ({ a, open, onToggle, onEdit, onDelete }) => {
  const st = assessmentStatus(a);
  const hasMarks =
    a?.marks_obtained !== undefined && a?.marks_obtained !== null;
  // The Overall Score ring is only meaningful once the assessment has a result
  // — the API sends `percent` only then (matches the app's hasOwnProperty check).
  const hasScore = a?.percent !== undefined && a?.percent !== null;
  const pct = Number(a?.percent) || 0;
  const questions = a?.questions || [];

  return (
    <div className={`asmt-card ${open ? 'open' : ''}`}>
      <div className="asmt-row" onClick={onToggle}>
        <span className="asmt-ic">
          <svg viewBox="0 0 24 24">
            <rect
              x="8"
              y="3"
              width="8"
              height="4"
              rx="1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 5h2a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2M8.5 12h.01M8.5 16h.01M12 12h3.5M12 16h3.5"
            />
          </svg>
        </span>
        <div className="asmt-mid">
          <div className="asmt-title">{a?.name || a?.test_name || '—'}</div>
          {a?.expire_date ? (
            <div className="asmt-meta">
              {__('Expires', 'easyjobs')} {fmtDate(a.expire_date)}
            </div>
          ) : null}
        </div>
        <div className="asmt-status">
          <span className={`pill ${st.cls}`}>
            <span className="dot"></span>
            {st.label}
          </span>
          {hasMarks ? (
            <span className="asmt-sub">
              {a.marks_obtained} {__('out of', 'easyjobs')} {a.total_marks}
            </span>
          ) : null}
        </div>
        <div className="asmt-acts" onClick={(e) => e.stopPropagation()}>
          <button
            className={`eval-act-btn ${open ? 'active' : ''}`}
            onClick={onToggle}
            aria-label={__('View', 'easyjobs')}
          >
            <Icon name="eye" />
          </button>
          <button
            className="eval-act-btn"
            onClick={() => onEdit && onEdit(a)}
            aria-label={__('Edit', 'easyjobs')}
          >
            <Icon name="pen" />
          </button>
          <button
            className="eval-act-btn del"
            onClick={() => onDelete && onDelete(a)}
            aria-label={__('Delete', 'easyjobs')}
          >
            <Icon name="trash" />
          </button>
        </div>
      </div>

      {open ? (
        <div className="asmt-detail">
          <div className="asmt-detail-body">
            <div
              className={`eval-stat-grid ${
                hasScore ? '' : 'eval-stat-grid--noscore'
              }`}
            >
              {hasScore ? (
                <div className="eval-stat-card eval-stat-card--chart">
                  <p className="eval-stat-label">
                    {__('Overall Score', 'easyjobs')}
                  </p>
                  <div className="ring-wrap eval-ring-md">
                    <svg className="ring-svg" viewBox="0 0 96 96">
                      <circle
                        className="ring-track"
                        cx="48"
                        cy="48"
                        r="40"
                        strokeWidth="8"
                      />
                      <circle
                        className="ring-fill"
                        cx="48"
                        cy="48"
                        r="40"
                        strokeWidth="8"
                        pathLength="100"
                        strokeDasharray={`${pct} 100`}
                      />
                    </svg>
                    <div className="ring-center">
                      <span className="ring-num eval-ring-num-md">{pct}%</span>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="eval-stat-cells">
                <div className="eval-stat-card">
                  <span className="eval-stat-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
                      <path d="M12 17h.01" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </span>
                  <div className="eval-stat-cell-info">
                    <p className="eval-stat-label">
                      {__('Total Questions', 'easyjobs')}
                    </p>
                    <p className="eval-stat-value">{a?.count}</p>
                  </div>
                </div>
                <div className="eval-stat-card">
                  <span className="eval-stat-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" />
                      <path d="M8 12h8M8 16h6" />
                    </svg>
                  </span>
                  <div className="eval-stat-cell-info">
                    <p className="eval-stat-label">
                      {__('Total Marks', 'easyjobs')}
                    </p>
                    <p className="eval-stat-value">{a?.total_marks}</p>
                  </div>
                </div>
                <div className="eval-stat-card">
                  <span className="eval-stat-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M16 3v4M8 3v4M3 10h18" />
                    </svg>
                  </span>
                  <div className="eval-stat-cell-info">
                    <p className="eval-stat-label">
                      {__('Expire date', 'easyjobs')}
                    </p>
                    <p className="eval-stat-value">{fmtDate(a?.expire_date)}</p>
                  </div>
                </div>
                {hasMarks ? (
                  <div className="eval-stat-card">
                    <span className="eval-stat-ic">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8.5 12l2.5 2.5 4.5-5" />
                      </svg>
                    </span>
                    <div className="eval-stat-cell-info">
                      <p className="eval-stat-label">
                        {__('Marks Obtained', 'easyjobs')}
                      </p>
                      <p className="eval-stat-value">{a.marks_obtained}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {a?.show_result && questions.length ? (
            <div className="asmt-detail-body">
              <div className="qz-list">
                {questions.map((q, i) => (
                  <div className="qz" key={i}>
                    <div className="qz-top">
                      <span className="qz-q">
                        <b>Q{i + 1}.</b>
                        {q?.asked}
                      </span>
                      {q?.is_skipped ? (
                        <span className="pill amber">
                          <span className="dot"></span>
                          {__('Skip', 'easyjobs')}
                        </span>
                      ) : q?.is_correct ? (
                        <span className="pill green">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M8.5 12l2.5 2.5 4.5-5" />
                          </svg>
                          {__('Correct', 'easyjobs')}
                        </span>
                      ) : (
                        <span className="pill red">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M9 9l6 6M15 9l-6 6" />
                          </svg>
                          {__('Incorrect', 'easyjobs')}
                        </span>
                      )}
                    </div>
                    <div className="qz-ans">
                      <span className="ans-lbl">
                        {__('Applicant Answered', 'easyjobs')}
                      </span>
                      <div className="ans-val">
                        {cleanAnswer(q?.answer) || '—'}
                      </div>
                    </div>
                    {!q?.is_correct && q?.correct_answer ? (
                      <div className="qz-correct">
                        <span className="ans-lbl">
                          {__('Correct Answered', 'easyjobs')}
                        </span>
                        <div className="ans-val correct">
                          {cleanAnswer(q.correct_answer)}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

/**
 * Update Assessment modal — the assessment name is read-only; only the expire
 * date is editable (re-assigning resets the candidate's progress, app-side).
 */
const UpdateAssessmentModal = ({ assessment, jobId, onClose, onDone }) => {
  const [expire, setExpire] = useState(toInputDate(assessment?.expire_date));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = () => {
    if (!expire) {
      setError(__('Expire date is required.', 'easyjobs'));
      return;
    }
    setSubmitting(true);
    ajaxCall('easyjobs_update_candidate_assessment', {
      job_id: jobId,
      assessment_id: assessment?.id,
      expire_date: toApiDate(expire),
    }).then((res) => {
      setSubmitting(false);
      if (res?.status === 'success') {
        toast.success(res.message || __('Assessment updated.', 'easyjobs'), {
          autoClose: 1800,
        });
        onDone();
      } else {
        toast.error(
          res?.message || __('Could not update the assessment.', 'easyjobs'),
          { autoClose: 2400 },
        );
      }
    });
  };

  return (
    <div
      className="att-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="att-modal att-modal--overflow">
        <div className="att-modal-head">
          <h3>{__('Update Assessment', 'easyjobs')}</h3>
          <button
            className="att-modal-close"
            onClick={onClose}
            aria-label={__('Close', 'easyjobs')}
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="att-mfield">
          <label className="att-mlabel">{__('Assessment', 'easyjobs')}</label>
          <div className="asmt-readonly">
            {assessment?.name || assessment?.test_name || '—'}
          </div>
        </div>

        <div className="att-mfield">
          <label className="att-mlabel">
            {__('Expire date', 'easyjobs')} <span className="asmt-req">*</span>
          </label>
          <ExpireDatePicker
            value={expire}
            hasError={!!error}
            onChange={(v) => {
              setExpire(v);
              if (error) setError('');
            }}
          />
          {error ? <p className="att-error">{error}</p> : null}
        </div>

        <div className="att-modal-foot">
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
              ? __('Updating…', 'easyjobs')
              : __('Update', 'easyjobs')}
          </button>
        </div>
      </div>
    </div>
  );
};

const Evaluation = ({ candidateDetails, getCandidateDetails }) => {
  const candidate = candidateDetails?.candidate || {};
  const evaluation = candidateDetails?.evaluation || {};
  const score = candidate?.score || {};

  const hasQuiz = !!evaluation?.quiz;
  const screening = evaluation?.questions || [];
  const hasScreening = screening.length > 0;
  const assessments = evaluation?.assessments || [];
  const hasAssessment = assessments.length > 0;
  const showAiScore =
    candidateDetails?.global_ai_enabled && evaluation?.showAiScore;

  const final = parseInt(score?.final_score) || 0;
  const skill = parseInt(score?.skill) || 0;
  const edu = parseInt(score?.education ?? evaluation?.scores?.education) || 0;
  const exp = parseInt(score?.experience) || 0;

  const matchPill =
    final >= 75
      ? { cls: 'green', label: __('Strong match', 'easyjobs') }
      : final >= 50
      ? { cls: 'amber', label: __('Moderate match', 'easyjobs') }
      : { cls: 'red', label: __('Weak match', 'easyjobs') };

  const [sub, setSub] = useState('assessments');

  // Assessment CRUD modal state.
  const candidateId = candidate?.id;
  const candidateGid = candidate?.generated_id;
  const jobId = candidate?.job_id;
  const [assignOpen, setAssignOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  // Accordion: only one assessment card expanded at a time (matches the app).
  const [openAsmtId, setOpenAsmtId] = useState(null);

  // Re-pull the candidate (which carries evaluation.assessments) after any
  // assign/update/delete so the list reflects the change.
  const refreshAssessments = () => {
    if (candidateId) getCandidateDetails({ id: candidateId });
  };

  const confirmDelete = () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    ajaxCall('easyjobs_delete_candidate_assessment', {
      job_id: jobId,
      assessment_id: deleteTarget.id,
    }).then((res) => {
      setDeleting(false);
      if (res?.status === 'success') {
        toast.success(res.message || __('Assessment removed.', 'easyjobs'), {
          autoClose: 1800,
        });
        setDeleteTarget(null);
        refreshAssessments();
      } else {
        toast.error(
          res?.message || __('Could not remove the assessment.', 'easyjobs'),
          { autoClose: 2400 },
        );
      }
    });
  };

  // Animate the AI-score bars from 0 → their value when the tab mounts (matches
  // the app's growing-bar effect). Two rAFs guarantee the 0% width paints first.
  const [animateBars, setAnimateBars] = useState(false);
  useEffect(() => {
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setAnimateBars(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, []);

  // Replay the quiz Overall-Score ring sweep every time the Quiz subtab opens.
  const [quizAnim, setQuizAnim] = useState(false);
  useEffect(() => {
    if (sub !== 'quiz') {
      setQuizAnim(false);
      return undefined;
    }
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setQuizAnim(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [sub]);

  const [showCalc, setShowCalc] = useState(false);
  const calcRef = useRef(null);
  useEffect(() => {
    const onDoc = (e) => {
      if (calcRef.current && !calcRef.current.contains(e.target))
        setShowCalc(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const quizPct = getMarkPercentage(
    evaluation?.quiz?.totalMarks,
    evaluation?.quiz?.marksObtained,
  );

  const [quizFilter, setQuizFilter] = useState('all');
  const quizQuestions = evaluation?.quiz_questions || [];
  const quizCorrectCount = quizQuestions.filter((q) => q?.is_correct).length;
  const quizIncorrectCount = quizQuestions.filter((q) => !q?.is_correct).length;
  const filteredQuiz = quizQuestions
    .map((q, i) => ({ q, num: i + 1 }))
    .filter(({ q }) => {
      if (quizFilter === 'correct') return q?.is_correct;
      if (quizFilter === 'incorrect') return !q?.is_correct;
      return true;
    });
  const quizScorePill =
    quizPct >= 80
      ? { cls: 'green', label: __('Excellent', 'easyjobs') }
      : quizPct >= 50
      ? { cls: 'amber', label: __('Average', 'easyjobs') }
      : { cls: 'red', label: __('Poor', 'easyjobs') };

  return (
    <div className="panel active" data-testid="ej-candidate-tabpanel">
      {/* AI score card */}
      {showAiScore ? (
        <section className="ejc-card score-card">
          <div className="score-head">
            <div className="left">
              <span className="ai-spark">
                <Icon name="sparkles" />
              </span>
              <h2 className="card-h">{__('AI Score', 'easyjobs')}</h2>
            </div>
            <div className="score-actions" ref={calcRef}>
              <button
                className="calc-link"
                onClick={() => setShowCalc((v) => !v)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                {__('How is this calculated?', 'easyjobs')}
              </button>
              {showCalc ? (
                <div className="calc-pop" onClick={(e) => e.stopPropagation()}>
                  <h4>{__('How the AI score works', 'easyjobs')}</h4>
                  <p>
                    {__(
                      "We match the candidate's resume and application against the job requirements across three dimensions. The overall score is the average of these dimensions.",
                      'easyjobs',
                    )}
                  </p>
                  <div className="calc-rows">
                    <div className="calc-row">
                      <span>{__('Skills', 'easyjobs')}</span>
                      <b>{skill}%</b>
                    </div>
                    <div className="calc-row">
                      <span>{__('Education', 'easyjobs')}</span>
                      <b>{edu}%</b>
                    </div>
                    <div className="calc-row">
                      <span>{__('Experience', 'easyjobs')}</span>
                      <b>{exp}%</b>
                    </div>
                  </div>
                  <p className="calc-note">
                    {__(
                      'Scores are guidance only and should support — not replace — your judgment.',
                      'easyjobs',
                    )}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
          <div className="score-body">
            <div className="score-hero">
              <Ring
                percent={final}
                fill={animateBars ? final : 0}
                label={__('Overall', 'easyjobs')}
              />
              <span className={`pill ${matchPill.cls}`}>
                <span className="dot"></span>
                {matchPill.label}
              </span>
            </div>
            <div className="score-div"></div>
            <div className="score-breaks">
              <div className="brk">
                <span className="brk-label">{__('Skills', 'easyjobs')}</span>
                <span className="brk-val">{skill}%</span>
                <span className="brk-bar">
                  <i style={{ width: animateBars ? `${skill}%` : '0%' }}></i>
                </span>
              </div>
              <div className="brk">
                <span className="brk-label">{__('Education', 'easyjobs')}</span>
                <span className="brk-val">{edu}%</span>
                <span className="brk-bar">
                  <i style={{ width: animateBars ? `${edu}%` : '0%' }}></i>
                </span>
              </div>
              <div className="brk">
                <span className="brk-label">
                  {__('Experience', 'easyjobs')}
                </span>
                <span className="brk-val">{exp}%</span>
                <span className="brk-bar">
                  <i style={{ width: animateBars ? `${exp}%` : '0%' }}></i>
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Sub-tabs */}
      <div>
        <nav className="subtabs">
          <button
            className={`subtab ${sub === 'assessments' ? 'active' : ''}`}
            onClick={() => setSub('assessments')}
          >
            {__('Assessments', 'easyjobs')}{' '}
            <span className="cb">{assessments.length}</span>
          </button>
          {hasQuiz ? (
            <button
              className={`subtab ${sub === 'quiz' ? 'active' : ''}`}
              onClick={() => setSub('quiz')}
            >
              {__('Quiz', 'easyjobs')}{' '}
              <span className="cb">{evaluation?.quiz?.count}</span>
            </button>
          ) : null}
          {hasScreening ? (
            <button
              className={`subtab ${sub === 'screening' ? 'active' : ''}`}
              onClick={() => setSub('screening')}
            >
              {__('Screening Questions', 'easyjobs')}{' '}
              <span className="cb">{screening.length}</span>
            </button>
          ) : null}
        </nav>

        {/* Assessments */}
        {sub === 'assessments' ? (
          <section className="subpanel active">
            <div className="eval-sec-head">
              <div>
                {hasAssessment ? (
                  <div className="subln">
                    {assessments.length > 1
                      ? `${__('You have assigned', 'easyjobs')} ${
                          assessments.length
                        } ${__('assessments so far!', 'easyjobs')}`
                      : `${__('You have assigned', 'easyjobs')} ${
                          assessments.length
                        } ${__('assessment so far!', 'easyjobs')}`}
                  </div>
                ) : null}
              </div>
              <button
                className="btn-outline"
                onClick={() => setAssignOpen(true)}
              >
                <Icon name="plus" />
                {__('Assign Assessment', 'easyjobs')}
              </button>
            </div>

            {hasAssessment ? (
              <div className="asmt-list">
                {assessments.map((a, i) => {
                  const cid = a?.id ?? i;
                  return (
                    <AssessmentCard
                      a={a}
                      key={cid}
                      open={openAsmtId === cid}
                      onToggle={() =>
                        setOpenAsmtId((cur) => (cur === cid ? null : cid))
                      }
                      onEdit={(asmt) => setEditTarget(asmt)}
                      onDelete={(asmt) => setDeleteTarget(asmt)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="asmt-empty">
                <span className="asmt-empty-ic">
                  <Icon name="clip-list" />
                </span>
                <p>
                  {__("You haven't assigned any assessment yet!", 'easyjobs')}
                </p>
              </div>
            )}
          </section>
        ) : null}

        {/* Quiz */}
        {sub === 'quiz' && hasQuiz ? (
          <section className="subpanel active">
            <div className="quiz-strip">
              <div className="qs-sec">
                <span className="qs-lbl">
                  {__('Overall Score', 'easyjobs')}
                </span>
                <div className="qs-overall">
                  <div className="qs-ring">
                    <Ring
                      percent={quizPct}
                      fill={quizAnim ? quizPct : 0}
                      small
                    />
                  </div>
                  <span className={`pill ${quizScorePill.cls}`}>
                    <span className="dot"></span>
                    {quizScorePill.label}
                  </span>
                </div>
              </div>
              <div className="qs-sec">
                <span className="qs-lbl">
                  {__('Total Questions', 'easyjobs')}
                </span>
                <span className="qs-val">{evaluation?.quiz?.count}</span>
              </div>
              <div className="qs-sec">
                <span className="qs-lbl">{__('Total Marks', 'easyjobs')}</span>
                <span className="qs-val">{evaluation?.quiz?.totalMarks}</span>
              </div>
              <div className="qs-sec">
                <span className="qs-lbl">
                  {__('Marks Obtained', 'easyjobs')}
                </span>
                <span className="qs-val accent">
                  {evaluation?.quiz?.marksObtained}
                </span>
              </div>
            </div>

            <div className="eval-sec-head">
              <h3>{__('Quiz Questions', 'easyjobs')}</h3>
              <div className="eval-seg">
                <button
                  className={quizFilter === 'all' ? 'active' : ''}
                  onClick={() => setQuizFilter('all')}
                >
                  {__('All', 'easyjobs')} ({quizQuestions.length})
                </button>
                <button
                  className={quizFilter === 'correct' ? 'active' : ''}
                  onClick={() => setQuizFilter('correct')}
                >
                  {__('Correct', 'easyjobs')} ({quizCorrectCount})
                </button>
                <button
                  className={quizFilter === 'incorrect' ? 'active' : ''}
                  onClick={() => setQuizFilter('incorrect')}
                >
                  {__('Incorrect', 'easyjobs')} ({quizIncorrectCount})
                </button>
              </div>
            </div>

            <div className="qz-list">
              {filteredQuiz.length === 0 ? (
                <div className="empty empty--inline">
                  <p>{__('No questions found.', 'easyjobs')}</p>
                </div>
              ) : (
                filteredQuiz.map(({ q, num }) => (
                  <div className="qz" key={num}>
                    <div className="qz-top">
                      <span className="qz-q">
                        <b>Q{num}.</b>
                        {q?.asked}
                      </span>
                      {q?.is_correct ? (
                        <span className="pill green">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M8.5 12l2.5 2.5 4.5-5" />
                          </svg>
                          {__('Correct', 'easyjobs')}
                        </span>
                      ) : (
                        <span className="pill red">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M9 9l6 6M15 9l-6 6" />
                          </svg>
                          {__('Incorrect', 'easyjobs')}
                        </span>
                      )}
                    </div>
                    <div className="qz-ans">
                      <span className="ans-lbl">
                        {__('Applicant Answered', 'easyjobs')}
                      </span>
                      <div className="ans-val">
                        {cleanAnswer(q?.answer) || '—'}
                      </div>
                    </div>
                    {!q?.is_correct && q?.correct_answer ? (
                      <div className="qz-correct">
                        <span className="ans-lbl">
                          {__('Correct Answered', 'easyjobs')}
                        </span>
                        <div className="ans-val">
                          {cleanAnswer(q.correct_answer)}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </section>
        ) : null}

        {/* Screening */}
        {sub === 'screening' && hasScreening ? (
          <section className="subpanel active">
            <div className="eval-sec-head">
              <div>
                <h3>{__('Screening Questions', 'easyjobs')}</h3>
                <div className="subln">
                  {screening.length}{' '}
                  {screening.length === 1
                    ? __('question answered', 'easyjobs')
                    : __('questions answered', 'easyjobs')}
                </div>
              </div>
            </div>
            <div className="sq-list">
              {screening.map((q, i) => (
                <ScreeningItem q={q} index={i} key={i} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {assignOpen ? (
        <AssignAssessmentModal
          candidateId={candidateId}
          candidateGid={candidateGid}
          jobId={jobId}
          onClose={() => setAssignOpen(false)}
          onDone={() => {
            setAssignOpen(false);
            refreshAssessments();
          }}
        />
      ) : null}

      {editTarget ? (
        <UpdateAssessmentModal
          assessment={editTarget}
          jobId={jobId}
          onClose={() => setEditTarget(null)}
          onDone={() => {
            setEditTarget(null);
            refreshAssessments();
          }}
        />
      ) : null}

      {/* Delete confirmation — plugin's global dialog styles (must match the
          full nesting the .dg-* CSS expects). */}
      <div
        className="dg-wrapper ej-candidate-confirmation"
        style={{ display: deleteTarget ? 'flex' : 'none' }}
      >
        <div
          className="dg-backdrop"
          onClick={() => !deleting && setDeleteTarget(null)}
        ></div>
        <div className="dg-container">
          <div className="dg-content-cont dg-content-cont--floating">
            <div className="dg-main-content">
              <div className="dg-view-wrapper">
                <div className="dg-content-body dg-content-body--has-title">
                  <h6 className="dg-title">{__('Confirmation', 'easyjobs')}</h6>
                  <div className="dg-content">
                    {__(
                      'Are you sure, you want to remove this assessment?',
                      'easyjobs',
                    )}
                  </div>
                </div>
                <div className="dg-content-footer">
                  <button
                    className="dg-btn dg-btn--cancel"
                    onClick={() => setDeleteTarget(null)}
                    disabled={deleting}
                  >
                    <span>{__('No', 'easyjobs')}</span>
                  </button>
                  <button
                    className="dg-btn dg-btn--ok dg-pull-right"
                    onClick={confirmDelete}
                    disabled={deleting}
                  >
                    <span className="dg-btn-content">
                      {deleting
                        ? __('Removing…', 'easyjobs')
                        : __('Yes', 'easyjobs')}
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

const mapDispatchToProps = (dispatch) => ({
  getCandidateDetails: (params) => dispatch(getCandidateDetails(params)),
});

export default connect(null, mapDispatchToProps)(Evaluation);
