import { __ } from '@wordpress/i18n';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import LinkTag from '../../util/Link';
import { copyToClipboard } from '../../util/helper';
import CandidateAvatar from '../../util/CandidateAvatar';
import Icon from '../../util/Icon';
import Pager from '../../util/Pager';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
var SkRow = function () {
  return (
    <tr className="ej-tbl-sk-row">
      <td>
        <span className="ej-skel" style={{ width: '55%', height: 14 }} />
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex' }}>
            {[0, 1, 2].map(function (i) {
              return (
                <span
                  key={i}
                  className="ej-skel ej-skel-circle"
                  style={{
                    width: 28,
                    height: 28,
                    marginLeft: i ? -9 : 0,
                    border: '2px solid #fff',
                  }}
                />
              );
            })}
          </div>
          <span
            className="ej-skel"
            style={{ width: 32, height: 22, borderRadius: 999 }}
          />
        </div>
      </td>
      <td>
        <span
          className="ej-skel"
          style={{ width: 70, height: 24, borderRadius: 7 }}
        />
      </td>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span className="ej-skel" style={{ width: 90, height: 13 }} />
          <span className="ej-skel" style={{ width: 64, height: 11 }} />
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
          {[0, 1, 2].map(function (i) {
            return (
              <span
                key={i}
                className="ej-skel"
                style={{ width: 30, height: 30, borderRadius: 7 }}
              />
            );
          })}
        </div>
      </td>
    </tr>
  );
};

