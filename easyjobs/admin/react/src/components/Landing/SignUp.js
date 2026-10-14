import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from 'react';
import { hasFormError, validateFormFields } from '../../util/helper';
import FormErrorMessage from '../../util/FormErrorMessage';

const SignUp = ({ signUp, signUpErrors }) => {
  const [accountInfo, setAccountInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [errors, setErrors] = useState(undefined);

  useEffect(() => {
    if (signUpErrors) {
      setErrors(signUpErrors);
    }
  }, [signUpErrors]);

  const handleInput = (e) => {
    setAccountInfo({
      ...accountInfo,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateFormFields(accountInfo, {
      first_name: {
        required: {
          value: true,
          message: 'The first name field is required',
        },
      },
      last_name: {
        required: {
          value: true,
          message: 'The last name field is required',
        },
      },
      email: {
        required: {
          value: true,
          message: 'The email field is required',
        },
      },
      password: {
        required: {
          value: true,
          message: 'The password field is required',
        },
      },
      password_confirm: {
        required: {
          value: true,
          message: 'The confirm password field is required',
        },
        match: {
          value: 'password',
          message: 'The confirm password field must match with password field',
        },
      },
    });
    if (!isValid.valid) {
      setErrors(isValid.errors);
      return;
    }
    setErrors(undefined);
    signUp(accountInfo);
  };

  return (
    <div className="account__form">
      <form className="ej-signup-form" onSubmit={handleSubmit}>
        <div className="d-flex w-100">
          <div className="pr-2 w-50">
            <div className="form-group">
              <label>{__('First Name', 'easyjobs')} *</label>
              <input
                className={`form-control ${
                  hasFormError('first_name', errors) ? 'has-error' : ''
                }`}
                type="text"
                placeholder="Your First Name"
                name="first_name"
                value={accountInfo.first_name}
                onChange={handleInput}
              />
              <FormErrorMessage field="first_name" errors={errors} />
            </div>
          </div>
          <div className="pl-2 w-50">
            <div className="form-group">
              <label>{__('Last Name', 'easyjobs')}*</label>
              <input
                className={`form-control ${
                  hasFormError('last_name', errors) ? 'has-error' : ''
                }`}
                type="text"
                placeholder="Your Last Name"
                name="last_name"
                value={accountInfo.last_name}
                onChange={handleInput}
              />
              <FormErrorMessage field="last_name" errors={errors} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>{__('Email Address', 'easyjobs')} *</label>
          <input
            className={`form-control ${
              hasFormError('email', errors) ? 'has-error' : ''
            }`}
            type="email"
            placeholder="youremail@gmail.com"
            name="email"
            value={accountInfo.email}
            onChange={handleInput}
          />
          <FormErrorMessage field="email" errors={errors} />
        </div>
        <div className="form-group">
          <label>{__('Password', 'easyjobs')}*</label>
          <input
            className={`form-control ${
              hasFormError('password', errors) ? 'has-error' : ''
            }`}
            type="password"
            placeholder="************"
            name="password"
            onChange={handleInput}
            value={accountInfo.password}
          />
          <FormErrorMessage field="password" errors={errors} />
        </div>
        <div className="form-group">
          <label>{__('Confirm Password', 'easyjobs')}*</label>
          <input
            className={`form-control ${
              hasFormError('password_confirm', errors) ? 'has-error' : ''
            }`}
            type="password"
            placeholder="************"
            name="password_confirm"
            value={accountInfo.password_confirm}
            onChange={handleInput}
          />
          <FormErrorMessage field="password_confirm" errors={errors} />
        </div>
        <div className="d-flex justify-content-between mt-2">
          <button className="button info-button" type="submit">
            {__('Sign UP', 'easyjobs')}
          </button>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <p className="another__account">
            Already have an account?{' '}
            <a
              href="#"
              className="sign-in-btn"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('signin-tab').click();
              }}
            >
              Sign In
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
