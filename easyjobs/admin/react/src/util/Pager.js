import React from 'react';
import { __ } from '@wordpress/i18n';
import Pagination from 'rc-pagination';
import localeInfo from './locale/en_US';

// ─── Pagination arrow icons ───────────────────────────────────────────────────
// SVG chevrons passed to rc-pagination via prevIcon/nextIcon so every list
// (dashboard recent jobs, all jobs, candidates) renders the same control.
const PrevIcon = React.createElement(
  'button',
  {
    type: 'button',
    'aria-label': 'Previous page',
    className: 'rc-pagination-item-link',
  },
  React.createElement(
    'svg',
    {
      width: 16,
      height: 16,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    React.createElement('path', { d: 'M15 18l-6-6 6-6' }),
  ),
);

const NextIcon = React.createElement(
  'button',
  {
    type: 'button',
    'aria-label': 'Next page',
    className: 'rc-pagination-item-link',
  },
  React.createElement(
    'svg',
    {
      width: 16,
      height: 16,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    React.createElement('path', { d: 'M9 18l6-6-6-6' }),
  ),
);

// Shared pager: the rc-pagination control, optionally wrapped with the
// "Showing x–y of z" info row. Renders nothing when there is at most one page,
// unless alwaysShowInfo is set — then the info row still shows (with no page
// controls), used by the dashboard recent-jobs card so its footer count stays
// visible even when everything fits on one page.
// Pass showInfo={false} for a bare, left-aligned control (jobs / candidates lists).
const Pager = ({
  pageSize,
  current,
  total,
  onChange,
  showInfo = true,
  alwaysShowInfo = false,
}) => {
  if (!total || !pageSize) {
    return null;
  }

  const singlePage = total <= pageSize;

  // Single page: keep just the info row when explicitly asked, otherwise nothing.
  if (singlePage && !(alwaysShowInfo && showInfo)) {
    return null;
  }

  const pagination = singlePage ? null : (
    <Pagination
      pageSize={pageSize}
      current={current}
      total={total}
      onChange={onChange}
      prevIcon={PrevIcon}
      nextIcon={NextIcon}
      locale={__(localeInfo, 'easyjobs')}
    />
  );

  if (!showInfo) {
    return pagination;
  }

  const safeCurrent = current || 1;
  const start = (safeCurrent - 1) * pageSize + 1;
  const end = Math.min(safeCurrent * pageSize, total);

  return (
    <div className="ej-pager">
      <span className="ej-pager-info tnum">
        {__('Showing', 'easyjobs')} {start}–{end} {__('of', 'easyjobs')} {total}
      </span>
      {pagination}
    </div>
  );
};

export default Pager;
