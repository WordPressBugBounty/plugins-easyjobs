import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Counters from './Counters';
import Candidates from './Candidates';
import RecentJobs from './RecentJobs';
import WelcomeScreen from './WelcomeScreen';
import CandidateLimitNotice from '../Common/CandidateLimitNotice';
import { __ } from '@wordpress/i18n';

import {
  getCompanyStats,
  getCandidatesInfo,
  getRecentJobs,
  getAnalyticsInfo,
  getActiveJobs,
  getCandidateLimit,
} from '../../redux/actions/dashboardActions';
import {
  getInvitedCandidates,
  sendInvitation,
  deleteInviteCandidate,
} from '../../redux/actions/jobCadidatesActions';
import Analytics from './Analytics';

const mapStateToProps = (state) => {
  return {
    companyStats: state.dashboard.companyStats,
    candidatesInfo: state.dashboard.candidatesInfo,
    recentJobs: state.dashboard.recentJobs,
    analyticsInfo: state.dashboard.analyticsInfo,
    loading: state.dashboard.loading,
    loadingRecentJobs: state.dashboard.loadingRecentJobs,
    loadingAnalytics: state.dashboard.loadingAnalytics,
    activeJobs: state.dashboard.activeJobs,
    candidateLimit: state.dashboard.candidateLimit,
    companyInfo: state.settings.companyInfo,
    invitedCandidates: state.jobCandidates.invitedCandidates,
    invitedCandidatesLoading: state.jobCandidates.invitedCandidatesLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCompanyStats: () => dispatch(getCompanyStats()),
    getCandidatesInfo: () => dispatch(getCandidatesInfo()),
    getRecentJobs: (page) => dispatch(getRecentJobs(page)),
    getAnalyticsInfo: (params) => dispatch(getAnalyticsInfo(params)),
    getActiveJobs: () => dispatch(getActiveJobs()),
    getCandidateLimit: () => dispatch(getCandidateLimit()),
    getInvitedCandidates: (params) => dispatch(getInvitedCandidates(params)),
    sendInvitation: (params) => dispatch(sendInvitation(params)),
    deleteInviteCandidate: (params) => dispatch(deleteInviteCandidate(params)),
  };
};

const Dashboard = ({
  getCompanyStats,
  companyStats,
  getCandidatesInfo,
  candidatesInfo,
  getRecentJobs,
  recentJobs,
  getAnalyticsInfo,
  analyticsInfo,
  loading,
  loadingRecentJobs,
  loadingAnalytics,
  companyInfo,
  getActiveJobs,
  activeJobs,
  getCandidateLimit,
  candidateLimit,
  getInvitedCandidates,
  invitedCandidates,
  invitedCandidatesLoading,
  sendInvitation,
  deleteInviteCandidate,
}) => {
  useEffect(() => {
    document.title = `Easyjobs - Dashboard ‹ ${easyJobsJs.title} — Wordpress`;
    getCandidatesInfo();
    getRecentJobs(1);
    if (!candidateLimit) {
      getCandidateLimit();
    }
  }, []);

  // Flag the shared `.content-area__body` wrapper as the dashboard only while this
  // view is mounted, so the dashboard-specific top spacing (see _dashboard.scss)
  // doesn't leak onto other pages that reuse the same wrapper.
  useEffect(() => {
    const body = document.querySelector('.content-area__body');
    if (body) body.classList.add('is-dashboard');
    return () => {
      if (body) body.classList.remove('is-dashboard');
    };
  }, []);

  return (
    <>
      <CandidateLimitNotice candidateLimit={candidateLimit} />
      <Counters getCompanyStats={getCompanyStats} companyStats={companyStats} />

      {candidatesInfo || recentJobs?.data ? (
        <>
          <Candidates
            getCandidatesInfo={getCandidatesInfo}
            candidatesInfo={candidatesInfo}
            getActiveJobs={getActiveJobs}
            activeJobs={activeJobs}
            getInvitedCandidates={getInvitedCandidates}
            invitedCandidates={invitedCandidates}
            invitedCandidatesLoading={invitedCandidatesLoading}
            sendInvitation={sendInvitation}
            deleteInviteCandidate={deleteInviteCandidate}
          />

          <Analytics
            getAnalyticsInfo={getAnalyticsInfo}
            analyticsInfo={analyticsInfo}
            loadingAnalytics={loadingAnalytics}
            companyInfo={companyInfo}
          />

          <RecentJobs
            getRecentJobs={getRecentJobs}
            recentJobs={recentJobs}
            loading={loadingRecentJobs}
          />
        </>
      ) : (
        loading && (
          <h4 className="empty-message ej-loading">
            {__('Loading data...', 'easyjobs')}
          </h4>
        )
      )}

      {!loading && !candidatesInfo && recentJobs?.data?.length == 0 && (
        <WelcomeScreen />
      )}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
