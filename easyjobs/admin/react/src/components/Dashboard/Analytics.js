import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import AnalyticsChart from './AnalyticsChart';

// Five ranges. Labels are abbreviated: Days → D, Months → M, Year → Y
// (7 Days, 10 Days, 30 Days, 6 Months, 1 Year). `noOfDays` follows the API's
// `last{N}` convention — day periods count days, month periods count months
// (so last6 = 6 months, last12 = 12 months = 1 year).
var RANGE_OPTIONS = [
  { label: '7D', params: { period: 'day', noOfDays: 'last7' } },
  { label: '10D', params: { period: 'day', noOfDays: 'last10' } },
  { label: '30D', params: { period: 'day', noOfDays: 'last30' } },
  { label: '6M', params: { period: 'month', noOfDays: 'last6' } },
  { label: '1Y', params: { period: 'month', noOfDays: 'last12' } },
];

var METRIC_TABS = [
  {
    key: 'visitors',
    label: __('Visitors', 'easyjobs'),
    color: '#4F46E5',
    seriesName: 'visitors',
  },
  {
    key: 'unique',
    label: __('Unique Visitors', 'easyjobs'),
    color: '#0EA5E9',
    seriesName: 'unique visitors',
  },
  {
    key: 'actions',
    label: __('Performed Actions', 'easyjobs'),
    color: '#10B981',
    seriesName: 'performed actions',
  },
  {
    key: 'applied',
    label: __('Candidates Applied', 'easyjobs'),
    color: '#F59E0B',
    seriesName: 'candidates applied',
  },
  {
    key: 'pending',
    label: __('Candidates Pending', 'easyjobs'),
    color: '#A855F7',
    seriesName: 'candidates pending',
  },
];

var PRO_URL = 'https://easy.jobs/#pricing';

var CrownIcon = function () {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.4374 4.27252C12.7641 3.2425 11.2359 3.24249 10.5626 4.27252L7.16316 9.47274L4.56478 8.00058C3.26302 7.26303 1.69785 8.41888 2.05047 9.85733L3.81575 17.0584C3.89523 17.3827 4.18964 17.6111 4.52808 17.6111H19.4719C19.8104 17.6111 20.1048 17.3827 20.1843 17.0584L21.9495 9.85733C22.3022 8.41887 20.737 7.26304 19.4352 8.00058L16.8368 9.47274L13.4374 4.27252ZM12.2053 5.05483C12.1092 4.90768 11.8908 4.90768 11.7947 5.05482L8.01794 10.8322C7.80654 11.1556 7.37505 11.2589 7.03666 11.0672L3.83432 9.25286C3.64835 9.1475 3.42475 9.31262 3.47513 9.51811L5.10494 16.1666H18.8951L20.5249 9.51811C20.5752 9.31262 20.3517 9.1475 20.1657 9.25286L16.9633 11.0672C16.6249 11.2589 16.1935 11.1556 15.9821 10.8322L12.2053 5.05483Z"
        fill="currentColor"
      />
      <path
        d="M5.15861 19.0547C4.75388 19.0547 4.42578 19.3781 4.42578 19.777C4.42578 20.1758 4.75388 20.4992 5.15861 20.4992H18.838C19.2427 20.4992 19.5708 20.1758 19.5708 19.777C19.5708 19.3781 19.2427 19.0547 18.838 19.0547H5.15861Z"
        fill="currentColor"
      />
    </svg>
  );
};

// ─── Locked (free) teaser ─────────────────────────────────────────────────────
// Free users see the real Pro UI — metric tabs + the live Recharts area chart —
// built from demo data, then blurred with an upgrade overlay on top. No image
// asset is used, so the preview stays crisp at any screen size.
var DEMO_COUNTERS = {
  visitors: { count: 120, change: 12 },
  unique: { count: 80, change: 8 },
  actions: { count: 79, change: -3 },
  applied: { count: 20, change: 25 },
  pending: { count: 10, change: null },
};
var DEMO_ACTIVE = new Set(['visitors', 'unique', 'actions', 'pending']);
var DEMO_CATEGORIES = [
  '12 Jan',
  '13 Jan',
  '14 Jan',
  '15 Jan',
  '16 Jan',
  '17 Jan',
  '18 Jan',
];
var DEMO_CHART = [
  { name: 'Visitors', data: [6, 5, 8, 7, 11, 12, 18] },
  { name: 'Unique Visitors', data: [3, 4, 9, 6, 13, 7, 13] },
  { name: 'Performed Actions', data: [6, 8, 10, 7, 9, 13, 18] },
  { name: 'Candidates Applied', data: [2, 3, 5, 4, 6, 5, 8] },
  { name: 'Candidates Pending', data: [1, 2, 4, 1, 6, 4, 7] },
];

