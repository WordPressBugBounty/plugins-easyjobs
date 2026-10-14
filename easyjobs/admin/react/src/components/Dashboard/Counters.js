import React, { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import LinkTag from '../../util/Link';
import Icon from '../../util/Icon';

var STAT_CONFIGS = [
  {
    key: 'active_candidates',
    label: __('Active Candidates', 'easyjobs'),
    icon: 'i-users',
    linkTo: 'easyjobs-candidates',
    isExternal: false,
    subtext: __('Total in your pipeline', 'easyjobs'),
  },
  {
    key: 'published_jobs',
    label: __('Active Jobs', 'easyjobs'),
    icon: 'i-brief',
    linkTo: 'easyjobs-jobs',
    isExternal: false,
    subtext: __('Accepting applications', 'easyjobs'),
  },
  {
    key: 'draft_jobs',
    label: __('Draft Jobs', 'easyjobs'),
    icon: 'i-file',
    linkTo: 'easyjobs-jobs&tab=draft-jobs',
    isExternal: false,
    subtext: __('Not yet published', 'easyjobs'),
  },
  {
    key: 'managers',
    label: __('Team Members', 'easyjobs'),
    icon: 'i-users',
    linkTo: '/company/setting/basic/user',
    isExternal: true,
    subtext: __('In your workspace', 'easyjobs'),
  },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
// Mirrors the stat-card layout (icon → number → label → subtext) so the grid
// doesn't shift when the real counts arrive. Shown until companyStats loads.
var CountersSkeleton = function () {
  return (
    <section className="ej-section">
      <div className="ej-stats">
        {STAT_CONFIGS.map(function (config) {
          return (
            <div key={config.key} className="ej-stat">
              <div className="ej-stat-top">
                <span
                  className="ej-skel"
                  style={{ width: 22, height: 22, borderRadius: 6 }}
                />
              </div>
              <span
                className="ej-skel"
                style={{
                  display: 'block',
                  width: 64,
                  height: 30,
                  borderRadius: 6,
                  marginTop: 14,
                }}
              />
              <span
                className="ej-skel"
                style={{
                  display: 'block',
                  width: 96,
                  height: 11,
                  borderRadius: 4,
                  marginTop: 9,
                }}
              />
              <span
                className="ej-skel"
                style={{
                  display: 'block',
                  width: 124,
                  height: 11,
                  borderRadius: 4,
                  marginTop: 11,
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

var StatCardInner = function (props) {
  var config = props.config;
  var value = props.value;
  return (
    <div className="ej-stat">
      <div className="ej-stat-top">
        <span className="ej-stat-ic">
          <Icon id={config.icon} size={18} />
        </span>
      </div>
      <div className="ej-stat-num tnum">
        {value !== undefined && value !== null
          ? Number(value).toLocaleString()
          : '—'}
      </div>
      <div className="ej-stat-lbl">{config.label}</div>
      {config.subtext && <div className="ej-stat-trend">{config.subtext}</div>}
    </div>
  );
};

var Counters = function (props) {
  var getCompanyStats = props.getCompanyStats;
  var companyStats = props.companyStats;

  useEffect(function () {
    getCompanyStats();
  }, []);

  // No counts yet → show the loading skeleton instead of bare "—" placeholders.
  if (!companyStats) return React.createElement(CountersSkeleton, null);

  return (
    <section className="ej-section">
      <div className="ej-stats">
        {STAT_CONFIGS.map(function (config) {
          var value = companyStats ? companyStats[config.key] : undefined;
          if (config.isExternal) {
            var externalHref =
              (easyJobsJs.easyjobs_app_url || 'https://app.easy.jobs') +
              config.linkTo;
            return (
              <a
                key={config.key}
                href={externalHref}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <StatCardInner config={config} value={value} />
              </a>
            );
          }
          return (
            <LinkTag
              key={config.key}
              to={config.linkTo}
              style={{ textDecoration: 'none' }}
            >
              <StatCardInner config={config} value={value} />
            </LinkTag>
          );
        })}
      </div>
    </section>
  );
};

export default Counters;
