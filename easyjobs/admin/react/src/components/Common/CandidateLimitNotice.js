import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';

// Full-width candidate-quota banner shown when usage crosses 80% / 90% / 100%.
//
// Escalating logic (mirrors the app):
//   >= 100 : critical — always shown, not dismissible
//   91–99  : danger   — dismissible, re-shows after 7 days (level "90")
//   81–90  : warning  — dismissible, re-shows after 7 days (level "80")
//   < 81   : hidden
//
// Dismissals are remembered in localStorage per level so dismissing the 80%
// notice does not hide the later 90% escalation. Extracted from the Dashboard so
// the Candidates list (and any other screen) renders an identical banner and the
// two can't drift apart again.
const CandidateLimitNotice = ({ candidateLimit }) => {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const dismissedAt = localStorage.getItem('candidateLimitDismissedAt');
    const dismissedLevel = localStorage.getItem('candidateLimitDismissedLevel');

    if (candidateLimit?.percentage >= 100) {
      setShowNotice(true);
      return;
    }

    if (candidateLimit?.percentage < 81) {
      setShowNotice(false);
      return;
    }

    if (dismissedAt && dismissedLevel) {
      const diff = now - parseInt(dismissedAt);

      if (diff < 7 * 24 * 60 * 60 * 1000) {
        if (
          (dismissedLevel === '80' &&
            candidateLimit?.percentage > 80 &&
            candidateLimit?.percentage < 91) ||
          (dismissedLevel === '90' &&
            candidateLimit?.percentage >= 91 &&
            candidateLimit?.percentage < 100)
        ) {
          setShowNotice(false);
          return;
        }
      }
    }

    setShowNotice(true);
  }, [candidateLimit]);

  if (!candidateLimit || !showNotice) {
    return null;
  }

  let noticeMessage = '';
  if (candidateLimit?.percentage >= 100) {
    noticeMessage =
      'Your plan has reached its candidate limit. Upgrade today to keep receiving applications without interruption.';
  } else if (
    candidateLimit?.percentage > 90 &&
    candidateLimit?.percentage < 100
  ) {
    noticeMessage =
      "You've used more than 90% of your candidate limit—upgrade immediately to avoid missing applications.";
  } else if (
    candidateLimit?.percentage > 80 &&
    candidateLimit?.percentage < 91
  ) {
    noticeMessage =
      "You've used more than 80% of your candidate limit—upgrade now to keep receiving applications without interruption.";
  }

  const handleNoticeDismiss = () => {
    setShowNotice(false);
    let dismissedAt = Date.now();
    let dismissedLevel = '';

    if (candidateLimit?.percentage > 80 && candidateLimit?.percentage < 91) {
      dismissedLevel = '80';
    } else if (
      candidateLimit?.percentage >= 91 &&
      candidateLimit?.percentage < 100
    ) {
      dismissedLevel = '90';
    }

    localStorage.setItem('candidateLimitDismissedAt', dismissedAt);
    localStorage.setItem('candidateLimitDismissedLevel', dismissedLevel);
  };

  return (
    <div
      className={`ejv2-notice ${
        candidateLimit?.percentage >= 90
          ? 'ejv2-notice--error'
          : 'ejv2-notice--warning'
      }`}
    >
      <span aria-hidden="true" className="ejv2-notice__icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M12 7v6M12 16.5v.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <p className="ejv2-notice__body">{noticeMessage}</p>
      <a
        href={easyJobsJs.admin_url + '?page=easyjobs-settings&tab=subscription'}
        className="ejv2-notice__cta ejv2-notice__cta--primary ejv2-notice__cta--primary-red"
      >
        {__('Upgrade Now', 'easyjobs')}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
      {candidateLimit?.percentage < 100 && (
        <button
          type="button"
          className="ejv2-notice__dismiss"
          aria-label={__('Dismiss', 'easyjobs')}
          onClick={handleNoticeDismiss}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CandidateLimitNotice;
