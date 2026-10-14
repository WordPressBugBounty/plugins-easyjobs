import { __ } from '@wordpress/i18n';
import React from 'react';
import LinkTag from '../../util/Link';
import Icon from '../../util/Icon';
import CandidateAvatar from '../../util/CandidateAvatar';
import { getStatusPillClass, timeAgo } from '../../util/helper';

// Single candidate card for the grid view of the new candidate list UI.
// `onStub` is fired for controls that have no backend yet (favourite, kebab,
// message, shortlist) so they surface a "coming soon" notice instead of failing.
const Stars = ({ rating }) => (
  <div className="c-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <Icon
        key={n}
        id="i-star"
        size={13}
        className={n <= (rating || 0) ? 'on' : ''}
      />
    ))}
  </div>
);

const CandidateCard = ({ candidate, onStub, onNavigate }) => {
  const status = candidate?.pipeline?.label || __('Applied', 'easyjobs');
  const pillClass = getStatusPillClass(status);
  const applied =
    candidate.applied || candidate.applied_at || candidate.created_at;
  // `applied` may be a date string (→ relative via timeAgo) or already a label.
  const appliedText = applied
    ? Number.isNaN(new Date(applied).getTime())
      ? applied
      : timeAgo(applied)
    : '';
  const detailTo =
    'easyjobs-candidates&id=' + candidate.id + '&tab=application';
  const resumeTo = 'easyjobs-candidates&id=' + candidate.id + '&tab=resume';
  const attachmentTo =
    'easyjobs-candidates&id=' + candidate.id + '&tab=attachment';
  const conversationTo =
    'easyjobs-candidates&id=' + candidate.id + '&tab=conversation';

  // Top-right icons are driven by the per-candidate params: when the param is
  // empty (or the candidate is restricted) the icon is disabled; when it has a
  // value the icon links to the relevant detail tab.
  const canOpen = !candidate.is_restricted;
  const hasAttachment = canOpen && !!candidate.attachments_icon;
  const hasNotes = canOpen && !!candidate.notes_icon;

  const stop = (e) => e.stopPropagation();

  return (
    <article
      className={`c-card${candidate.is_restricted ? ' is-restricted' : ''}`}
    >
      <div className="c-top">
        <span className={`c-pill ${pillClass}`}>{status}</span>
        <div className="c-icons">
          {hasAttachment ? (
            <LinkTag
              to={attachmentTo}
              className="c-note"
              title={__('Attachment', 'easyjobs')}
              aria-label={__('Attachment', 'easyjobs')}
              onClick={(e) => {
                stop(e);
                onNavigate && onNavigate();
              }}
            >
              <Icon id="i-clip" size={14} />
            </LinkTag>
          ) : (
            <span
              className="c-note is-disabled"
              title={__('No attachment', 'easyjobs')}
              aria-label={__('No attachment', 'easyjobs')}
              aria-disabled="true"
            >
              <Icon id="i-clip" size={14} />
            </span>
          )}
          {hasNotes ? (
            <LinkTag
              to={detailTo}
              className="c-note"
              title={__('Notes', 'easyjobs')}
              aria-label={__('Notes', 'easyjobs')}
              onClick={(e) => {
                stop(e);
                onNavigate && onNavigate();
              }}
            >
              <Icon id="i-note" size={14} />
            </LinkTag>
          ) : (
            <span
              className="c-note is-disabled"
              title={__('No notes', 'easyjobs')}
              aria-label={__('No notes', 'easyjobs')}
              aria-disabled="true"
            >
              <Icon id="i-note" size={14} />
            </span>
          )}
        </div>
      </div>

      {candidate.is_restricted ? (
        <button
          type="button"
          className="c-clickwrap"
          onClick={() =>
            onStub(
              __(
                'Candidate limit reached — upgrade your plan to continue.',
                'easyjobs',
              ),
            )
          }
        >
          <CandidateAvatar
            name={candidate.name}
            src={candidate.profile_image}
            size={60}
            className="c-av"
          />
          <div className="c-name">{candidate.name}</div>
          <div className="c-role">{candidate.job_title}</div>
          <Stars rating={candidate.rating} />
        </button>
      ) : (
        <LinkTag to={detailTo} className="c-clickwrap" onClick={onNavigate}>
          <CandidateAvatar
            name={candidate.name}
            src={candidate.profile_image}
            size={60}
            className="c-av"
          />
          <div className="c-name">{candidate.name}</div>
          <div className="c-role">{candidate.job_title}</div>
          <Stars rating={candidate.rating} />
        </LinkTag>
      )}

      {appliedText && (
        <div className="c-foot">
          <span className="c-time">
            <Icon id="i-clock" size={11} />
            {__('Applied', 'easyjobs')} {appliedText}
          </span>
        </div>
      )}

      {!candidate.is_restricted && (
        <div className="c-hover">
          <LinkTag
            to={conversationTo}
            className="hv"
            title={__('Message', 'easyjobs')}
            aria-label={__('Message', 'easyjobs')}
            onClick={onNavigate}
          >
            <Icon id="i-msg-c" size={15} />
          </LinkTag>
          <LinkTag
            to={resumeTo}
            className="hv"
            title={__('Resume', 'easyjobs')}
            aria-label={__('Resume', 'easyjobs')}
            onClick={onNavigate}
          >
            <Icon id="i-resume" size={15} />
          </LinkTag>
          <LinkTag
            to={detailTo}
            className="hv"
            title={__('View Details', 'easyjobs')}
            aria-label={__('View Details', 'easyjobs')}
            onClick={onNavigate}
          >
            <Icon id="i-eye" size={15} />
          </LinkTag>
        </div>
      )}
    </article>
  );
};

export default CandidateCard;
