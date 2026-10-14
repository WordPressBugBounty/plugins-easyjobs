import { __, sprintf } from '@wordpress/i18n';
import React, { useLayoutEffect, useRef } from 'react';
import Icon from './icons';
import Avatar from './Avatar';
import Composer from './Composer';
import ThreadSkeleton from './ThreadSkeleton';
import FileCard from './FileCard';
import { sanitizeHtml } from './sanitize';
import LinkTag from '../../util/Link';

const ArrowRight = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 12h15M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 7.5V12l3 1.8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2.6l2.9 5.88 6.49.94-4.69 4.58 1.1 6.46L12 17.9l-5.8 3.06 1.1-6.46L2.6 9.92l6.5-.94z" />
  </svg>
);

// Pipeline-change pill icon by status modifier (see transform.js).
const PIPELINE_ICONS = {
  'is-rejected': ClockIcon,
  'is-selected': StarIcon,
  'is-applied': ArrowRight,
};

const SystemInfo = ({ text }) => (
  <div className="ej-msg-sysinfo">
    <Icon name="lock" size={14} />
    <span>{text}</span>
  </div>
);

const PipelinePill = ({ block }) => {
  const PillIcon = PIPELINE_ICONS[block.status] || ArrowRight;
  return (
    <div className={`ej-msg-syspill ${block.status || ''}`}>
      <span className="ej-msg-syspill__inner">
        <PillIcon />
        <span className="ej-msg-syspill__text">{block.text}</span>
        {block.time ? (
          <span className="ej-msg-syspill__time">{block.time}</span>
        ) : null}
      </span>
    </div>
  );
};

const NotePill = ({ block }) => (
  <div className="ej-msg-note">
    <span className="ej-msg-note__pill">
      <Icon name="edit" size={13} />
      {/* `name` is HTML from the backend (e.g. a "(You)" indicator span). */}
      <span
        className="ej-msg-note__text"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(
            sprintf(__('%s added a note', 'easyjobs'), block.name || ''),
          ),
        }}
      />
      {block.time ? (
        <span className="ej-msg-note__time">{block.time}</span>
      ) : null}
    </span>
  </div>
);

// Maps a backend assessment status to a colour modifier.
const assessStatusClass = (status) =>
  `is-${
    String(status || '')
      .toLowerCase()
      .split(' ')[0] || 'unassigned'
  }`;

const AssessmentCard = ({ assessment }) => (
  <div className={`ej-msg-assess ${assessStatusClass(assessment.status)}`}>
    <div className="ej-msg-assess__head">
      <span className="ej-msg-assess__status">{assessment.status}</span>
      {assessment.hasMarks ? (
        <span className="ej-msg-assess__marks">
          {assessment.obtained}/{assessment.outOfMarks}
        </span>
      ) : null}
    </div>
    {assessment.info ? (
      <p className="ej-msg-assess__info">{assessment.info}</p>
    ) : null}
  </div>
);

const Bubble = ({ message }) => (
  <div className="ej-msg-bubble">
    {/* Backend HTML — sanitized client-side to prevent stored XSS. */}
    {message.html ? (
      <div
        className="ej-msg-bubble__text"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(message.html) }}
      />
    ) : null}
    {message.assessment ? (
      <AssessmentCard assessment={message.assessment} />
    ) : null}
    {message.attachment ? (
      <FileCard
        url={message.attachment}
        name={message.mediaName}
        size={message.mediaSize}
        variant="bubble"
      />
    ) : null}
  </div>
);

const MessageRun = ({ block }) => (
  <div className={`ej-msg-run ${block.isAdmin ? 'is-out' : 'is-in'}`}>
    {block.name ? (
      // `name` is HTML (includes a muted "(You)" indicator) — sanitized to prevent XSS.
      <div
        className="ej-msg-run__name"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.name) }}
      />
    ) : null}
    <div className="ej-msg-run__body">
      <Avatar
        src={block.image}
        name={String(block.name)
          .replace(/<[^>]*>/g, '')
          .trim()}
        size={32}
        className="ej-msg-run__avatar"
      />
      <div className="ej-msg-run__bubbles">
        {block.messages.map((m) => (
          <Bubble key={m.id} message={m} />
        ))}
      </div>
    </div>
    {block.time ? (
      <div className="ej-msg-run__meta">
        <span className="ej-msg-run__time">{block.time}</span>
      </div>
    ) : null}
  </div>
);

const Block = ({ block }) => {
  if (block.kind === 'pipeline') return <PipelinePill block={block} />;
  if (block.kind === 'note') return <NotePill block={block} />;
  if (block.kind === 'run') return <MessageRun block={block} />;
  return null;
};

