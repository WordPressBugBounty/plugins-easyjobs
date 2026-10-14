import {
  GET_COMPANY_STATS,
  GET_COMPANY_STATS_FAILED,
  GET_COMPANY_STATS_SUCCESS,
  GET_CANDIDATES_INFO,
  GET_CANDIDATES_INFO_SUCCESS,
  GET_CANDIDATES_INFO_FAILED,
  GET_RECENT_JOBS,
  GET_RECENT_JOBS_SUCCESS,
  GET_RECENT_JOBS_FAILED,
  GET_ANALYTICS_INFO,
  GET_ANALYTICS_INFO_SUCCESS,
  GET_ANALYTICS_INFO_FAILED,
  GET_JOB_ANALYTICS_STATS,
  GET_JOB_ANALYTICS_STATS_SUCCESS,
  GET_JOB_ANALYTICS_STATS_FAILED,
  GET_EJ_ACTIVE_JOBS,
  GET_EJ_ACTIVE_JOBS_SUCCESS,
  GET_EJ_ACTIVE_JOBS_FAILED,
  GET_CANDIDATE_LIMIT,
  GET_CANDIDATE_LIMIT_SUCCESS,
  GET_CANDIDATE_LIMIT_FAILED,
} from '../actions/dashboardActions';

import { toast } from 'react-toastify';

const initialState = {
  companyStats: undefined,
  candidatesInfo: undefined,
  recentJobs: undefined,
  analyticsInfo: undefined,
  loading: undefined,
  loadingRecentJobs: undefined,
  loadingAnalytics: undefined,
  jobAnalyticsStats: undefined,
  activeJobs: undefined,
  candidateLimit: undefined,
};

export default function dashboard(state = initialState, action) {
  switch (action.type) {
    case GET_COMPANY_STATS:
      return {
        ...state,
        companyStats: undefined,
        loading: true,
      };
    case GET_COMPANY_STATS_SUCCESS:
      return {
        ...state,
        companyStats: action.data,
        loading: false,
      };
    case GET_COMPANY_STATS_FAILED:
      return {
        ...state,
        companyStats: undefined,
        loading: false,
      };
    case GET_CANDIDATES_INFO: // Candidate Info
      return {
        ...state,
        candidatesInfo: undefined,
        loading: true,
      };
    case GET_CANDIDATES_INFO_SUCCESS:
      return {
        ...state,
        candidatesInfo: action.data,
        loading: false,
      };
    case GET_CANDIDATES_INFO_FAILED:
      return {
        ...state,
        candidatesInfo: undefined,
        loading: false,
      };
    case GET_RECENT_JOBS: // Recent Jobs
      return {
        ...state,
        // recentJobs: undefined,
        loadingRecentJobs: true,
      };
    case GET_RECENT_JOBS_SUCCESS:
      return {
        ...state,
        recentJobs: action.data,
        loadingRecentJobs: false,
      };
    case GET_RECENT_JOBS_FAILED:
      return {
        ...state,
        recentJobs: undefined,
        loadingRecentJobs: false,
      };
    case GET_ANALYTICS_INFO: // Analytics info
      return {
        ...state,
        loadingAnalytics: true,
      };
    case GET_ANALYTICS_INFO_SUCCESS:
      return {
        ...state,
        analyticsInfo: action.data,
        loadingAnalytics: false,
      };
    case GET_ANALYTICS_INFO_FAILED:
      toast.error(action.error);
      return {
        ...state,
        analyticsInfo: undefined,
        loadingAnalytics: false,
      };
    case GET_JOB_ANALYTICS_STATS: // Job Analytics stats
      return {
        ...state,
        // loadingAnalytics: true,
      };
    case GET_JOB_ANALYTICS_STATS_SUCCESS:
      return {
        ...state,
        jobAnalyticsStats: action.data,
        // loadingAnalytics: false
      };
    case GET_JOB_ANALYTICS_STATS_FAILED:
      toast.error(action.error);
      return {
        ...state,
        jobAnalyticsStats: undefined,
        // loadingAnalytics: false
      };
    case GET_EJ_ACTIVE_JOBS: // Active jobs
      return {
        ...state,
        // loadingAnalytics: true,
      };
    case GET_EJ_ACTIVE_JOBS_SUCCESS:
      return {
        ...state,
        activeJobs: action.data,
        // loadingAnalytics: false
      };
    case GET_JOB_ANALYTICS_STATS_FAILED:
      toast.error(action.error);
      return {
        ...state,
        activeJobs: undefined,
        // loadingAnalytics: false
      };
    case GET_CANDIDATE_LIMIT:
      return {
        ...state,
        candidateLimit: undefined,
      };
    case GET_CANDIDATE_LIMIT_SUCCESS:
      return {
        ...state,
        candidateLimit: action.data,
      };
    case GET_CANDIDATE_LIMIT_FAILED:
      return {
        ...state,
        candidateLimit: undefined,
      };
    default:
      return state;
  }
}
