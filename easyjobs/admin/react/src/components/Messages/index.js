import { __ } from '@wordpress/i18n';
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Icon from './icons';
import ConversationList from './ConversationList';
import NewConversation from './NewConversation';
import ChatThread from './ChatThread';
import RightPanel from './RightPanel';
import FilterPanel from './FilterPanel';
import MessagesSkeleton from './MessagesSkeleton';
import { mapConversations, mapThread } from './transform';
import {
  getConversations,
  getConversationThread,
  sendMessage,
  getMessageNotifications,
  changeMessageStatus,
} from '../../redux/actions/messagesActions';
import { getCandidateLimit } from '../../redux/actions/dashboardActions';

/**
 * Messages — recruiter ↔ candidate conversation inbox.
 *
 * Phase 2: wired to the easy.jobs `conversation/*` API via Redux/Saga + admin-ajax.
 * The list, thread, composer, New-conversation picker and filters run on live data;
 * the right-side panels remain on Phase 1 mock data for a later pass.
 * See docs/messages/ and docs/api/conversation.md.
 */

const DEFAULT_FILTERS = {
  jobOption: null, // react-select option { value, label } | null
  message_status: ['read', 'unread'],
  hide_pipeline: [], // 99 = Selected, 100 = Rejected
  active_jobs_applicants: false,
};

// Build the conversation-list query from the active filters + search term.
// `hasConversation` is 1 for the conversation list and 0 for the New
// Conversation applicant picker — both hit the same endpoint and share filters.
const buildListParams = (filters, search, hasConversation = 1) => {
  const params = {
    has_conversation: hasConversation,
    search: search || '',
    active_jobs_applicants: filters.active_jobs_applicants ? 'true' : 'false',
  };
  if (filters.message_status && filters.message_status.length) {
    params.message_status = filters.message_status;
  }
  if (filters.hide_pipeline && filters.hide_pipeline.length) {
    params.hide_pipeline = filters.hide_pipeline;
  }
  if (filters.jobOption && filters.jobOption.value) {
    params.job_id = filters.jobOption.value;
  }
  return params;
};

// Active-filter count shown on the filter button (manager is hidden in the plugin).
const countFilters = (filters) =>
  (filters.message_status ? filters.message_status.length : 0) +
  (filters.hide_pipeline ? filters.hide_pipeline.length : 0) +
  (filters.active_jobs_applicants ? 1 : 0) +
  (filters.jobOption ? 1 : 0);

