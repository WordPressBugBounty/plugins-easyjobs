import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Login from './Login';
import Welcome from './Welcome';
import {
  connectApiKey,
  createCompany,
  signIn,
  signUp,
} from '../../redux/actions/landingActions';
import CreateCompany from './CreateCompany';
import { getCompanyMetaData } from '../../redux/actions/companyActions';

const mapStateToProps = (state) => {
  return {
    loggedIn: state.landing.loggedIn,
    signInData: state.landing.signInData,
    connected: state.landing.connected,
    loading: state.landing.loading,
    signUpData: state.landing.signUpData,
    signUpErrors: state.landing.signUpErrors,
    metaData: state.settings.metadata,
    createCompanyErrors: state.landing.createCompanyErrors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (data) => dispatch(signIn(data)),
    connectApiKey: (apiKey) => dispatch(connectApiKey(apiKey)),
    signUp: (data) => dispatch(signUp(data)),
    getCompanyMetaData: () => dispatch(getCompanyMetaData()),
    createCompany: (data) => dispatch(createCompany(data)),
  };
};

const Landing = ({
  signIn,
  connectApiKey,
  signInData,
  connected,
  signUp,
  signUpErrors,
  loading,
  getCompanyMetaData,
  metaData,
  createCompany,
  createCompanyErrors,
  signUpData,
}) => {
  const [view, setView] = useState('welcome');
  useEffect(() => {
    if (connected) {
      window.location.href = easyJobsJs.easyjobs_admin_url;
    }
  }, [connected]);
  useEffect(() => {
    getCompanyMetaData();
  }, []);

  const [signUpDataTemp, setSignUpDataTemp] = useState('');
  useEffect(() => {
    if (signUpData && signUpData.email) {
      getCompanyMetaData();
      setView('company-create');
      setSignUpDataTemp(signUpData);
    }
  }, [signUpData]);
  return (
    <div className="content__wrapper" data-testid="ej-landing">
      {(view === 'welcome' && <Welcome setView={setView} />) ||
        (view === 'login' && (
          <Login
            signIn={signIn}
            connectApiKey={connectApiKey}
            signInData={signInData}
            signUp={signUp}
            signUpData={signUpDataTemp}
            signUpErrors={signUpErrors}
            loading={loading}
          />
        )) ||
        (view === 'company-create' && (
          <CreateCompany
            signUpData={signUpDataTemp}
            loading={loading}
            metaData={metaData}
            createCompany={createCompany}
            createCompanyErrors={createCompanyErrors}
          />
        ))}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