const ChatThread = ({
  thread,
  loading,
  sending,
  onSend,
  onBack,
  disabled,
  upgradeUrl,
  hasMore,
  loadingMore,
  onLoadOlder,
  hideStatus,
}) => {
  const bodyRef = useRef(null);
  const prevIdRef = useRef(null);
  // Scroll height captured at the moment a load-older fetch is triggered, so the
  // viewport can be re-anchored after older messages are prepended.
  const restoreRef = useRef(null);
  const threadId = thread ? thread.id : null;

  // Position the scroll after each thread change:
  //  - new conversation        → pin to bottom (newest message)
  //  - older messages prepended → keep the previously-visible message in place
  //  - message sent (appended)  → pin to bottom
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (prevIdRef.current !== threadId) {
      prevIdRef.current = threadId;
      restoreRef.current = null;
      el.scrollTop = el.scrollHeight;
      return;
    }
    if (restoreRef.current != null) {
      el.scrollTop = el.scrollHeight - restoreRef.current;
      restoreRef.current = null;
      return;
    }
    el.scrollTop = el.scrollHeight;
  }, [thread]);

  // Near the top → fetch the next older page (reverse infinite scroll).
  const handleScroll = () => {
    const el = bodyRef.current;
    if (!el || !hasMore || loadingMore) return;
    if (el.scrollTop <= 48) {
      restoreRef.current = el.scrollHeight;
      onLoadOlder();
    }
  };

  if (loading) {
    return <ThreadSkeleton />;
  }

  if (!thread) {
    return (
      <div
        className="ej-msg-thread ej-msg-thread--empty"
        data-testid="ej-msg-thread"
      >
        <p className="ej-msg-thread__placeholder">
          {__('Select a conversation to start messaging.', 'easyjobs')}
        </p>
      </div>
    );
  }

  // Client-side link to the applicant's details page (numeric applicant id), via
  // the app's router (no full reload). Disabled when the candidate limit is
  // reached, mirroring the app. `LinkTag` prefixes `admin.php?page=`.
  const detailsTo =
    thread.id && !disabled
      ? `easyjobs-candidates&id=${thread.id}&tab=application`
      : null;
  const titleText = sprintf(
    __('Conversation with %s', 'easyjobs'),
    thread.name,
  );

  return (
    <div className="ej-msg-thread" data-testid="ej-msg-thread">
      <div className="ej-msg-thread__head">
        {/* Back to the conversation list — only visible on mobile (single-pane). */}
        {onBack ? (
          <button
            type="button"
            className="ej-msg-thread__back"
            onClick={onBack}
            aria-label={__('Back to conversations', 'easyjobs')}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : null}
        {detailsTo ? (
          <LinkTag
            to={detailsTo}
            className="ej-msg-thread__avatarlink"
            aria-label={titleText}
          >
            <Avatar
              src={thread.image}
              name={thread.name}
              size={42}
              className="ej-msg-thread__avatar"
            />
          </LinkTag>
        ) : (
          <Avatar
            src={thread.image}
            name={thread.name}
            size={42}
            className="ej-msg-thread__avatar"
          />
        )}
        <div className="ej-msg-thread__meta">
          <div className="ej-msg-thread__title-row">
            {detailsTo ? (
              <LinkTag to={detailsTo} className="ej-msg-thread__title-link">
                <h2 className="ej-msg-thread__title">{titleText}</h2>
              </LinkTag>
            ) : (
              <h2 className="ej-msg-thread__title">{titleText}</h2>
            )}
            {thread.status && !hideStatus ? (
              <span className={`ej-msg-badge ${thread.statusClass || ''}`}>
                {thread.status}
              </span>
            ) : null}
          </div>
          <span className="ej-msg-thread__role">{thread.role}</span>
        </div>
      </div>

      <div
        className="ej-msg-thread__body"
        ref={bodyRef}
        onScroll={handleScroll}
      >
        {loadingMore ? (
          <div className="ej-msg-loadmore" aria-live="polite">
            <span className="ej-msg-loadmore__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </div>
        ) : null}

        {/* Conversation-start markers belong at the very top — only show them once
            the oldest page has been reached (no more history to load). */}
        {!hasMore && thread.appliedDate && !thread.empty ? (
          <SystemInfo
            text={sprintf(__('Applied on %s', 'easyjobs'), thread.appliedDate)}
          />
        ) : null}
        {!hasMore && thread.conversationStart ? (
          <SystemInfo
            text={sprintf(
              __('Conversation started on %s', 'easyjobs'),
              thread.conversationStart,
            )}
          />
        ) : null}

        {thread.empty ? (
          <div className="ej-msg-thread__empty">
            <span className="ej-msg-thread__empty-icon" aria-hidden="true">
              <Icon name="chat" size={30} strokeWidth={1.7} />
            </span>
            <p className="ej-msg-thread__empty-title">
              {__('No messages yet', 'easyjobs')}
            </p>
            <p className="ej-msg-thread__empty-sub">
              {__(
                'Start the conversation by sending a message below.',
                'easyjobs',
              )}
            </p>
          </div>
        ) : null}

        {thread.groups.map((group, gi) => (
          <div className="ej-msg-group" key={gi}>
            {group.label ? (
              <div className="ej-msg-daysep">
                <span>{group.label}</span>
              </div>
            ) : null}
            {group.blocks.map((block, bi) => (
              <Block key={block.id || bi} block={block} />
            ))}
          </div>
        ))}
      </div>

      <Composer
        recipient={thread.first || thread.name}
        sending={sending}
        onSend={onSend}
        disabled={disabled}
        upgradeUrl={upgradeUrl}
      />
    </div>
  );
};

export default ChatThread;
