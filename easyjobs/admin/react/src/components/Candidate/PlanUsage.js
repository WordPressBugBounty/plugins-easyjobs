import { __ } from '@wordpress/i18n';
import React from 'react';
import Icon from '../../util/Icon';

// Candidate-quota indicator shown in the page header. Replaces the old
// full-width banner + semicircular gauge. Drives an escalating state
// (healthy / warning / critical) from candidateLimit.percentage and reveals a
// details popover on hover (CSS-driven — see .plan-usage:hover .pu-popover).
const RING_C = 81.68; // 2π·13, matches the SVG ring radius

const PlanUsage = ({ candidateLimit }) => {
  if (!candidateLimit) return null;

  const pct = Math.max(
    0,
    Math.min(100, Math.round(candidateLimit.percentage || 0)),
  );
  const state = pct >= 90 ? 'critical' : pct >= 80 ? 'warning' : 'healthy';
  const offset = (RING_C * (1 - pct / 100)).toFixed(2);

  const used =
    candidateLimit.used != null
      ? candidateLimit.used
      : candidateLimit.total_candidates;
  const total =
    candidateLimit.total != null ? candidateLimit.total : candidateLimit.limit;
  const remaining =
    candidateLimit.remaining != null
      ? candidateLimit.remaining
      : used != null && total != null
      ? total - used
      : null;
  const resetDate =
    candidateLimit.reset_date ||
    candidateLimit.resets_on ||
    candidateLimit.reset_at;
  const hasFraction = used != null && total != null;

  const upgradeUrl =
    easyJobsJs.admin_url + '?page=easyjobs-settings&tab=subscription';

  const fraction = hasFraction ? used + ' / ' + total : pct + '%';

  return (
    <div className="plan-usage" data-state={state}>
      <div
        className="pu-card"
        role="button"
        tabIndex={0}
        aria-label={__('Candidate quota usage', 'easyjobs')}
      >
        <span className="pu-ringwrap">
          <svg className="pu-ring" viewBox="0 0 32 32" aria-hidden="true">
            <circle className="track" cx="16" cy="16" r="13" />
            <circle
              className="fill"
              cx="16"
              cy="16"
              r="13"
              strokeDasharray={RING_C}
              strokeDashoffset={offset}
            />
          </svg>
        </span>
        <span className="pu-pct tnum">{pct}%</span>
        <span className="pu-label">
          <span className="pu-top tnum">
            <span className="pu-cap">{__('Candidates · ', 'easyjobs')}</span>
            <span className="pu-frac">{fraction}</span>
          </span>
        </span>
        <a className="pu-up" href={upgradeUrl}>
          <span>{__('Upgrade', 'easyjobs')}</span>
          <Icon id="i-arr" size={13} />
        </a>
      </div>

      <div className="pu-popover">
        <div className="pu-pop-head">{__('Candidate quota', 'easyjobs')}</div>
        {used != null && (
          <div className="pu-stat">
            <span>{__('Used', 'easyjobs')}</span>
            <b className="tnum">{used}</b>
          </div>
        )}
        {remaining != null && (
          <div className="pu-stat">
            <span>{__('Remaining', 'easyjobs')}</span>
            <b className="tnum">{remaining}</b>
          </div>
        )}
        {resetDate && (
          <div className="pu-stat">
            <span>{__('Resets on', 'easyjobs')}</span>
            <b className="tnum">{resetDate}</b>
          </div>
        )}
        {(used != null || remaining != null || resetDate) && (
          <div className="pu-pop-sep" />
        )}
        {candidateLimit.message && (
          <p className="pu-desc">{candidateLimit.message}</p>
        )}
        <a className="pu-pop-cta" href={upgradeUrl}>
          {__('Upgrade plan', 'easyjobs')} <Icon id="i-arr" size={14} />
        </a>
      </div>
    </div>
  );
};

export default PlanUsage;
