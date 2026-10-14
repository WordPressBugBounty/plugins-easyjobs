import { __ } from '@wordpress/i18n';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import Icon from './icons';
import Avatar from './Avatar';
import { getNewApplicants } from '../../redux/actions/messagesActions';

// Fallback query when no filters are passed: applicants without a conversation.
const DEFAULT_BASE_PARAMS = {
  has_conversation: 0,
  message_status: ['read', 'unread'],
  active_jobs_applicants: 'false',
};

const NewConversation = (props) => {
  const {
    onBack,
    onSelect,
    activeId,
    baseParams,
    applicants,
    loading,
    page,
    lastPage,
    error,
    fetchApplicants,
  } = props;

  const [search, setSearch] = useState('');
  const searchRef = useRef(null);
  const searchTimer = useRef(null);
  // Last request sent, so "Try again" can replay it after a failure/timeout.
  const lastRequest = useRef(null);

  const load = (params, append) => {
    lastRequest.current = { params, append };
    fetchApplicants(params, append);
  };

  // The active filters (minus search) come from the parent so the applicant
  // picker stays in sync with the conversation-list filters, like the app.
  const base = baseParams || DEFAULT_BASE_PARAMS;
  // Stable signature so the reload effect only fires when filter values change,
  // not on every parent re-render (baseParams is a fresh object each time).
  const baseSig = JSON.stringify(base);

  // Focus the search box on open.
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  // Load the first page on open and reload whenever the active filters change,
  // keeping whatever the user has typed in the applicant search box.
  useEffect(() => {
    load({ ...base, page: 1, search }, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseSig]);

  const runSearch = (value) => {
    load({ ...base, page: 1, search: value }, false);
  };

  const handleSearch = (value) => {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => runSearch(value), 600);
  };

  const clearSearch = () => {
    setSearch('');
    if (searchTimer.current) clearTimeout(searchTimer.current);
    runSearch('');
    if (searchRef.current) searchRef.current.focus();
  };

  const list = Array.isArray(applicants) ? applicants : [];
  // A failed request (e.g. a timeout) is not the same as "no results": show an
  // error + retry instead of the empty-state copy.
  const isEmpty = !loading && !error && list.length === 0;
  const hasMore = page < lastPage;

  // Infinite scroll: load the next page when nearing the bottom (matches the app's
  // vue-infinite-loading). A ref guards against double-firing before `loading` updates.
  const loadingMore = useRef(false);
  useEffect(() => {
    if (!loading) loadingMore.current = false;
  }, [loading]);

  const handleScroll = (e) => {
    // Don't auto-refetch on scroll after a failure; the user retries explicitly.
    if (loadingMore.current || loading || error || !hasMore) return;
    const el = e.target;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
      loadingMore.current = true;
      load({ ...base, page: page + 1, search }, true);
    }
  };

  const retry = () => {
    const req = lastRequest.current || {
      params: { ...base, page: 1, search },
      append: false,
    };
    load(req.params, req.append);
  };

  return (
    <div className="ej-msg-new">
      <div className="ej-msg-new__head">
        <button
          type="button"
          className="ej-msg-iconbtn"
          onClick={onBack}
          aria-label={__('Back', 'easyjobs')}
        >
          <Icon name="back" size={20} />
        </button>
        <h2 className="ej-msg-new__title">
          {__('New Conversation', 'easyjobs')}
        </h2>
      </div>

      <div className="ej-msg-new__search">
        <div className="ej-msg-new__searchwrap">
          <input
            ref={searchRef}
            type="text"
            placeholder={__('Search new applicant', 'easyjobs')}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {search ? (
            <button
              type="button"
              className="ej-msg-new__clear"
              onClick={clearSearch}
              aria-label={__('Clear search', 'easyjobs')}
            >
              <Icon name="close" size={12} />
            </button>
          ) : null}
        </div>
      </div>

      <div className="ej-msg-new__scroll" onScroll={handleScroll}>
        {list.map((c) => (
          <button
            type="button"
            key={c.id}
            className={`ej-msg-newrow ${c.id === activeId ? 'is-active' : ''}`}
            onClick={() => onSelect && onSelect(c)}
          >
            <Avatar
              src={c.user && c.user.image}
              name={c.user && c.user.name}
              size={40}
            />
            <span className="ej-msg-newrow__main">
              <span className="ej-msg-newrow__name">
                {(c.user && c.user.name) || ''}
              </span>
              <span className="ej-msg-newrow__role">
                {(c.job && c.job.title) || ''}
              </span>
            </span>
          </button>
        ))}

        {isEmpty ? (
          <p className="ej-msg-new__empty">
            {__('No candidates or jobs found.', 'easyjobs')}
          </p>
        ) : null}

        {!loading && error ? (
          <div className="ej-msg-new__error" role="alert">
            <p>
              {list.length
                ? __('Couldn’t load more applicants.', 'easyjobs')
                : __(
                    'Couldn’t load applicants. The request failed or timed out.',
                    'easyjobs',
                  )}
            </p>
            <button type="button" className="ej-msg-new__more" onClick={retry}>
              {__('Try again', 'easyjobs')}
            </button>
          </div>
        ) : null}

        {loading ? (
          <p className="ej-msg-new__loading">{__('Loading…', 'easyjobs')}</p>
        ) : null}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  applicants: state.messages.newApplicants,
  loading: state.messages.newApplicantsLoading,
  page: state.messages.newApplicantsPage,
  lastPage: state.messages.newApplicantsLastPage,
  error: state.messages.newApplicantsError,
});

const mapDispatchToProps = (dispatch) => ({
  fetchApplicants: (params, append) =>
    dispatch(getNewApplicants(params, append)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewConversation);
