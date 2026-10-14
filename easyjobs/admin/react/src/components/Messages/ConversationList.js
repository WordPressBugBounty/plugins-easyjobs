import { __ } from '@wordpress/i18n';
import React, { useEffect, useRef } from 'react';
import Avatar from './Avatar';
import Icon from './icons';

const asText = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value.message) return asText(value.message);
  try {
    return JSON.stringify(value);
  } catch (e) {
    return String(value);
  }
};

const ReadReceipt = () => (
  <svg
    className="ej-msg-receipt"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M1 13l4 4L13 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 13l4 4L22 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ConversationList = ({
  conversations,
  activeId,
  onSelect,
  error,
  onReset,
  onLoadMore,
  hasMore,
  loadingMore,
}) => {
  // Infinite scroll — load the next page when nearing the bottom. A ref guards
  // against double-firing before `loadingMore` updates.
  const loadingRef = useRef(false);
  useEffect(() => {
    if (!loadingMore) loadingRef.current = false;
  }, [loadingMore]);

  const handleScroll = (e) => {
    if (
      loadingRef.current ||
      loadingMore ||
      !hasMore ||
      typeof onLoadMore !== 'function'
    ) {
      return;
    }
    const el = e.target;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
      loadingRef.current = true;
      onLoadMore();
    }
  };

  if (error) {
    return (
      <div className="ej-msg-list" data-testid="ej-msg-list">
        <div className="ej-msg-list__empty ej-msg-list__empty--error">
          <p>{__('Couldn’t load conversations.', 'easyjobs')}</p>
          <small>{asText(error)}</small>
        </div>
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="ej-msg-list" data-testid="ej-msg-list">
        <div className="ej-msg-list__empty">
          <p>{__('No candidates or jobs found.', 'easyjobs')}</p>
          {onReset ? (
            <button
              type="button"
              className="ej-msg-list__reset"
              onClick={onReset}
            >
              <Icon name="refresh" size={15} />
              <span>{__('Reset', 'easyjobs')}</span>
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="ej-msg-list" data-testid="ej-msg-list">
      <div className="ej-msg-list__scroll" onScroll={handleScroll}>
        {conversations.map((c) => (
          <button
            type="button"
            key={c.id}
            data-testid="ej-msg-convo"
            className={`ej-msg-convo ${c.id === activeId ? 'is-active' : ''}`}
            onClick={() => onSelect(c.id)}
          >
            <Avatar src={c.avatar} name={c.name} size={40} />
            <span className="ej-msg-convo__main">
              <span className="ej-msg-convo__titlerow">
                <span className="ej-msg-convo__name">{c.name}</span>
                {c.time ? (
                  <span className="ej-msg-convo__time">{c.time}</span>
                ) : null}
              </span>
              <span className="ej-msg-convo__role">{c.role}</span>
              {c.preview ? (
                <span className="ej-msg-convo__preview">
                  {c.read ? <ReadReceipt /> : null}
                  <span className="ej-msg-convo__preview-text">
                    {c.preview}
                  </span>
                </span>
              ) : null}
            </span>
          </button>
        ))}
        {loadingMore ? (
          <p className="ej-msg-list__loading">{__('Loading…', 'easyjobs')}</p>
        ) : null}
      </div>
    </div>
  );
};

export default ConversationList;