const Messages = (props) => {
  const {
    conversations,
    conversationsLoading,
    conversationsError,
    thread,
    threadLoading,
    sending,
    fetchConversations,
    fetchThread,
    postMessage,
    toggleReadStatus,
    fetchNotifications,
    candidateLimit,
    fetchCandidateLimit,
    conversationsPage,
    conversationsLastPage,
    threadPage,
    threadLastPage,
    threadLoadingMore,
  } = props;

  const [activeId, setActiveId] = useState(null);
  const [rightPanel, setRightPanel] = useState(null); // null | 'files' | 'notes' | 'templates'
  // Slide animation: `mountedPanel` keeps the panel in the DOM through its exit
  // transition; `panelOpen` toggles the slid-in state.
  const [mountedPanel, setMountedPanel] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelTimer = useRef(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [newMode, setNewMode] = useState(false); // "New Conversation" applicant picker
  const [search, setSearch] = useState('');
  // Mobile single-pane navigation: false = conversation list, true = open thread.
  // Ignored on desktop (CSS shows both panes side by side regardless).
  const [threadOpenMobile, setThreadOpenMobile] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const filterRef = useRef(null);
  const searchTimer = useRef(null);

  // Initial load: fetch the conversation list + unseen counter.
  useEffect(() => {
    fetchConversations(buildListParams(DEFAULT_FILTERS, ''));
    fetchNotifications();
    fetchCandidateLimit();
  }, []);

  const list = mapConversations(conversations);

  // Default the active conversation to the first item once the list arrives.
  useEffect(() => {
    if (!activeId && list.length) {
      const firstId = list[0].id;
      setActiveId(firstId);
      fetchThread({ id: firstId });
    }
  }, [conversations]);

  const handleSelect = (id) => {
    // On mobile this slides the thread in over the list; reopening the same
    // conversation (after a Back) must still switch the view, so set it first.
    setThreadOpenMobile(true);
    if (id === activeId) return;
    setActiveId(id);
    fetchThread({ id });
  };

  // Mobile "back" — return to the conversation list (keeps the thread loaded so
  // desktop is unaffected and reopening is instant).
  const handleBack = () => setThreadOpenMobile(false);

  // Reverse infinite scroll: pull the next older page of thread messages.
  const loadOlderMessages = () => {
    if (!activeId || threadLoadingMore || threadPage >= threadLastPage) return;
    fetchThread({ id: activeId, page: threadPage + 1 }, true);
  };

  // Debounced server-side search.
  const handleSearch = (value) => {
    setSearch(value);
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    // Refresh only the list; keep the open thread (don't reset activeId).
    searchTimer.current = setTimeout(() => {
      fetchConversations(buildListParams(filters, value));
    }, 450);
  };

  const clearSearch = () => {
    setSearch('');
    if (searchTimer.current) clearTimeout(searchTimer.current);
    // Refresh only the list; keep the open thread (message body) as-is.
    fetchConversations(buildListParams(filters, ''));
  };

  // Infinite scroll: load the next page of conversations and append.
  const loadMoreConversations = () => {
    fetchConversations(
      { ...buildListParams(filters, search), page: conversationsPage + 1 },
      true,
    );
  };

  // Reset everything (search + filters) back to defaults and reload the list.
  const resetAll = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setSearch('');
    setFilters(DEFAULT_FILTERS);
    setActiveId(null);
    setThreadOpenMobile(false);
    setFiltersOpen(false);
    fetchConversations(buildListParams(DEFAULT_FILTERS, ''));
  };

  // Apply filters → reload only the conversation list. Like the app, the open
  // chat thread is left untouched (we don't clear activeId or close the thread).
  const applyFilters = (next) => {
    setFilters(next);
    setFiltersOpen(false);
    fetchConversations(buildListParams(next, search));
  };

  const handleSend = (payload) => {
    if (!activeId) return;
    const message = payload && payload.message ? payload.message : '';
    const file = payload && payload.file ? payload.file : null;
    if (!message && !file) return;
    // Only include `file` when present — a null/undefined value would be sent as the
    // string "null" by ajaxCall and the backend would try to decode it as base64.
    const params = { id: activeId, message };
    if (file) {
      params.file = file;
    }
    postMessage(params);
  };

  const togglePanel = (panel) =>
    setRightPanel((current) => (current === panel ? null : panel));

  // Drive the side-panel slide: mount immediately + slide in on open; slide out
  // then unmount after the transition on close.
  useEffect(() => {
    if (rightPanel) {
      clearTimeout(panelTimer.current);
      setMountedPanel(rightPanel);
      const raf = requestAnimationFrame(() => setPanelOpen(true));
      return () => cancelAnimationFrame(raf);
    }
    setPanelOpen(false);
    panelTimer.current = setTimeout(() => setMountedPanel(null), 300);
    return () => clearTimeout(panelTimer.current);
  }, [rightPanel]);

  // Close the filters popover when clicking outside it.
  useEffect(() => {
    if (!filtersOpen) return undefined;
    const handle = (e) => {
      // Ignore clicks inside the react-select menu (portaled to <body>).
      if (e.target.closest && e.target.closest('.ej-rs__menu-portal')) {
        return;
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [filtersOpen]);

  const mappedThread = thread && thread !== 'unable' ? mapThread(thread) : null;
  const filterCount = countFilters(filters);
  const attachments =
    thread && thread !== 'unable' && Array.isArray(thread.attachments)
      ? thread.attachments
      : [];
  const hasFiles = attachments.length > 0;

  // Disable the composer when the candidate limit is reached AND the applicant is
  // "interested" (mirrors the app's isCandidateLimitReached).
  const limitReached = !!(candidateLimit && candidateLimit.percentage >= 100);
  const composerDisabled = !!(
    thread &&
    thread !== 'unable' &&
    thread.is_interested &&
    limitReached
  );
  const upgradeUrl = (candidateLimit && candidateLimit.upgrade_url) || '';

  // Toolbar read/unread toggle. `read` true → offer "Mark As Read" (currently unread);
  // after marking read it flips to "Mark As Unread".
  const showReadToggle = !!(mappedThread && mappedThread.showButton);
  const isUnread = !!(mappedThread && mappedThread.read);
  const handleToggleRead = () => {
    if (!activeId || !mappedThread) return;
    toggleReadStatus({ id: activeId, status: isUnread ? 'read' : 'unread' });
  };

  // The Files button is always visible; the red dot shows only when the conversation
  // has attachments. Notes/Templates remain hidden for now.
  const panelButtons = [
    {
      key: 'files',
      label: __('Files', 'easyjobs'),
      icon: 'paperclip',
      dot: hasFiles,
    },
  ];

  // When a conversation loads, auto-open the Files panel if it has attachments,
  // and close it otherwise. Keyed on the applicant id so it runs on conversation
  // change (not on every minor thread update, e.g. after sending a message).
  const threadId = thread && thread !== 'unable' ? thread.id : null;
  useEffect(() => {
    // Only auto-open on desktop — on mobile (single-pane) a panel would cover the
    // thread the moment it loads.
    const wide =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(min-width: 1101px)').matches;
    setRightPanel(wide && hasFiles ? 'files' : null);
  }, [threadId]);

  // First load (no data yet) → skeleton.
  if (conversationsLoading && !conversations) {
    return <MessagesSkeleton />;
  }

  return (
    <section
      data-testid="ej-messages"
      className={`ej-messages ${mountedPanel ? 'has-side' : ''} ${
        threadOpenMobile ? 'ej-messages--thread-open' : ''
      }`}
    >
      {/* Top bar */}
      <div className="ej-msg-topbar">
        <div className="ej-msg-topbar__left">
          <h1 className="ej-msg-pagetitle">{__('Messages', 'easyjobs')}</h1>
          <button
            type="button"
            className={`ej-msg-newbtn ${newMode ? 'is-active' : ''}`}
            onClick={() => setNewMode((prev) => !prev)}
          >
            <span className="ej-msg-newbtn__icon">
              <Icon name="editAlt" size={16} />
            </span>
            <span className="ej-msg-newbtn__label">
              {__('New', 'easyjobs')}
            </span>
          </button>
        </div>

        <div className="ej-msg-topbar__options">
          <div className="ej-msg-filterwrap" ref={filterRef}>
            <button
              type="button"
              className={`ej-msg-filterbtn ${filtersOpen ? 'is-active' : ''}`}
              onClick={() => setFiltersOpen((o) => !o)}
              aria-label={__('Filters', 'easyjobs')}
            >
              <Icon name="filter" size={20} />
              {filterCount > 0 ? (
                <span
                  className="ej-msg-filterbtn__badge"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    applyFilters(DEFAULT_FILTERS);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      applyFilters(DEFAULT_FILTERS);
                    }
                  }}
                  aria-label={__('Reset filters', 'easyjobs')}
                  title={__('Reset filters', 'easyjobs')}
                >
                  <span className="ej-msg-filterbtn__count">{filterCount}</span>
                  <span className="ej-msg-filterbtn__reset" aria-hidden="true">
                    <Icon name="refresh" size={12} strokeWidth={2.2} />
                  </span>
                </span>
              ) : null}
            </button>
            {filtersOpen ? (
              <FilterPanel
                filters={filters}
                onClose={() => setFiltersOpen(false)}
                onApply={applyFilters}
              />
            ) : null}
          </div>

          <div className="ej-msg-search">
            <Icon name="search" size={18} className="ej-msg-search__icon" />
            <input
              type="text"
              placeholder={__('Search…', 'easyjobs')}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {search ? (
              <button
                type="button"
                className="ej-msg-search__clear"
                onClick={clearSearch}
                aria-label={__('Clear search', 'easyjobs')}
              >
                <Icon name="close" size={12} />
              </button>
            ) : null}
          </div>

          <div className="ej-msg-panelbtns">
            {showReadToggle ? (
              <button
                type="button"
                className={`ej-msg-panelbtn ej-msg-readbtn ${
                  isUnread ? '' : 'is-read'
                }`}
                onClick={handleToggleRead}
              >
                <span className="ej-msg-panelbtn__icon">
                  <Icon name={isUnread ? 'mailOpen' : 'mail'} size={15} />
                </span>
                <span>
                  {isUnread
                    ? __('Mark As Read', 'easyjobs')
                    : __('Mark As Unread', 'easyjobs')}
                </span>
              </button>
            ) : null}
            {panelButtons.map((b) => (
              <button
                type="button"
                key={b.key}
                className={`ej-msg-panelbtn ${
                  rightPanel === b.key ? 'is-active' : ''
                } ${b.dot ? 'has-dot' : ''}`}
                onClick={() => togglePanel(b.key)}
              >
                <span className="ej-msg-panelbtn__icon">
                  <Icon name={b.icon} size={15} />
                </span>
                <span>{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body: list | thread | optional side panel */}
      <div className="ej-msg-body">
        {newMode ? (
          <NewConversation
            activeId={activeId}
            baseParams={buildListParams(filters, '', 0)}
            onBack={() => setNewMode(false)}
            onSelect={(candidate) => {
              // Like the app: keep the New Conversation panel open and just load
              // the picked candidate's thread, highlighting the selected row.
              setThreadOpenMobile(true);
              if (candidate.id === activeId) return;
              setActiveId(candidate.id);
              fetchThread({ id: candidate.id });
            }}
          />
        ) : (
          <ConversationList
            conversations={list}
            activeId={activeId}
            onSelect={handleSelect}
            error={conversationsError}
            onReset={resetAll}
            onLoadMore={loadMoreConversations}
            hasMore={conversationsPage < conversationsLastPage}
            loadingMore={conversationsLoading && list.length > 0}
          />
        )}

        <ChatThread
          thread={mappedThread}
          loading={threadLoading}
          sending={sending}
          onSend={handleSend}
          onBack={handleBack}
          disabled={composerDisabled}
          upgradeUrl={upgradeUrl}
          hasMore={threadPage < threadLastPage}
          loadingMore={!!threadLoadingMore}
          onLoadOlder={loadOlderMessages}
        />

        {mountedPanel ? (
          <RightPanel
            panel={mountedPanel}
            attachments={attachments}
            open={panelOpen}
          />
        ) : null}
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  conversations: state.messages.conversations,
  conversationsLoading: state.messages.conversationsLoading,
  conversationsError: state.messages.conversationsError,
  conversationsPage: state.messages.conversationsPage,
  conversationsLastPage: state.messages.conversationsLastPage,
  thread: state.messages.thread,
  threadLoading: state.messages.threadLoading,
  threadPage: state.messages.threadPage,
  threadLastPage: state.messages.threadLastPage,
  threadLoadingMore: state.messages.threadLoadingMore,
  sending: state.messages.sending,
  candidateLimit: state.dashboard.candidateLimit,
});

const mapDispatchToProps = (dispatch) => ({
  fetchConversations: (params, append) =>
    dispatch(getConversations(params, append)),
  fetchThread: (params, append) =>
    dispatch(getConversationThread(params, append)),
  postMessage: (params) => dispatch(sendMessage(params)),
  toggleReadStatus: (params) => dispatch(changeMessageStatus(params)),
  fetchNotifications: () => dispatch(getMessageNotifications()),
  fetchCandidateLimit: () => dispatch(getCandidateLimit()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
