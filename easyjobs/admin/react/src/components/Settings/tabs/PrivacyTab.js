import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ajaxCall } from '../../../util/ajaxCall';

/**
 * Settings → Privacy.
 *
 * Holds local (WordPress-side) privacy choices. Visitor analytics is off by
 * default: when it is off, the career pages load no tracking script and the
 * site URL is not registered with easy.jobs analytics.
 *
 * The text under the switch is the core disclosure and stays visible; the
 * full list of what is sent sits in an expandable section.
 */
const SHARED_DATA = [
  {
    term: 'Where it runs',
    value: (
      <>
        Job pages created with the <code>[easyjobs_list]</code> and{' '}
        <code>[easyjobs_details]</code> shortcodes
      </>
    ),
  },
  {
    term: 'Script source',
    value: (
      <>
        A Matomo script from <code>analytics.easy.jobs</code>
      </>
    ),
  },
  {
    term: 'Data sent',
    value:
      "Page views, link clicks, the visitor's IP address and browser details",
  },
  {
    term: 'Also',
    value: 'Your site URL is registered with easy.jobs analytics',
  },
  { term: 'Default', value: 'Off by default' },
];

const ExternalIcon = () => (
  <svg
    className="ej-privacy-ext"
    viewBox="0 0 16 16"
    width="12"
    height="12"
    aria-hidden="true"
  >
    <path
      d="M9 2h5v5M14 2 7.5 8.5M12 9.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PrivacyTab = ({ currentTab }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visitorAnalytics, setVisitorAnalytics] = useState(false);
  const [policyGuideUrl, setPolicyGuideUrl] = useState('');

  useEffect(() => {
    let active = true;
    ajaxCall('easyjobs_get_privacy_settings').then((response) => {
      if (!active) return;
      if (response?.status === 'success') {
        setVisitorAnalytics(!!response.data?.visitor_analytics);
        setPolicyGuideUrl(response.data?.policy_guide_url || '');
      } else {
        toast.error(response?.message || 'Unable to load privacy settings');
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const onToggle = (e) => {
    const enabled = e.target.checked;
    const previous = visitorAnalytics;
    setVisitorAnalytics(enabled);
    setSaving(true);
    ajaxCall('easyjobs_save_privacy_settings', {
      visitor_analytics: enabled ? 'yes' : 'no',
    }).then((response) => {
      setSaving(false);
      if (response?.status === 'success') {
        setVisitorAnalytics(!!response.data?.visitor_analytics);
        toast.success(response.message || 'Privacy settings saved');
      } else {
        // The server returns the stored settings when the option was saved but
        // the site could not be registered; otherwise roll the toggle back.
        setVisitorAnalytics(
          typeof response?.data?.visitor_analytics === 'boolean'
            ? response.data.visitor_analytics
            : previous,
        );
        toast.error(response?.message || 'Unable to save privacy settings');
      }
    });
  };

  return (
    <div
      className={`settings-content settings-tab ${
        currentTab === 'privacy' ? 'active' : ''
      } ${loading || saving ? 'ej-loading' : ''}`}
      data-testid="ej-settings-privacy"
    >
      <div className="section-title-wrap mb-0 d-flex justify-content-between align-items-start">
        <div className="section-title margin-deliver">Privacy</div>
      </div>
      <div className="form-box">
        {/* `ai-releated-settings` reuses the AI Setup tab's label and switch styles. */}
        <div className="ai-releated-settings ej-privacy-settings">
          <label htmlFor="ej-visitor-analytics">
            Enable visitor analytics on career pages
          </label>
          <div className="selection-box mt-3">
            <input
              type="checkbox"
              role="switch"
              id="ej-visitor-analytics"
              className="notify"
              checked={visitorAnalytics}
              disabled={loading || saving}
              onChange={onToggle}
              aria-describedby="ej-visitor-analytics-notice"
              data-testid="ej-visitor-analytics-toggle"
            />
            <label htmlFor="ej-visitor-analytics" className="power-by__remove">
              <span aria-hidden="true">{visitorAnalytics ? 'On' : 'Off'}</span>
            </label>
          </div>

          <p
            id="ej-visitor-analytics-notice"
            className="ej-privacy-help mt-3"
            data-testid="ej-privacy-notice"
          >
            {visitorAnalytics
              ? "Analytics is on. Visitors' IP address and browser details are sent to easy.jobs, so mention this in your privacy policy."
              : "Track job-page views and clicks in your easy.jobs dashboard. Visitors' IP address and browser details are sent to easy.jobs, so you may need their consent."}
          </p>

          <details className="ej-privacy-details mt-3">
            <summary>What data is shared?</summary>
            <dl>
              {SHARED_DATA.map(({ term, value }) => (
                <div key={term} className="ej-privacy-details__row">
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </details>

          <p className="ej-privacy-help ej-privacy-links mt-3">
            <a
              href="https://easy.jobs/privacy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              easy.jobs Privacy Policy
              <ExternalIcon />
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://easy.jobs/terms/"
              target="_blank"
              rel="noopener noreferrer"
            >
              easy.jobs Terms of Service
              <ExternalIcon />
            </a>
            {policyGuideUrl && (
              <>
                <span aria-hidden="true">·</span>
                <a
                  href={policyGuideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WordPress Privacy Policy Guide
                  <ExternalIcon />
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyTab;
