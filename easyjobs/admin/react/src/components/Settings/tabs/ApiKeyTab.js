import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
const ApiKeyTab = ({
  currentTab,
  getApiKey,
  apiKey,
  updateApiKey,
  loading,
  apiKeyError,
  disconnectApi,
  apiDisconnected,
}) => {
  const { __ } = wp.i18n;
  const [apiKeyField, setApiKeyField] = useState('');
  const [showField, setShowField] = useState(false);
  useEffect(() => {
    getApiKey();
  }, []);

  useEffect(() => {
    if (typeof apiDisconnected !== 'undefined') {
      if (apiDisconnected) {
        toast.success(__('Api disconnected successfully.', 'easyjobs'));
        setTimeout(
          () => (window.location.href = easyJobsJs.easyjobs_admin_url),
          1200,
        );
      } else {
        toast.error(__('Api disconnect failed, please try again.', 'easyjobs'));
      }
    }
  }, [apiDisconnected]);

  useEffect(() => {
    if (typeof apiKeyError !== 'undefined') {
      if (apiKeyError) {
        apiKeyError && toast.error(apiKeyError);
      } else {
        toast.success(__('Api key saved successfully.', 'easyjobs'));
      }
    }
  }, [apiKeyError]);

  /*useEffect(() => {
    if (apiKey) {
      setApiKeyView(apiKey.slice(4) + '*'.repeat(apiKey.length - 9) + apiKey.slice(-5));
    }
  }, [apiKey]);*/

  const connectNewApiKey = (e) => {
    e.preventDefault();
    updateApiKey(apiKeyField);
  };
  const disconnectApiKey = (e) => {
    e.preventDefault();
    disconnectApi();
  };

  const showApiKeyField = (e) => {
    e.preventDefault();
    setShowField(true);
  };
  const hideApiKeyField = (e) => {
    e.preventDefault();
    setShowField(false);
  };

  const maskApiKey = (string) =>
    string.slice(0, 4) + '*'.repeat(string.length - 9) + string.slice(-5);

  return (
    <div
      className={`settings-tab ${currentTab === 'api-key' ? 'active' : ''} ${
        loading ? 'ej-loading' : ''
      }`}
    >
      <div className="section-title-wrap margin-deliver">
        <div className="section-title">{__('API Key Setup', 'easyjobs')}</div>
      </div>
      <form onSubmit={connectNewApiKey}>
        <div className="form-box">
          <div className="row">
            <div className="col">
              <div className="form-group mb-0">
                <label htmlFor="Category">{__('API key', 'easyjobs')}</label>
                {!showField && (
                  <div className="api-key-view d-flex align-items-center">
                    {apiKey && (
                      <div className={'api-key'}>{maskApiKey(apiKey)}</div>
                    )}

                    <div className="ej-tooltip-wrapper">
                      <button
                        type={'button'}
                        className={'btn btn-sm info-button ej-tooltip-item'}
                        onClick={showApiKeyField}
                      >
                        <i className={'easyjobs-icon easyjobs-pencil'}></i>
                      </button>
                      <span className={'ej-tooltip-text'}>
                        {__('Change API key', 'easyjobs')}
                      </span>
                    </div>
                  </div>
                )}
                {showField && (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter new API key"
                    onChange={(e) => setApiKeyField(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
          {!showField && (
            <button
              className="button danger-button mt-4"
              onClick={disconnectApiKey}
            >
              {__('Disconnect', 'easyjobs')}
            </button>
          )}

          {showField && (
            <div className={'d-flex justify-content-between'}>
              <button className="button info-button mt-4" type="submit">
                {__('Update API key', 'easyjobs')}
              </button>
              <button
                className="button warning-button mt-4"
                type="button"
                onClick={hideApiKeyField}
              >
                {__('Cancel', 'easyjobs')}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ApiKeyTab;
