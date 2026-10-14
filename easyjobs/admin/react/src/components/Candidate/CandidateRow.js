import { __ } from '@wordpress/i18n';
import React from 'react';
import { useHistory } from 'react-router-dom';
import LinkTag from '../../util/Link';
import Icon from '../../util/Icon';
import CandidateAvatar from '../../util/CandidateAvatar';
import { getStatusPillClass, timeAgo } from '../../util/helper';

// Single candidate row for the list (table) view. Mirrors CandidateCard's data
// and stub behaviour. Selection / bulk-action column is intentionally omitted.
const Stars = ({ rating }) =>
  rating > 0 ? (
    <div className="c-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          id="i-star"
          size={13}
          className={n <= rating ? 'on' : ''}
        />
      ))}
    </div>
  ) : (
    <span className="l-dash">—</span>
  );

const CandidateRow = ({ candidate, onStub, onNavigate }) => {
  const status = candidate?.pipeline?.label || __('Applied', 'easyjobs');
  const pillClass = getStatusPillClass(status);
  const applied =
    candidate.applied || candidate.applied_at || candidate.created_at;
  const appliedText = applied
    ? Number.isNaN(new Date(applied).getTime())
      ? applied
      : timeAgo(applied)
    : '';
  // Activity indicators — the API sends `notes_icon` / `attachments_icon` as
  // (truthy) icon-class strings only when the candidate actually has notes /
  // attachments, so their presence is the flag.
  const hasNotes = !candidate.is_restricted && !!candidate.notes_icon;
  const hasAttachment =
    !candidate.is_restricted && !!candidate.attachments_icon;
  const hasActivity = hasNotes || hasAttachment;
  const detailTo =
    'easyjobs-candidates&id=' + candidate.id + '&tab=application';
  const conversationTo =
    'easyjobs-candidates&id=' + candidate.id + '&tab=conversation';
  const stop = (e) => e.stopPropagation();

  const history = useHistory();
  // Whole-row click opens the candidate details (interactive cells stop
  // propagation so their own links/handlers win).
  const onRowClick = () => {
    if (candidate.is_restricted) {
      onStub(
        __(
          'Candidate limit reached — upgrade your plan to continue.',
          'easyjobs',
        ),
      );
      return;
    }
    onNavigate && onNavigate();
    history.push(`admin.php?page=${detailTo}`);
  };

  return (
    <tr
      className={`l-row ${
        candidate.is_restricted ? 'is-restricted' : 'is-clickable'
      }`}
      onClick={onRowClick}
    >
      <td>
        <div className="l-name">
          <CandidateAvatar
            name={candidate.name}
            src={candidate.profile_image}
            size={30}
            className="l-av"
          />
          {candidate.is_restricted ? (
            <span className="nm">{candidate.name}</span>
          ) : (
            <LinkTag
              to={detailTo}
              className="nm"
              onClick={(e) => {
                stop(e);
                onNavigate && onNavigate();
              }}
            >
              {candidate.name}
            </LinkTag>
          )}
        </div>
      </td>
      <td>
        <span className="l-role" title={candidate.job_title}>
          {candidate.job_title}
        </span>
      </td>
      <td>
        <span className={`c-pill ${pillClass}`}>{status}</span>
      </td>
      <td>
        <Stars rating={candidate.rating || 0} />
      </td>
      <td>
        <div className="dl">
          <span className="date">
            {appliedText ? appliedText : <span className="l-dash">—</span>}
          </span>
        </div>
      </td>
      <td>
        {hasActivity ? (
          <span className="l-activity">
            {hasNotes ? (
              <span
                className="l-act"
                title={__('Has notes', 'easyjobs')}
                aria-label={__('Has notes', 'easyjobs')}
              >
                <Icon id="i-note" size={14} />
              </span>
            ) : null}
            {hasAttachment ? (
              <span
                className="l-act"
                title={__('Has attachments', 'easyjobs')}
                aria-label={__('Has attachments', 'easyjobs')}
              >
                <Icon id="i-clip" size={14} />
              </span>
            ) : null}
          </span>
        ) : (
          <span className="l-dash">—</span>
        )}
      </td>
      <td>
        <div className="row-acts" onClick={stop}>
          {candidate.is_restricted ? (
            <>
              <button
                className="act-btn"
                title={__('View Details', 'easyjobs')}
                aria-label={__('View Details', 'easyjobs')}
                onClick={() =>
                  onStub(
                    __(
                      'Candidate limit reached — upgrade your plan to continue.',
                      'easyjobs',
                    ),
                  )
                }
              >
                <Icon id="i-eye" size={15} />
              </button>
              <button
                className="act-btn"
                title={__('Message', 'easyjobs')}
                aria-label={__('Message', 'easyjobs')}
                onClick={() =>
                  onStub(
                    __(
                      'Candidate limit reached — upgrade your plan to continue.',
                      'easyjobs',
                    ),
                  )
                }
              >
                <Icon id="i-msg-c" size={15} />
              </button>
            </>
          ) : (
            <>
              <LinkTag
                to={detailTo}
                className="act-btn"
                title={__('View Details', 'easyjobs')}
                aria-label={__('View Details', 'easyjobs')}
                onClick={onNavigate}
              >
                <Icon id="i-eye" size={15} />
              </LinkTag>
              <LinkTag
                to={conversationTo}
                className="act-btn"
                title={__('Message', 'easyjobs')}
                aria-label={__('Message', 'easyjobs')}
                onClick={onNavigate}
              >
                <Icon id="i-msg-c" size={15} />
              </LinkTag>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default CandidateRow;