var RecentJobsSkeleton = function () {
  return (
    <section className="ej-section">
      <div className="ej-surface">
        <div className="ej-jobs-head">
          <span
            className="ej-skel"
            style={{ width: 110, height: 18, borderRadius: 4 }}
          />
          <span
            className="ej-skel"
            style={{ width: 88, height: 14, borderRadius: 4 }}
          />
        </div>
        <div className="ej-tbl-scroll">
          <table className="ej-tbl">
            <thead>
              <tr>
                {['45%', '14%', '10%', '13%', '8%'].map(function (w, i) {
                  return (
                    <th
                      key={i}
                      style={{ textAlign: i === 4 ? 'right' : 'left' }}
                    >
                      <span
                        className="ej-skel"
                        style={{
                          width: w,
                          height: 10,
                          display: 'inline-block',
                        }}
                      />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4].map(function (i) {
                return <SkRow key={i} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

// ─── Share dropdown ───────────────────────────────────────────────────────────
// The menu is rendered through a portal to <body> with position:fixed, so it can
// never be clipped by the table's horizontal-scroll wrapper (.ej-tbl-scroll uses
// overflow-x:auto, which forces overflow-y to clip too). Open direction flips
// automatically based on the room available below the trigger in the viewport,
// which keeps it fully visible for 1, 2, or many rows.
var SHARE_MENU_W = 152;
var SHARE_MENU_H = 168; // ~4 items — estimate, only used to choose a direction
var SHARE_GAP = 6;

var ShareDropdown = function (props) {
  var jobInfo = props.jobInfo;

  var _open = useState(false);
  var open = _open[0];
  var setOpen = _open[1];

  var _pos = useState({ left: 0, top: 0 });
  var pos = _pos[0];
  var setPos = _pos[1];

  var wrapRef = useRef(null);
  var closeTimer = useRef(null);

  var cancelClose = function () {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // Small delay so the mouse can cross the gap from the trigger to the menu
  // without the menu closing underneath it.
  var scheduleClose = function () {
    cancelClose();
    closeTimer.current = setTimeout(function () {
      setOpen(false);
    }, 140);
  };

  var computePos = function () {
    var el = wrapRef.current;
    if (!el) return null;
    var r = el.getBoundingClientRect();
    var spaceBelow = window.innerHeight - r.bottom;
    var dropUp =
      spaceBelow < SHARE_MENU_H + SHARE_GAP && r.top > SHARE_MENU_H + SHARE_GAP;
    var top = dropUp ? r.top - SHARE_GAP - SHARE_MENU_H : r.bottom + SHARE_GAP;
    // Right-align the menu under the trigger, then clamp inside the viewport.
    var left = Math.min(
      Math.max(8, r.right - SHARE_MENU_W),
      window.innerWidth - SHARE_MENU_W - 8,
    );
    return { left: left, top: top };
  };

  var openMenu = function () {
    cancelClose();
    var p = computePos();
    if (p) {
      setPos(p);
      setOpen(true);
    }
  };

  // While open, keep the fixed menu glued to the trigger as the page scrolls or
  // resizes, and close it if the trigger scrolls out of view.
  useEffect(
    function () {
      if (!open) return undefined;
      var update = function () {
        var el = wrapRef.current;
        if (!el) return;
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) {
          setOpen(false);
          return;
        }
        var p = computePos();
        if (p) setPos(p);
      };
      window.addEventListener('scroll', update, true);
      window.addEventListener('resize', update);
      return function () {
        window.removeEventListener('scroll', update, true);
        window.removeEventListener('resize', update);
      };
    },
    [open],
  );

  // Clear any pending close timer if the row unmounts mid-hover.
  useEffect(function () {
    return cancelClose;
  }, []);

  var menu = (
    <div
      className="ej-share-pop"
      style={{
        position: 'fixed',
        left: pos.left,
        top: pos.top,
        width: SHARE_MENU_W,
      }}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      <a className="dropdown-item" href={jobInfo.social_links.facebook}>
        <div className="dropdown-icon">
          <i className="easyjobs-icon easyjobs-facebook" />
        </div>
        facebook
      </a>
      <a className="dropdown-item" href={jobInfo.social_links.linkedIn}>
        <div className="dropdown-icon">
          <i className="easyjobs-icon easyjobs-linkedin" />
        </div>
        linkedin
      </a>
      <a className="dropdown-item" href={jobInfo.social_links.twitter}>
        <div className="dropdown-icon">
          <i className="eicon-2 eicon-2-twitter-x" />
        </div>
        twitter
      </a>
      <a
        className="dropdown-item"
        style={{ cursor: 'pointer' }}
        onClick={function () {
          copyToClipboard(jobInfo.view_url);
          setOpen(false);
        }}
      >
        <div className="dropdown-icon">
          <Icon id="i-copy" size={14} />
        </div>
        Copy link
      </a>
    </div>
  );

  return (
    <div
      className="job-share-dashboard"
      ref={wrapRef}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={'ej-act-btn' + (open ? ' is-active' : '')}
        aria-label={__('Share', 'easyjobs')}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        onClick={function () {
          if (open) {
            setOpen(false);
          } else {
            openMenu();
          }
        }}
      >
        <Icon id="i-share" size={15} />
      </button>
      {open && createPortal(menu, document.body)}
    </div>
  );
};

// ─── Sort column header ───────────────────────────────────────────────────────
var SortIcon = function (props) {
  var dir = props.dir;
  if (dir === 'asc') {
    return React.createElement(
      'svg',
      {
        width: 10,
        height: 10,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
      },
      React.createElement('path', { d: 'M12 19V5M5 12l7-7 7 7' }),
    );
  }
  if (dir === 'desc') {
    return React.createElement(
      'svg',
      {
        width: 10,
        height: 10,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
      },
      React.createElement('path', { d: 'M12 5v14M19 12l-7 7-7-7' }),
    );
  }
  return React.createElement(
    'svg',
    {
      width: 10,
      height: 10,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': true,
    },
    React.createElement('path', { d: 'M8 9l4-4 4 4M8 15l4 4 4-4' }),
  );
};

var SortTh = function (props) {
  var isActive = props.isActive;
  var dir = props.dir;
  var onSort = props.onSort;
  var sortKey = props.sortKey;
  return (
    <th className={props.className || ''}>
      <span
        className={'ej-tbl-sort' + (isActive ? ' is-active' : '')}
        onClick={function () {
          onSort(sortKey);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={function (e) {
          if (e.key === 'Enter' || e.key === ' ') onSort(sortKey);
        }}
      >
        {props.children}
        <SortIcon dir={isActive ? dir : null} />
      </span>
    </th>
  );
};

// ─── Column label map for toast messages ──────────────────────────────────────
var SORT_LABELS = {
  title: __('Job Title', 'easyjobs'),
  applicants: __('Applicants', 'easyjobs'),
  status: __('Status', 'easyjobs'),
  deadline: __('Deadline', 'easyjobs'),
};

// ─── Main component ───────────────────────────────────────────────────────────
var RecentJobs = function (props) {
  var getRecentJobs = props.getRecentJobs;
  var recentJobs = props.recentJobs;
  var loading = props.loading;

  var _sortKey = useState(null);
  var sortKey = _sortKey[0];
  var setSortKey = _sortKey[1];

  var _sortDir = useState('asc');
  var sortDir = _sortDir[0];
  var setSortDir = _sortDir[1];

  var handleSort = function (key) {
    var nextDir;
    if (sortKey === key) {
      nextDir = sortDir === 'asc' ? 'desc' : 'asc';
      setSortDir(nextDir);
    } else {
      nextDir = 'asc';
      setSortKey(key);
      setSortDir('asc');
    }
    var label = SORT_LABELS[key] || key;
    var dirLabel =
      nextDir === 'asc' ? __('A–Z', 'easyjobs') : __('Z–A', 'easyjobs');
    if (key === 'applicants')
      dirLabel =
        nextDir === 'asc'
          ? __('Low to High', 'easyjobs')
          : __('High to Low', 'easyjobs');
    if (key === 'status')
      dirLabel =
        nextDir === 'asc'
          ? __('Active First', 'easyjobs')
          : __('Expired First', 'easyjobs');
    if (key === 'deadline')
      dirLabel =
        nextDir === 'asc'
          ? __('Earliest First', 'easyjobs')
          : __('Latest First', 'easyjobs');
    toast.info(
      __('Sorted by:', 'easyjobs') + ' ' + label + ' (' + dirLabel + ')',
      { autoClose: 2000, hideProgressBar: true },
    );
  };

  var sortedData = (function () {
    if (!recentJobs || !recentJobs.data) return [];
    if (!sortKey) return recentJobs.data;
    var data = recentJobs.data.slice();
    data.sort(function (a, b) {
      var av, bv;
      if (sortKey === 'title') {
        av = (a.title || '').toLowerCase();
        bv = (b.title || '').toLowerCase();
      } else if (sortKey === 'applicants') {
        av = a.applicant_count || 0;
        bv = b.applicant_count || 0;
      } else if (sortKey === 'status') {
        av = a.is_expired ? 1 : 0;
        bv = b.is_expired ? 1 : 0;
      } else if (sortKey === 'deadline') {
        av = a.expire_at || '';
        bv = b.expire_at || '';
      } else {
        return 0;
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  })();

  var handlePageChange = function (page) {
    getRecentJobs(page);
  };

  if (loading) return React.createElement(RecentJobsSkeleton, null);

  return (
    <section className="ej-section" id="easyjobs-recent-jobs">
      <div className="ej-surface">
        <div className="ej-jobs-head">
          <h2>{__('Recent Jobs', 'easyjobs')}</h2>
          {recentJobs && recentJobs.data && recentJobs.data.length > 0 && (
            <LinkTag to="easyjobs-jobs" className="ej-see-link">
              {__('View all jobs', 'easyjobs')} <Icon id="i-arr" size={13} />
            </LinkTag>
          )}
        </div>

        {recentJobs && recentJobs.data && recentJobs.data.length > 0 ? (
          <div className="ej-tbl-scroll">
            <table className="ej-tbl">
              <thead>
                <tr>
                  <SortTh
                    sortKey="title"
                    isActive={sortKey === 'title'}
                    dir={sortDir}
                    onSort={handleSort}
                  >
                    {__('Job Title', 'easyjobs')}
                  </SortTh>
                  <SortTh
                    sortKey="applicants"
                    isActive={sortKey === 'applicants'}
                    dir={sortDir}
                    onSort={handleSort}
                  >
                    {__('Applicants', 'easyjobs')}
                  </SortTh>
                  <SortTh
                    sortKey="status"
                    isActive={sortKey === 'status'}
                    dir={sortDir}
                    onSort={handleSort}
                  >
                    {__('Status', 'easyjobs')}
                  </SortTh>
                  <SortTh
                    sortKey="deadline"
                    isActive={sortKey === 'deadline'}
                    dir={sortDir}
                    onSort={handleSort}
                  >
                    {__('Deadline', 'easyjobs')}
                  </SortTh>
                  <th className="right">{__('Actions', 'easyjobs')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map(function (job) {
                  var applicantList = job.applicants
                    ? Object.values(job.applicants)
                    : [];
                  return (
                    <tr key={job.id}>
                      <td>
                        <LinkTag
                          to={'easyjobs-pipeline&id=' + job.id}
                          className="ej-job-title"
                        >
                          {job.title}
                        </LinkTag>
                      </td>
                      <td>
                        <div className="ej-appl">
                          {job.applicant_count > 0 ? (
                            <>
                              <LinkTag
                                to={'easyjobs-job-candidates&id=' + job.id}
                                className="ej-appl-stack"
                              >
                                {applicantList.slice(0, 3).map(function (a, i) {
                                  return (
                                    <CandidateAvatar
                                      key={i}
                                      name={a.name || ''}
                                      src={a.image}
                                      size={28}
                                      className="ej-appl-sm"
                                    />
                                  );
                                })}
                              </LinkTag>
                              <span className="ej-appl-cnt tnum">
                                {job.applicant_count}
                              </span>
                            </>
                          ) : (
                            <span className="ej-appl-cnt tnum">0</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={
                            'ej-st-pill ' +
                            (job.is_expired ? 'expired' : 'active')
                          }
                        >
                          <span className="dot" />
                          {job.is_expired
                            ? __('Expired', 'easyjobs')
                            : __('Active', 'easyjobs')}
                        </span>
                      </td>
                      <td>
                        <div className="ej-dl">
                          <span className="ej-dl-date tnum">
                            {job.expire_at}
                          </span>
                          {job.days_left && (
                            <span
                              className={
                                'ej-dl-rel tnum ' +
                                (job.is_expired ? 'amber' : 'accent')
                              }
                            >
                              {job.days_left}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="ej-row-acts">
                          <a
                            href={job.view_url}
                            target="_blank"
                            rel="noreferrer"
                            className="ej-act-btn"
                            aria-label={__('View', 'easyjobs')}
                          >
                            <Icon id="i-eye" size={15} />
                          </a>
                          <LinkTag
                            to={'easyjobs-edit&id=' + job.id}
                            className="ej-act-btn"
                            aria-label={__('Edit', 'easyjobs')}
                          >
                            <Icon id="i-pen" size={15} />
                          </LinkTag>
                          {!job.is_expired && <ShareDropdown jobInfo={job} />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ej-job-section">
            <div className="ej-empty-card">
              <div className="ej-empty-icon">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <line x1="12" y1="12" x2="12.01" y2="12" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <div className="ej-empty-text">
                {__('No jobs found.', 'easyjobs')}
              </div>
            </div>
          </div>
        )}

        <Pager
          pageSize={recentJobs?.per_page}
          current={recentJobs?.current_page}
          total={recentJobs?.total}
          onChange={handlePageChange}
          alwaysShowInfo
        />
      </div>
    </section>
  );
};

export default RecentJobs;
