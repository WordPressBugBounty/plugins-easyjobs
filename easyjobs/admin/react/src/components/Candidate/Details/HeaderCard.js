import React, { useState, useRef, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { Icon } from './icons';
import { initials, statusClass } from './cdUtil';

const TABS = [
  { key: 'application', label: 'Application', icon: 'tab-application' },
  { key: 'resume', label: 'Resume', icon: 'tab-resume' },
  { key: 'evaluation', label: 'Evaluation', icon: 'tab-evaluation' },
  { key: 'conversation', label: 'Conversation', icon: 'tab-conversation' },
  { key: 'attachment', label: 'Attachment', icon: 'tab-attachment' },
];

// AI-score ring colours (quiz, skill, education, experience) — matches the app's donut.
const AI_RING_COLORS = ['#ff9635', '#58C9E5', '#597DFC', '#7AD496'];
// Hover popup breakdown (label + value colour) — matches the app's tooltip.
const AI_LABELS = [
  { key: 'quiz', label: 'Quiz', color: '#ff9635' },
  { key: 'skill', label: 'Skill', color: '#58C9E5' },
  { key: 'education', label: 'Education', color: '#597DFC' },
  { key: 'experience', label: 'Experience', color: '#7AD496' },
  { key: 'final_score', label: 'Total', color: '#FF6262' },
];
const buildRing = (scores) => {
  if (!scores) return null;
  const vals = [
    scores.quiz,
    scores.skill,
    scores.education,
    scores.experience,
  ].map((v) => Number(v) || 0);
  const total = vals.reduce((a, b) => a + b, 0);
  if (!total) return null;
  let acc = 0;
  const stops = vals.map((v, i) => {
    const start = (acc / total) * 360;
    acc += v;
    const end = (acc / total) * 360;
    return `${AI_RING_COLORS[i]} ${start}deg ${end}deg`;
  });
  return `conic-gradient(${stops.join(',')})`;
};

/**
 * Candidate header card (cand-head) + tab bar. Faithful port of the app-end
 * "Candidate Profile" design header.
 */
const HeaderCard = ({
  candidateDetails,
  activeTab,
  onChangeTab,
  onPipelineChange,
  onRate,
  onRemove,
  onDownloadResume,
  onAssignAssessment,
}) => {
  const candidate = candidateDetails?.candidate || {};
  const user = candidate?.user || {};

  const [statusOpen, setStatusOpen] = useState(false);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);
  const [avatarHover, setAvatarHover] = useState(false);
  const statusRef = useRef(null);
  const kebabRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target))
        setStatusOpen(false);
      if (kebabRef.current && !kebabRef.current.contains(e.target))
        setKebabOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const rating = candidate?.rating || 0;
  const showAiScore =
    candidateDetails?.global_ai_enabled &&
    candidateDetails?.evaluation?.showAiScore;
  const ringBg = showAiScore
    ? buildRing(candidateDetails?.evaluation?.scores)
    : null;

  // Colour the pipeline button by the current stage (rejected = red, selected = green).
  const curCls = statusClass(candidate?.pipeline?.label);
  const btnTone =
    curCls === 'st-red'
      ? 'status-btn--rejected'
      : curCls === 'st-green'
      ? 'status-btn--selected'
      : '';

  return (
    <section className="ejc-card">
      <div className="cand-head">
        <div
          className={`cand-av-wrap ${ringBg ? 'has-ring' : ''}`}
          style={ringBg ? { background: ringBg } : undefined}
          onMouseEnter={() => ringBg && setAvatarHover(true)}
          onMouseLeave={() => setAvatarHover(false)}
        >
          <div className="cand-av">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user?.name} />
            ) : (
              initials(user?.name)
            )}
          </div>
          {ringBg && avatarHover ? (
            <div className="ai-pop">
              <ul>
                {AI_LABELS.map((s) => {
                  const val = candidateDetails?.evaluation?.scores?.[s.key];
                  return val !== null && val !== undefined ? (
                    <li key={s.key}>
                      {__(s.label, 'easyjobs')}:{' '}
                      <strong style={{ color: s.color }}>{val}%</strong>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="cand-main">
          <h1 className="cand-name">{user?.name || '—'}</h1>
          <div className="contact-row">
            {user?.email ? (
              <span className="contact-item">
                <Icon name="mail2" />
                <span className="user-email">{user.email}</span>
              </span>
            ) : null}
            {user?.email && user?.mobile_number ? (
              <span className="sep"></span>
            ) : null}
            {user?.mobile_number ? (
              <span className="contact-item">
                <Icon name="phone2" />
                <span>{user.mobile_number}</span>
              </span>
            ) : null}
          </div>

          <div className="cand-controls">
            <div className="status-wrap" ref={statusRef}>
              <button
                className={`status-btn status-btn--solid ${btnTone}`}
                onClick={() => setStatusOpen((v) => !v)}
              >
                <span>
                  {candidate?.pipeline?.label || __('Pipeline', 'easyjobs')}
                </span>
                <Icon name="chev" className="chv" />
              </button>
              <div className={`status-menu ${statusOpen ? 'open' : ''}`}>
                {(candidate?.job_pipelines || [])
                  .filter((p) => p.label !== candidate?.pipeline?.label)
                  .map((p) => {
                    const cls = statusClass(p.label);
                    const tone =
                      cls === 'st-green'
                        ? 'is-selected'
                        : cls === 'st-red'
                        ? 'is-rejected'
                        : '';
                    return (
                      <button
                        key={p.id}
                        className={`status-opt ${tone}`}
                        onClick={() => {
                          setStatusOpen(false);
                          onPipelineChange(p.id);
                        }}
                      >
                        {p.label}
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="rate">
              <span className="lbl">{__('Rate', 'easyjobs')}</span>
              <div className="stars" onMouseLeave={() => setHoverStar(0)}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    className={`star ${v <= (hoverStar || rating) ? 'on' : ''}`}
                    onMouseEnter={() => setHoverStar(v)}
                    onClick={() => onRate(v)}
                  >
                    <Icon name="star" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="kebab-wrap" ref={kebabRef}>
          <button
            className="kebab"
            onClick={() => setKebabOpen((v) => !v)}
            aria-label="More actions"
          >
            <Icon name="dot3v" />
          </button>
          <div className={`kebab-menu ${kebabOpen ? 'open' : ''}`}>
            <button
              onClick={() => {
                setKebabOpen(false);
                onAssignAssessment && onAssignAssessment();
              }}
            >
              <Icon name="clip-list" />
              {__('Assign Assessment', 'easyjobs')}
            </button>
            <button
              onClick={() => {
                setKebabOpen(false);
                onDownloadResume && onDownloadResume();
              }}
            >
              <Icon name="download" />
              {__('Download resume', 'easyjobs')}
            </button>
            <div className="sep-line"></div>
            <button
              className="danger"
              onClick={(e) => {
                setKebabOpen(false);
                onRemove(e);
              }}
            >
              <Icon name="trash" />
              {__('Remove candidate', 'easyjobs')}
            </button>
          </div>
        </div>
      </div>

      <nav className="tabs" data-testid="ej-candidate-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            data-testid={`ej-candidate-tab-${t.key}`}
            className={`tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => onChangeTab(t.key)}
          >
            <Icon name={t.icon} />
            {__(t.label, 'easyjobs')}
          </button>
        ))}
      </nav>
    </section>
  );
};

export default HeaderCard;
