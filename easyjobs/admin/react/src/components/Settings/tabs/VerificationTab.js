import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const VerificationTab = ({
  loading,
  currentTab,
  verifyCompany,
  isVerified,
  getVerificationCode,
  verificationCode,
}) => {
  const verifyCompanyDomain = (e) => {
    e.preventDefault();
    verifyCompany(isVerified);
  };

  useEffect(() => {
    getVerificationCode();
  }, []);

  const copyText = (elementId) => {
    const node = document.getElementById(elementId);
    if (document.body.createTextRange) {
      const range = document.body.createTextRange();
      range.moveToElementText(node);
      range.select();
    } else if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    document.execCommand('copy');
    toast.success('Copied', { autoClose: 1000 });
  };

  return (
    <div
      className={`settings-tab ${
        currentTab === 'verification' ? 'active' : ''
      } ${loading ? 'ej-loading' : ''}`}
    >
      <div className="section-title-wrap margin-deliver">
        <div className="section-title">Company verification</div>
      </div>
      <div className="form-box">
        {(!isVerified && (
          <div className="company-verification">
            <h5>Why verify?</h5>
            <p>
              After you verify that you own your domain, you can start using
              your Easy.Jobs service.
            </p>
            <h5>Add a TXT verification record</h5>
            <p>To add a TXT Record, follow these steps:</p>
            <ol className="mt-4 ml-4">
              <li>
                Click on the domain name you wish to create a <b>TXT</b> record
                for.
              </li>
              <li>
                Click <b>Manage DNS</b> Records.
              </li>
              <li>
                Here you will add the desired <b>TXT</b> record.
              </li>
              <li>
                Select <b>TXT</b> from menu.
              </li>
              <li>
                <code>
                  {verificationCode && verificationCode.host_field && (
                    <>
                      <span id={'host'}>{verificationCode.host_field}</span>
                      <span className="ej-tooltip-wrapper">
                        <span
                          className="easyjobs-icon easyjobs-duplicate ej-tooltip-item verification-copy-icon ml-1"
                          onClick={() => copyText('host')}
                        ></span>
                        <span className="ej-tooltip-text">Click to copy</span>
                      </span>
                    </>
                  )}
                </code>
                &nbsp; Enter or copy+paste it in the Host field.
              </li>
              <li>
                <code>
                  {verificationCode && verificationCode.verification_code && (
                    <>
                      <span id={'code'}>
                        {verificationCode.verification_code}
                      </span>
                      <span className="ej-tooltip-wrapper">
                        <span
                          className="easyjobs-icon easyjobs-duplicate ej-tooltip-item verification-copy-icon ml-1"
                          onClick={() => copyText('code')}
                        ></span>
                        <span className="ej-tooltip-text">Click to copy</span>
                      </span>
                    </>
                  )}
                </code>
                &nbsp; Enter or copy+paste the value (string) into the Answer
                field.
              </li>
              <li>Leave TTL as default</li>
              <li>
                Click the <b>Create Record</b> button.
              </li>
            </ol>
            <div className="mt-3">
              <h5>Example: </h5>
              <div className="p-3 border">
                <img
                  src={`${easyJobsJs.plugin_url}admin/assets/img/txt_record.png`}
                  width="100%"
                  alt="TXT Record"
                />
              </div>
            </div>
            <div className="mt-5">
              <button
                type="submit"
                className="button info-button"
                onClick={verifyCompanyDomain}
              >
                Verify Company
              </button>
            </div>
          </div>
        )) || (
          <div className="badge badge-success p-3 verified-badge">
            <i className="dashicons dashicons-yes-alt"></i>
            <span>Your company is verified.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationTab;
