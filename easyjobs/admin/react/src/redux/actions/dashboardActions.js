export const GET_COMPANY_STATS = 'GET_COMPANY_STATS';
export const GET_COMPANY_STATS_SUCCESS = 'GET_COMPANY_STATS_SUCCESS';
export const GET_COMPANY_STATS_FAILED = 'GET_COMPANY_STATS_FAILED';

// Candidate Info
export const GET_CANDIDATES_INFO = 'GET_CANDIDATES_INFO';
export const GET_CANDIDATES_INFO_SUCCESS = 'GET_CANDIDATES_INFO_SUCCESS';
export const GET_CANDIDATES_INFO_FAILED = 'GET_CANDIDATES_INFO_FAILED';

// Recent Jobs
export const GET_RECENT_JOBS = 'GET_RECENT_JOBS';
export const GET_RECENT_JOBS_SUCCESS = 'GET_RECENT_JOBS_SUCCESS';
export const GET_RECENT_JOBS_FAILED = 'GET_RECENT_JOBS_FAILED';

export const GET_JOB_ANALYTICS_STATS = 'GET_JOB_ANALYTICS_STATS';
export const GET_JOB_ANALYTICS_STATS_SUCCESS =
  'GET_JOB_ANALYTICS_STATS_SUCCESS';
export const GET_JOB_ANALYTICS_STATS_FAILED = 'GET_JOB_ANALYTICS_STATS_FAILED';

export const GET_ANALYTICS_INFO = 'GET_ANALYTICS_INFO';
export const GET_ANALYTICS_INFO_SUCCESS = 'GET_ANALYTICS_INFO_SUCCESS';
export const GET_ANALYTICS_INFO_FAILED = 'GET_ANALYTICS_INFO_FAILED';

export const GET_EJ_ACTIVE_JOBS = 'GET_EJ_ACTIVE_JOBS';
export const GET_EJ_ACTIVE_JOBS_SUCCESS = 'GET_EJ_ACTIVE_JOBS_SUCCESS';
export const GET_EJ_ACTIVE_JOBS_FAILED = 'GET_EJ_ACTIVE_JOBS_FAILED';

// Candidate Limit
export const GET_CANDIDATE_LIMIT = 'GET_CANDIDATE_LIMIT';
export const GET_CANDIDATE_LIMIT_SUCCESS = 'GET_CANDIDATE_LIMIT_SUCCESS';
export const GET_CANDIDATE_LIMIT_FAILED = 'GET_CANDIDATE_LIMIT_FAILED';

export function getCompanyStats() {
  return {
    type: GET_COMPANY_STATS,
  };
}

export function getCandidatesInfo() {
  return {
    type: GET_CANDIDATES_INFO,
  };
}

export function getRecentJobs(page) {
  return {
    type: GET_RECENT_JOBS,
    page,
  };
}

export function getJobAnalyticsStats() {
  return {
    type: GET_JOB_ANALYTICS_STATS,
  };
}

export function getAnalyticsInfo(params) {
  return {
    type: GET_ANALYTICS_INFO,
    params,
  };
}

export function getActiveJobs() {
  return {
    type: GET_EJ_ACTIVE_JOBS,
  };
}

export function getCandidateLimit() {
  return {
    type: GET_CANDIDATE_LIMIT,
  };
}
