import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { __ } from '@wordpress/i18n';
import {
  getMinimalInfo,
  syncCompanyInfo,
} from '../../redux/actions/companyActions';
import { disconnectApi } from '../../redux/actions/settingsActions';
import { getMessageNotifications } from '../../redux/actions/messagesActions';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import Icon from '../../util/Icon';
import CandidateAvatar from '../../util/CandidateAvatar';

const mapStateToProps = function (state) {
  return {
    companyInfo: state.settings.companyInfo,
    synced: state.company.synced,
    statusMessage: state.company.statusMessage,
    apiDisconnected: state.settings.apiDisconnected,
    unseenMessages: state.messages.unseen,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    getCompanyInfo: function () {
      return dispatch(getMinimalInfo());
    },
    syncData: function () {
      return dispatch(syncCompanyInfo());
    },
    disconnectApi: function () {
      return dispatch(disconnectApi());
    },
    fetchMessageNotifications: function () {
      return dispatch(getMessageNotifications());
    },
  };
};

var Header = function (props) {
  var companyInfo = props.companyInfo;
  var getCompanyInfo = props.getCompanyInfo;
  var syncData = props.syncData;
  var synced = props.synced;
  var statusMessage = props.statusMessage;
  var disconnectApi = props.disconnectApi;
  var apiDisconnected = props.apiDisconnected;
  var unseenMessages = props.unseenMessages;
  var fetchMessageNotifications = props.fetchMessageNotifications;

  var _isPro = useState(undefined);
  var isPro = _isPro[0];
  var setIsPro = _isPro[1];

  var _syncing = useState(false);
  var syncing = _syncing[0];
  var setSyncing = _syncing[1];

  var _lastSynced = useState(null);
  var lastSynced = _lastSynced[0];
  var setLastSynced = _lastSynced[1];

  var _headerLogoutClicked = useState(false);
  var headerLogoutClicked = _headerLogoutClicked[0];
  var setHeaderLogoutClicked = _headerLogoutClicked[1];

  var _showMenu = useState(false);
  var showMenu = _showMenu[0];
  var setShowMenu = _showMenu[1];

  var menuRef = useRef(null);
  var history = useHistory();

  useEffect(function () {
    getCompanyInfo();
  }, []);

  // Unseen message count for the header badge. Refreshed live whenever a
  // conversation is marked read/unread (the messages saga re-dispatches this).
  useEffect(function () {
    fetchMessageNotifications();
  }, []);

  var goToMessages = function () {
    history.push('admin.php?page=easyjobs-messages');
  };
  var unseenCount = unseenMessages ? parseInt(unseenMessages, 10) || 0 : 0;

  useEffect(
    function () {
      if (companyInfo) {
        setIsPro(companyInfo.is_pro);
      }
    },
    [companyInfo],
  );

  useEffect(
    function () {
      if (synced) {
        setSyncing(false);
        setLastSynced(Date.now());
      }
    },
    [synced],
  );

  useEffect(
    function () {
      if (statusMessage) {
        if (statusMessage.type === 'success')
          toast.success(statusMessage.message);
        if (statusMessage.type === 'error') toast.error(statusMessage.message);
      }
    },
    [statusMessage],
  );

  useEffect(
    function () {
      if (
        typeof apiDisconnected !== 'undefined' &&
        apiDisconnected &&
        headerLogoutClicked
      ) {
        toast.success(__('Api disconnected successfully.', 'easyjobs'));
        setHeaderLogoutClicked(false);
        setTimeout(function () {
          window.location.href = easyJobsJs.easyjobs_admin_url;
        }, 1200);
      }
    },
    [apiDisconnected],
  );

  useEffect(
    function () {
      var handleClickOutside = function (event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setShowMenu(false);
        }
      };
      if (showMenu) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return function () {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    },
    [showMenu],
  );

  var syncLabel = (function () {
    if (syncing) return __('Syncing…', 'easyjobs');
    if (!lastSynced) return __('Sync now', 'easyjobs');
    var mins = Math.round((Date.now() - lastSynced) / 60000);
    if (mins < 1) return __('Synced just now', 'easyjobs');
    return __('Synced', 'easyjobs') + ' ' + mins + ' min ago';
  })();

  var syncCompanyData = function (e) {
    e.preventDefault();
    setSyncing(true);
    syncData();
  };

  var handleMenuItemClick = function (path) {
    setShowMenu(false);
    history.push(path);
  };

  var SubscriptionBadge = function () {
    if (typeof isPro === 'undefined') return null;
    if (isPro) {
      if (companyInfo && companyInfo.subscription_expired) {
        return React.createElement(
          'span',
          { className: 'p-head-pro-badge p-head-pro-badge--expired' },
          'PRO (expired)',
        );
      }
      return React.createElement(
        'span',
        { className: 'p-head-pro-badge' },
        'PRO',
      );
    }
    return React.createElement(
      'span',
      { className: 'p-head-free-badge' },
      'FREE',
    );
  };

  return (
    <header className="p-head">
      <div className="p-head-brand">
        <img
          src={
            easyJobsJs.plugin_url + 'admin/assets/img/easyjobs-icon-blue.svg'
          }
          alt="easy.jobs"
          className="p-head-brand-icon"
          width="34"
          height="34"
        />
        <div className="p-head-brand-txt">
          <div className="p-head-brand-row">
            <span className="p-head-brand-name">
              easy<span className="p-head-brand-dot">.</span>jobs
            </span>
            <SubscriptionBadge />
          </div>
          <span className="p-head-brand-sub">
            v{easyJobsJs.version}
            {companyInfo && companyInfo.name
              ? ' · ' + companyInfo.name + ' workspace'
              : ''}
          </span>
        </div>
      </div>

      <div className="p-head-right">
        {/* Messages shortcut + live unread badge. */}
        <div
          role="button"
          tabIndex={0}
          className="p-head-msg-btn"
          onClick={goToMessages}
          onKeyDown={function (e) {
            if (e.key === 'Enter' || e.key === ' ') goToMessages();
          }}
          aria-label={
            __('Messages', 'easyjobs') +
            (unseenCount > 0 ? ' (' + unseenCount + ' unread)' : '')
          }
          title={__('Messages', 'easyjobs')}
        >
          {/* App's `e-chat` (eicon) glyph — two overlapping speech bubbles. */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 1024 1024"
            fill="currentColor"
            fillRule="evenodd"
            aria-hidden="true"
          >
            <path d="M634.083 61.823h-544.084c-0.027 0-0.059 0-0.091 0-49.655 0-89.907 40.253-89.907 89.907 0 0.016 0 0.032 0 0.048v-0.003 360.039c0 0.081 0 0.177 0 0.272 0 49.655 40.253 89.907 89.907 89.907 0.033 0 0.064 0 0.097 0h30.009v89.999c0 0.021 0 0.047 0 0.071 0 16.577 13.438 30.015 30.015 30.015 5.269 0 10.22-1.358 14.524-3.743l-0.154 0.078c0.592-0.592 1.819-0.592 2.41-1.182 165.171-110.69 128.063-86.133 165.171-110.69 4.574-2.993 10.169-4.787 16.181-4.82h286.057c0.027 0 0.059 0 0.091 0 49.655 0 89.907-40.253 89.907-89.907 0-0.032 0-0.064 0-0.096v0.005-359.949c0-0.013 0-0.030 0-0.046 0-49.655-40.253-89.907-89.907-89.907-0.080 0-0.16 0-0.24 0h0.012zM394.057 421.862h-243.983c-16.577 0-30.015-13.438-30.015-30.015s13.438-30.015 30.015-30.015v0h243.983c16.577 0 30.015 13.438 30.015 30.015s-13.438 30.015-30.015 30.015v0zM574.099 301.849h-424.025c-16.577 0-30.015-13.438-30.015-30.015s13.438-30.015 30.015-30.015v0h424.070c16.567 0.013 29.992 13.446 29.992 30.015 0 16.577-13.438 30.015-30.015 30.015-0.008 0-0.016 0-0.024 0h0.001z" />
            <path d="M934.139 301.849h-150.073v210.012c0 82.883-67.19 150.073-150.073 150.073v0h-277.044l-57.028 37.792v52.207c0 0.027 0 0.059 0 0.091 0 49.655 40.253 89.907 89.907 89.907 0.032 0 0.064 0 0.096 0h295.048l172.22 115.238c4.682 3.14 10.445 5.011 16.644 5.011 16.652 0 30.151-13.499 30.151-30.151 0-0.018 0-0.038 0-0.056v0.003-89.953h30.015c0.027 0 0.059 0 0.091 0 49.655 0 89.907-40.253 89.907-89.907 0-0.032 0-0.064 0-0.096v0.005-360.221c0-0.013 0-0.030 0-0.046 0-49.639-40.227-89.882-89.86-89.907h-0.003z" />
          </svg>
          {unseenCount > 0 ? (
            <span className="p-head-msg-badge">
              {unseenCount > 99 ? '99+' : unseenCount}
            </span>
          ) : null}
        </div>

        {/* Use div+role instead of <button> to avoid WP admin button CSS conflicts */}
        <div
          role="button"
          tabIndex={0}
          className={'p-head-sync-btn' + (syncing ? ' syncing' : '')}
          onClick={syncCompanyData}
          onKeyDown={function (e) {
            if (e.key === 'Enter' || e.key === ' ') syncCompanyData(e);
          }}
        >
          <span className="p-head-sync-hint">
            {__('Click to sync now', 'easyjobs')}
          </span>
          <span className="p-head-sync-txt">{syncLabel}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 3v6h-6M3 21v-6h6M3.5 9a9 9 0 0114.9-3.4L21 8M20.5 15A9 9 0 015.6 18.4L3 16" />
          </svg>
        </div>

        <a
          href={
            companyInfo && companyInfo.company_easyjob_url
              ? companyInfo.company_easyjob_url
              : '#'
          }
          target="_blank"
          rel="noreferrer"
          className="p-head-btn-outline"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
          {__('View Company Page', 'easyjobs')}
        </a>

        {companyInfo && (
          <div className="p-head-ws-wrap" ref={menuRef}>
            <div
              role="button"
              tabIndex={0}
              className="p-head-ws-btn"
              onClick={function () {
                setShowMenu(!showMenu);
              }}
              onKeyDown={function (e) {
                if (e.key === 'Enter' || e.key === ' ') setShowMenu(!showMenu);
              }}
            >
              <CandidateAvatar
                name={companyInfo.name || ''}
                src={companyInfo.logo}
                size={28}
                className="p-head-ws-av"
              />
              <span className="p-head-ws-who">
                <b>
                  <span className="p-head-ws-name">{companyInfo.name}</span>
                  {!!companyInfo.is_verified && (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      style={{ color: '#4F46E5', marginLeft: 3, flexShrink: 0 }}
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" fill="currentColor" />
                      <path
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12.5l3 3 5-6"
                      />
                    </svg>
                  )}
                </b>
                <span>{__('Workspace', 'easyjobs')}</span>
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="p-head-ws-chev"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {showMenu && (
              <div className="p-head-ws-menu">
                <div className="p-head-ws-lbl">{__('Account', 'easyjobs')}</div>
                <div
                  role="button"
                  tabIndex={0}
                  className="p-head-ws-menu-item"
                  onClick={function () {
                    handleMenuItemClick(
                      'admin.php?page=easyjobs-settings&tab=basic',
                    );
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-2.8 1.2V21a2 2 0 01-4 0a1.7 1.7 0 00-2.8-1.2l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.7 1.7 0 003 15a2 2 0 010-4a1.7 1.7 0 001.2-2.8l-.1-.1a2 2 0 112.8-2.8l.1.1A1.7 1.7 0 009 4.6V4a2 2 0 014 0a1.7 1.7 0 002.8 1.2l.1-.1a2 2 0 112.8 2.8l-.1.1A1.7 1.7 0 0021 11a2 2 0 010 4z" />
                  </svg>
                  <span className="p-head-ws-menu-item-txt">
                    {__('Settings', 'easyjobs')}
                  </span>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  className="p-head-ws-menu-item"
                  onClick={function () {
                    handleMenuItemClick(
                      'admin.php?page=easyjobs-settings&tab=subscription',
                    );
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
                  </svg>
                  <span className="p-head-ws-menu-item-txt">
                    {__('Subscriptions', 'easyjobs')}
                  </span>
                </div>
                <div className="p-head-ws-sep" />
                <div
                  role="button"
                  tabIndex={0}
                  className="p-head-ws-menu-item p-head-ws-menu-item--danger"
                  onClick={function () {
                    setShowMenu(false);
                    setHeaderLogoutClicked(true);
                    disconnectApi();
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  <span className="p-head-ws-menu-item-txt">
                    {__('Disconnect', 'easyjobs')}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
