import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-toastify';
import { Icon } from './icons';
import { safeUrl } from '../../Messages/sanitize';

const SOC_ICON = (type = '') => {
  const t = type.toLowerCase();
  if (t.includes('linked')) return 'linkedin';
  if (t.includes('face') || t === 'fb') return 'fb';
  if (t.includes('twit') || t === 'x') return 'x';
  return 'globe';
};

/**
 * Right column — Candidate Details. Icon + label/value rows (matches the app),
 * with an info badge + copy button on the Government ID row.
 */
const DetailsCard = ({ candidateDetails }) => {
  const candidate = candidateDetails?.candidate || {};
  const user = candidate?.user || {};
  const socials = user?.social_profiles || [];

  const [copiedKey, setCopiedKey] = useState(null);

  const copyValue = async (value, key) => {
    if (!value) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(String(value));
      } else {
        const ta = document.createElement('textarea');
        ta.value = String(value);
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopiedKey(key);
      toast.success(__('Copied', 'easyjobs'), { autoClose: 1000 });
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (e) {
      toast.error(__('Could not copy', 'easyjobs'), { autoClose: 1000 });
    }
  };

  const rows = [
    {
      key: 'job',
      icon: 'briefcase-open',
      label: __('Job Title', 'easyjobs'),
      value: candidate?.job_title,
    },
    {
      key: 'dob',
      icon: 'dob',
      label: __('Date of Birth', 'easyjobs'),
      value: user?.dob,
    },
    {
      key: 'gov',
      icon: 'id',
      label: __('Government ID', 'easyjobs'),
      value: user?.identity_number,
      copy: true,
      info: __("National ID/Passport/Driver's license", 'easyjobs'),
    },
    {
      key: 'applied',
      icon: 'cal-num',
      label: __('Date of Application', 'easyjobs'),
      value: candidate?.created_at,
    },
  ].filter((r) => r.value);

  return (
    <section className="ejc-card card-pad">
      <div className="h-row" style={{ marginBottom: '18px' }}>
        <h2 className="card-h">{__('Candidate Details', 'easyjobs')}</h2>
      </div>
      <div className="dl">
        {rows.map((r) => (
          <div className="dl-row" key={r.key}>
            <span className="dl-ic">
              <Icon name={r.icon} />
            </span>
            <div className="dl-main">
              <span className="dl-label">
                {r.label}
                {r.info ? (
                  <span className="dl-info" aria-label={r.info}>
                    <Icon name="info-fill" />
                    <span className="dl-tip">{r.info}</span>
                  </span>
                ) : null}
              </span>
              <span className="dl-val">
                <span className="dl-val__text">{r.value}</span>
                {r.copy ? (
                  <button
                    type="button"
                    className={`dl-copy ${
                      copiedKey === r.key ? 'is-copied' : ''
                    }`}
                    onClick={() => copyValue(r.value, r.key)}
                    aria-label={__('Copy', 'easyjobs')}
                  >
                    <span className="dl-copy-tip">
                      {copiedKey === r.key
                        ? __('Copied!', 'easyjobs')
                        : r.value}
                    </span>
                    <Icon name={copiedKey === r.key ? 'check' : 'copy'} />
                  </button>
                ) : null}
              </span>
            </div>
          </div>
        ))}
      </div>
      {socials.length > 0 ? (
        <div className="social-block">
          <span className="dl-label">{__('Social', 'easyjobs')}</span>
          <div className="social-icons">
            {socials.map((s, i) => {
              const ic = SOC_ICON(s.type);
              return (
                <a
                  key={i}
                  className={`soc soc--${ic}`}
                  href={safeUrl(s.link)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.type}
                >
                  <Icon name={ic} />
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default DetailsCard;
