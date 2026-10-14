import React, { useEffect, useState } from 'react';
const AITab = ({
  currentTab,
  loading,
  getAiSetup,
  aiSetup,
  updateAiSetup,
  aiEnabled,
  getMinimalCompanyInfo,
  companyInfo,
}) => {
  const { __ } = wp.i18n;
  const [showAiSetup, setShowAiSetup] = useState(undefined);

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    !companyInfo && getMinimalCompanyInfo();
    getAiSetup();
  }, []);

  useEffect(() => {
    if (typeof companyInfo !== 'undefined') {
      if (companyInfo.is_pro && companyInfo.subscription_expired) {
        setShowAiSetup(false);
      } else {
        setShowAiSetup(companyInfo.is_pro);
      }
    }
  }, [companyInfo]);

  useEffect(() => {
    if (typeof aiEnabled !== 'undefined') {
      if (aiEnabled === true || aiEnabled === '1' || aiEnabled === 1) {
        setEnabled(true);
      } else {
        setEnabled(false);
      }
    }
  }, [aiEnabled]);

  useEffect(() => {
    if (aiSetup) {
      if (
        aiSetup.ai_setup_enabled === true ||
        aiSetup.ai_setup_enabled === '1' ||
        aiSetup.ai_setup_enabled === 1
      ) {
        setEnabled(true);
      } else {
        setEnabled(false);
      }
    }
  }, [aiSetup]);

  const getContent = () => {
    if (typeof showAiSetup === 'undefined') {
      return '';
    }
    if (showAiSetup) {
      return (
        <div className="ai-releated-settings">
          <div>
            <label>{__('Show AI Score', 'easyjobs')}</label>
            <div className="selection-box mt-3">
              <input
                type="checkbox"
                value="true"
                id="ai-enabled"
                className="notify"
                checked={enabled}
                onChange={(e) => {
                  updateAiSetup({
                    is_ai_enabled: e.target.checked,
                  });
                }}
                name="is_ai_enabled"
              />
              <label htmlFor="ai-enabled" className="power-by__remove">
                <span>{(enabled && 'On') || 'Off'}</span>
              </label>
            </div>
          </div>
          {enabled && (
            <div className="mt-3">
              <label>
                {__('Run batch process for old candidates', 'easyjobs')}
              </label>
              <div className="mt-3">
                <button
                  className="button info-button"
                  onClick={(e) => {
                    e.preventDefault();
                    updateAiSetup({
                      is_ai_enabled: enabled,
                      run_batch_score: true,
                    });
                  }}
                >
                  {__('Run process', 'easyjobs')}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <div>
        <div className="alert alert-warning m-0 ej-upgrade-notice d-flex align-items-center">
          <i className="dashicons dashicons-warning"></i>
          {(companyInfo && companyInfo.subscription_expired && (
            <div>
              <strong>Subscription Expired</strong>
              <span>
                Please{' '}
                <a
                  href={easyJobsJs.easyjobs_app_url + '/my-account'}
                  target="_blank"
                >
                  Update subscription
                </a>{' '}
                for AI Setup functionality and many exciting features
              </span>
            </div>
          )) || (
            <div>
              <strong>Upgrade Account</strong>
              <span>
                Please{' '}
                <a
                  href={easyJobsJs.easyjobs_app_url + '/my-account'}
                  target="_blank"
                >
                  Upgrade to pro
                </a>{' '}
                for AI Setup functionality and many exciting features
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`settings-content settings-tab ${
        currentTab === 'ai-setup' ? 'active' : ''
      } ${loading ? 'ej-loading' : ''}`}
    >
      <div className="section-title-wrap mb-0 d-flex justify-content-between align-items-start">
        <div className="section-title margin-deliver">AI Setup</div>
      </div>
      <div className="form-box">{getContent()}</div>
    </div>
  );
};

export default AITab;
