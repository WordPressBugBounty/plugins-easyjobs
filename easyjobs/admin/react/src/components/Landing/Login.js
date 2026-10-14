import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { __ } from '@wordpress/i18n';
import SignIn from './SignIn';
import ApiKey from './ApiKey';
import SelectCompany from './SelectCompany';
import { getImageUrl } from '../../util/helper';
import SignUp from './SignUp';

const Login = ({
  signIn,
  connectApiKey,
  signInData,
  signUp,
  signUpData,
  signUpErrors,
  loading,
}) => {
  const [loginOption, setLoginOption] = useState('sign-in');

  useEffect(() => {
    if (signInData) {
      if (signInData.action && signInData.action === 'select_company') {
        setLoginOption('company-select');
      }
    }
  }, [signInData]);

  return (
    <div className="login-vew">
      <div className="text-center">
        <a href="#" className="site-logo">
          <img src={getImageUrl('logo.png')} alt="" />
        </a>
      </div>
      <div className="section-gap">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="shape__wrap">
                <div className="shapes">
                  <img
                    src={getImageUrl('circle.png')}
                    className="shape-circle"
                  />
                  <img src={getImageUrl('dots.png')} className="shape-dots" />
                  <img
                    src={getImageUrl('triangle.png')}
                    className="shape-triangle"
                  />
                </div>
                <div className="account__wrap">
                  <ul className="nav nav-tabs landing-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link active"
                        id="signin-tab"
                        data-toggle="tab"
                        href="#signin"
                        role="tab"
                        aria-controls="signin"
                        aria-selected="true"
                      >
                        {__('Sign In', 'easyjobs')}
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link"
                        id="signup-tab"
                        data-toggle="tab"
                        href="#signup"
                        role="tab"
                        aria-controls="signup"
                        aria-selected="false"
                      >
                        {__('Sign Up', 'easyjobs')}
                      </a>
                    </li>
                  </ul>
                  <div
                    className={`tab-content landing-tab-content ${
                      loading ? 'ej-loading' : ''
                    }`}
                    id="accountTabContent"
                  >
                    <div
                      className="tab-pane fade show active"
                      id="signin"
                      role="tabpanel"
                      aria-labelledby="signin-tab"
                    >
                      <div className="account__form connect-option">
                        {(loginOption === 'sign-in' && (
                          <SignIn
                            setLoginOption={setLoginOption}
                            signIn={signIn}
                          />
                        )) ||
                          (loginOption === 'api-key' && (
                            <ApiKey
                              setLoginOption={setLoginOption}
                              connectApiKey={connectApiKey}
                            />
                          )) ||
                          (loginOption === 'company-select' && (
                            <SelectCompany
                              signInData={signInData}
                              connectApiKey={connectApiKey}
                            />
                          ))}
                        <div className="d-flex justify-content-between mt-4">
                          <p className="another__account">
                            New here?{' '}
                            <a
                              href="#"
                              className="create-account-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('signup-tab').click();
                              }}
                            >
                              Create an account!
                            </a>
                          </p>
                          <a
                            href="https://app.easy.jobs/forgot-password"
                            target="_blank"
                            className="forget-button"
                          >
                            {__('Forgot Password?', 'easyjobs')}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="signup"
                      role="tabpanel"
                      aria-labelledby="signup-tab"
                    >
                      <SignUp signUp={signUp} signUpErrors={signUpErrors} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
