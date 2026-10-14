import { all, put, takeLatest } from 'redux-saga/effects';
import { ajaxCall } from '../../util/ajaxCall';
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
  GET_ANALYTICS_INFO_FAILED,
  GET_ANALYTICS_INFO_SUCCESS,
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

export function* getCompanyStats() {
  const response = yield ajaxCall('easyjobs_company_stats', {
    id: 3285,
  });

  if (response.status === 'success') {
    yield put({
      type: GET_COMPANY_STATS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_COMPANY_STATS_FAILED,
      error: response.error,
    });
  }
}

export function* companyStats() {
  yield takeLatest(GET_COMPANY_STATS, getCompanyStats);
}

// Candidate info
export function* getCandidatesInfo() {
  const response = yield ajaxCall('easyjobs_recent_applicants');

  if (response.status === 'success') {
    yield put({
      type: GET_CANDIDATES_INFO_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_CANDIDATES_INFO_FAILED,
      error: response.error,
    });
  }
}
export function* candidatesInfo() {
  yield takeLatest(GET_CANDIDATES_INFO, getCandidatesInfo);
}

// Recent Jobs
export function* getRecentJobs({ page }) {
  const response = yield ajaxCall('easyjobs_recent_jobs', { page });

  if (response.status === 'success') {
    yield put({
      type: GET_RECENT_JOBS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_RECENT_JOBS_FAILED,
      error: response.error,
    });
  }
}
export function* recentJobs() {
  yield takeLatest(GET_RECENT_JOBS, getRecentJobs);
}

export function* getAnalyticsInfo({ params }) {
  const response = yield ajaxCall('easyjobs_analytics_info', { params });

  if (response.status === 'success') {
    yield put({
      type: GET_ANALYTICS_INFO_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_ANALYTICS_INFO_FAILED,
      error: response.message,
    });
  }
}
export function* analyticsInfo() {
  yield takeLatest(GET_ANALYTICS_INFO, getAnalyticsInfo);
}

export function* getAnalyticsStats() {
  const response = yield ajaxCall('easyjobs_job_analytics_stats');

  if (response.status === 'success') {
    yield put({
      type: GET_JOB_ANALYTICS_STATS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_JOB_ANALYTICS_STATS_FAILED,
      error: response.message,
    });
  }
}
export function* analyticsStats() {
  yield takeLatest(GET_JOB_ANALYTICS_STATS, getAnalyticsStats);
}

export function* getActiveJobs() {
  const response = yield ajaxCall('easyjobs_get_active_jobs');

  if (response.status === 'success') {
    yield put({
      type: GET_EJ_ACTIVE_JOBS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_EJ_ACTIVE_JOBS_FAILED,
      error: response.message,
    });
  }
}
export function* activeJobs() {
  yield takeLatest(GET_EJ_ACTIVE_JOBS, getActiveJobs);
}

// Candidate Limit
export function* getCandidateLimit() {
  const response = yield ajaxCall('easyjobs_get_candidate_limit');

  if (response.status === 'success') {
    yield put({
      type: GET_CANDIDATE_LIMIT_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_CANDIDATE_LIMIT_FAILED,
      error: response.message,
    });
  }
}
export function* candidateLimit() {
  yield takeLatest(GET_CANDIDATE_LIMIT, getCandidateLimit);
}

export default function* rootSaga() {
  yield all([
    companyStats(),
    candidatesInfo(),
    recentJobs(),
    analyticsInfo(),
    analyticsStats(),
    activeJobs(),
    candidateLimit(),
  ]);
}
