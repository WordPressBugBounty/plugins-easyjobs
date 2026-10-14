import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';

const ApiKey = ({ setLoginOption, connectApiKey }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey) {
      connectApiKey(apiKey);
    }
  };

  return (
    <>
      <button className="alt__login" onClick={(e) => setLoginOption('sign-in')}>
        Connect via Login Credentials
      </button>
      <form className="ej-connect-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{__('API Key', 'easyjobs')}</label>
          <input
            type="text"
            name="easyjobs_api_key"
            data-testid="ej-landing-api-key"
            className="form-control"
            placeholder={__('Enter your API key', 'easyjobs')}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <a
            href="https://easy.jobs/docs/easyjobs-wordpress/"
            className="get__api"
            target={'_blank'}
          >
            Get API Key
          </a>
        </div>
        <button
          className="button info-button btn-block ej-connect-form-btn"
          type="submit"
        >
          {' '}
          Connect{' '}
        </button>
      </form>
    </>
  );
};

export default ApiKey;