var AnalyticsLocked = function () {
  return (
    <div className="analytics__demo">
      <div className="analytics__demo-preview" aria-hidden="true">
        <div className="ej-metric-tabs">
          {METRIC_TABS.map(function (tab) {
            var d = DEMO_COUNTERS[tab.key];
            var change = d.change;
            var isOn = DEMO_ACTIVE.has(tab.key);
            return (
              <div
                key={tab.key}
                className={'ej-mtab' + (isOn ? ' on' : '')}
                style={{ '--c': tab.color }}
              >
                <span className="ej-mtab-lbl">
                  <i />
                  {tab.label}
                </span>
                <span className="ej-mtab-v tnum">{d.count}</span>
                {change !== null && (
                  <span
                    className={
                      'ej-mtab-chg ' +
                      (change > 0 ? 'up' : change < 0 ? 'down' : 'flat')
                    }
                  >
                    {change > 0 ? '▲ ' : change < 0 ? '▼ ' : ''}
                    {change !== 0
                      ? Math.abs(change) + '% vs prev'
                      : 'no change'}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <AnalyticsChart
          chartData={DEMO_CHART}
          categories={DEMO_CATEGORIES}
          activeMetrics={DEMO_ACTIVE}
        />
      </div>

      <div className="analytics__demo-lock">
        <span className="analytics__demo-lock-badge">
          <CrownIcon />
        </span>
        <div className="analytics__demo-lock-title">
          {__('Unlock Analytics', 'easyjobs')}
        </div>
        <div className="analytics__demo-lock-sub">
          {__(
            'Track visitors, applications and hiring trends in real time.',
            'easyjobs',
          )}
        </div>
        <a
          href={PRO_URL}
          target="_blank"
          rel="noreferrer"
          className="ej-pro-btn"
        >
          <CrownIcon />
          {__('Get PRO to unlock', 'easyjobs')}
        </a>
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
var AnalyticsSkeleton = function () {
  return (
    <section className="ej-section">
      <div className="ej-surface">
        {/* header */}
        <div className="ej-an-head">
          <span className="ej-skel" style={{ width: 90, height: 16 }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {['7D', '10D', '30D', '6M', '1Y'].map(function (l) {
              return (
                <span
                  key={l}
                  className="ej-skel"
                  style={{ width: 36, height: 30, borderRadius: 7 }}
                />
              );
            })}
          </div>
        </div>

        {/* metric tab skeletons */}
        <div className="ej-metric-tabs">
          {METRIC_TABS.map(function (tab) {
            return (
              <div
                key={tab.key}
                className="ej-mtab"
                style={{ borderTopColor: 'transparent' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    className="ej-skel ej-skel-circle"
                    style={{ width: 8, height: 8 }}
                  />
                  <span className="ej-skel" style={{ width: 72, height: 11 }} />
                </div>
                <span
                  className="ej-skel"
                  style={{ width: 48, height: 26, marginTop: 6 }}
                />
                <span
                  className="ej-skel"
                  style={{ width: 80, height: 11, marginTop: 4 }}
                />
              </div>
            );
          })}
        </div>

        {/* chart skeleton */}
        <div className="ej-chart-wrap ej-chart-sk">
          <div className="ej-chart-sk-grid">
            {[0, 1, 2, 3].map(function (i) {
              return <div key={i} className="ej-chart-sk-line" />;
            })}
          </div>
          <div className="ej-chart-sk-areas">
            <span
              className="ej-skel"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 8,
                opacity: 0.6,
              }}
            />
          </div>
        </div>

        <div className="ej-an-foot">
          <span className="ej-skel" style={{ width: 260, height: 11 }} />
        </div>
      </div>
    </section>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function Analytics(props) {
  var getAnalyticsInfo = props.getAnalyticsInfo;
  var analyticsInfo = props.analyticsInfo;
  var loadingAnalytics = props.loadingAnalytics;
  var companyInfo = props.companyInfo;

  var _rangeIndex = useState(0);
  var rangeIndex = _rangeIndex[0];
  var setRangeIndex = _rangeIndex[1];

  var _activeMetrics = useState(new Set(['visitors', 'actions']));
  var activeMetrics = _activeMetrics[0];
  var setActiveMetrics = _activeMetrics[1];

  var isPro =
    companyInfo &&
    companyInfo.package_rules &&
    companyInfo.package_rules.analytics == 1;

  useEffect(
    function () {
      if (isPro) {
        getAnalyticsInfo(RANGE_OPTIONS[rangeIndex].params);
      }
    },
    [rangeIndex, isPro],
  );

  var toggleMetric = function (key) {
    setActiveMetrics(function (prev) {
      var next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  var getEntry = function (tab) {
    if (!analyticsInfo || !analyticsInfo.counter_data) return null;
    return (
      analyticsInfo.counter_data.find(function (c) {
        return (
          c.label && c.label.toLowerCase() === tab.seriesName.toLowerCase()
        );
      }) || null
    );
  };

  var getCount = function (tab) {
    var entry = getEntry(tab);
    return entry ? entry.count : '—';
  };

  // Try common field names for percentage change
  var getChange = function (tab) {
    var entry = getEntry(tab);
    if (!entry) return null;
    var pct =
      entry.change !== undefined
        ? entry.change
        : entry.percent_change !== undefined
        ? entry.percent_change
        : entry.percentage_change !== undefined
        ? entry.percentage_change
        : entry.diff !== undefined
        ? entry.diff
        : null;
    if (pct === null) return null;
    return Number(pct);
  };

  var dateRangeLabel = (function () {
    if (analyticsInfo && analyticsInfo.date_range)
      return analyticsInfo.date_range;
    if (
      analyticsInfo &&
      analyticsInfo.categories &&
      analyticsInfo.categories.length
    ) {
      var cats = analyticsInfo.categories;
      return cats[0] + ' – ' + cats[cats.length - 1];
    }
    return '';
  })();

  if (loadingAnalytics) return React.createElement(AnalyticsSkeleton, null);

  return (
    <section className="ej-section">
      <div className="ej-surface">
        <div className="ej-an-head">
          <h2>{__('Analytics', 'easyjobs')}</h2>
          <div className={'ej-seg' + (isPro ? '' : ' is-decorative')}>
            {RANGE_OPTIONS.map(function (opt, i) {
              var active = isPro ? i === rangeIndex : i === 0;
              return (
                <button
                  key={opt.label}
                  type="button"
                  className={active ? 'active' : ''}
                  onClick={
                    isPro
                      ? function () {
                          setRangeIndex(i);
                        }
                      : undefined
                  }
                  tabIndex={isPro ? 0 : -1}
                  aria-hidden={isPro ? undefined : 'true'}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {!isPro ? (
          <AnalyticsLocked />
        ) : analyticsInfo ? (
          <>
            <div className="ej-metric-tabs">
              {METRIC_TABS.map(function (tab) {
                var isOn = activeMetrics.has(tab.key);
                var change = getChange(tab);
                return (
                  <button
                    key={tab.key}
                    className={'ej-mtab' + (isOn ? ' on' : '')}
                    style={{ '--c': tab.color }}
                    onClick={function () {
                      toggleMetric(tab.key);
                    }}
                  >
                    <span className="ej-mtab-lbl">
                      <i />
                      {tab.label}
                    </span>
                    <span className="ej-mtab-v tnum">{getCount(tab)}</span>
                    {change !== null && (
                      <span
                        className={
                          'ej-mtab-chg ' +
                          (change > 0 ? 'up' : change < 0 ? 'down' : 'flat')
                        }
                      >
                        {change > 0 ? '▲' : change < 0 ? '▼' : ''}
                        {change !== 0
                          ? Math.abs(change) + '% vs prev'
                          : 'no change'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <AnalyticsChart
              chartData={analyticsInfo.chart_data}
              categories={analyticsInfo.categories}
              activeMetrics={activeMetrics}
            />

            {dateRangeLabel && (
              <div className="ej-an-foot">
                {__(
                  'Click a metric above to toggle it on the chart',
                  'easyjobs',
                )}
                {' · '}
                {dateRangeLabel}
              </div>
            )}
          </>
        ) : (
          <h4 className="empty-message" style={{ backgroundColor: '#f5f7fa' }}>
            {__('No Analytics Data.', 'easyjobs')}
          </h4>
        )}
      </div>
    </section>
  );
}
