import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import { validateFormFields } from '../../util/helper';

const SignIn = ({ setLoginOption, signIn }) => {
  const [info, setInfo] = useState({
    email: '',
    password: '',
  });
  const [signInErrors, setSignInErrors] = useState({
    email: '',
    password: '',
  });

  const handleSignIn = (e) => {
    e.preventDefault();
    const isValid = validateFormFields(info, {
      email: {
        required: {
          value: true,
          message: 'Email is required',
        },
        email: {
          value: true,
          message: 'Email must be a valid email',
        },
      },
      password: {
        required: {
          value: true,
          message: 'Password is required',
        },
      },
    });
    if (!isValid.valid) {
      setSignInErrors(isValid.errors);
    } else {
      setSignInErrors({
        email: '',
        password: '',
      });
      signIn(info);
    }
  };

  return (
    <>
      <button className="alt__login" onClick={(e) => setLoginOption('api-key')}>
        Connect via API
      </button>
      <form className="ej-login-form" onSubmit={handleSignIn}>
        <div className="form-group">
          <label>{__('Email Address', 'easyjobs')}</label>
          <input
            className={`form-control ${
              signInErrors && signInErrors.email ? 'has-error' : ''
            }`}
            type="text"
            placeholder="youremail@gmail.com"
            name="email"
            onChange={(e) => setInfo({ ...info, email: e.target.value })}
            value={info.email}
          />
          {(signInErrors && signInErrors.email && (
            <div className={'error-message'}>{signInErrors.email}</div>
          )) ||
            ''}
        </div>
        <div className="form-group">
          <label>{__('Password', 'easyjobs')} </label>
          <input
            className={`form-control ${
              signInErrors && signInErrors.password ? 'has-error' : ''
            }`}
            type="password"
            placeholder="************"
            name="password"
            onChange={(e) => setInfo({ ...info, password: e.target.value })}
            value={info.password}
          />
          {(signInErrors && signInErrors.password && (
            <div className={'error-message'}>{signInErrors.password}</div>
          )) ||
            ''}
        </div>
        <button className="button info-button btn-block" type="submit">
          {__('Sign In', 'easyjobs')}
        </button>
      </form>
    </>
  );
};

export default SignIn;
