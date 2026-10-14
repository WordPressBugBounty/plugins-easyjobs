import { all, put, takeLatest } from 'redux-saga/effects';
import { ajaxCall } from '../../util/ajaxCall';
import {
  GET_ALL_JOB_CANDIDATES,
  GET_ALL_JOB_CANDIDATES_SUCCESS,
  GET_ALL_JOB_CANDIDATES_FAILED,
  SET_CANDIDATES_RATING,
  SET_CANDIDATES_RATING_FAILED,
  SET_CANDIDATES_RATING_SUCCESS,
  GET_PENDING_CANDIDATES,
  GET_PENDING_CANDIDATES_SUCCESS,
  GET_PENDING_CANDIDATES_FAILED,
  DELETE_PENDING_CANDIDATE,
  DELETE_PENDING_CANDIDATE_SUCCESS,
  DELETE_PENDING_CANDIDATE_FAILED,
  SEND_INVITATION,
  SEND_INVITATION_SUCCESS,
  SEND_INVITATION_FAILED,
  GET_INVITED_CANDIDATES_SUCCESS,
  GET_INVITED_CANDIDATES_FAILED,
  GET_INVITED_CANDIDATES,
  GET_FILTERED_CANDIDATES,
  GET_FILTERED_CANDIDATES_SUCCESS,
  GET_FILTERED_CANDIDATES_FAILED,
  DELETE_INVITE_CANDIDATE,
  DELETE_INVITE_CANDIDATE_SUCCESS,
  DELETE_INVITE_CANDIDATE_FAILED,
} from '../actions/jobCadidatesActions';

// All Candidate
export function* getAllJobCandidates({ params }) {
  const response = yield ajaxCall('easyjobs_get_job_candidates', {
    ...params,
  });

  if (response.status === 'success') {
    yield put({
      type: GET_ALL_JOB_CANDIDATES_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_ALL_JOB_CANDIDATES_FAILED,
      error: response.error,
    });
  }
}
export function* allJobCandidates() {
  yield takeLatest(GET_ALL_JOB_CANDIDATES, getAllJobCandidates);
}

export function* updateRating({ params }) {
  const { job_id } = params;
  const response1 = yield ajaxCall('easyjobs_post_data', {
    ...params,
  });
  const response = yield ajaxCall('easyjobs_get_job_candidates', {
    job_id,
  });

  if (response1.status === 'success') {
    yield put({
      type: SET_CANDIDATES_RATING_SUCCESS,
      data: response1.data,
    });
    yield put({
      type: GET_ALL_JOB_CANDIDATES_SUCCESS,
      data: response.data,
    });
  } else if (response1.status === 'error') {
    yield put({
      type: SET_CANDIDATES_RATING_FAILED,
      error: response1.error,
    });
    yield put({
      type: GET_ALL_JOB_CANDIDATES_FAILED,
      error: response.error,
    });
  }
}
export function* updateCandidatesRating() {
  yield takeLatest(SET_CANDIDATES_RATING, updateRating);
  yield takeLatest(GET_ALL_JOB_CANDIDATES, getAllJobCandidates);
}

export function* pendingCandidates({ params }) {
  const response = yield ajaxCall('easyjobs_get_pending_candidates', {
    ...params,
  });

  if (response.status === 'success') {
    yield put({
      type: GET_PENDING_CANDIDATES_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_PENDING_CANDIDATES_FAILED,
      error: response.error,
    });
  }
}
export function* getPendingCandidates() {
  yield takeLatest(GET_PENDING_CANDIDATES, pendingCandidates);
}

export function* deleteCandidate({ params }) {
  const { job_id } = params;
  const response = yield ajaxCall('easyjobs_delete_pending_candidate', {
    ...params,
  });
  const response2 = yield ajaxCall('easyjobs_get_pending_candidates', {
    job_id,
  });

  if (response.status === 'success') {
    yield put({
      type: DELETE_PENDING_CANDIDATE_SUCCESS,
      data: response.data,
    });
    yield put({
      type: GET_PENDING_CANDIDATES_SUCCESS,
      data: response2.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: DELETE_PENDING_CANDIDATE_FAILED,
      error: response.error,
    });
    yield put({
      type: GET_PENDING_CANDIDATES_FAILED,
      error: response2.error,
    });
  }
}
export function* deletePendingCandidate() {
  yield takeLatest(DELETE_PENDING_CANDIDATE, deleteCandidate);
}

export function* invitationMail({ params }) {
  const { id } = params;
  const response = yield ajaxCall('easyjobs_post_data', {
    ...params,
  });
  const response2 = yield ajaxCall('easyjobs_get_invited_candidates', {
    job_id: id,
  });

  if (response.status === 'success') {
    yield put({
      type: SEND_INVITATION_SUCCESS,
      data: response.data,
    });
    yield put({
      type: GET_INVITED_CANDIDATES_SUCCESS,
      data: response2.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SEND_INVITATION_FAILED,
      error: response.error,
    });
    yield put({
      type: GET_INVITED_CANDIDATES_FAILED,
      error: response2.error,
    });
  }
}
export function* sendInvitation() {
  yield takeLatest(SEND_INVITATION, invitationMail);
}

export function* invitedCandidates({ params }) {
  const response = yield ajaxCall('easyjobs_get_invited_candidates', {
    ...params,
  });

  if (response.status === 'success') {
    yield put({
      type: GET_INVITED_CANDIDATES_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_INVITED_CANDIDATES_FAILED,
      error: response.error,
    });
  }
}
export function* getInvitedCandidates() {
  yield takeLatest(GET_INVITED_CANDIDATES, invitedCandidates);
}

export function* filteredCandidates({ params }) {
  const response = yield ajaxCall('easyjobs_search_filter_candidates', {
    ...params,
  });

  if (response.status === 'success') {
    yield put({
      type: GET_FILTERED_CANDIDATES_SUCCESS,
      data: response.candidates,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_FILTERED_CANDIDATES_FAILED,
      error: response.error,
    });
  }
}
export function* getFilteredCandidates() {
  yield takeLatest(GET_FILTERED_CANDIDATES, filteredCandidates);
}

export function* deleteICandidate({ params }) {
  const { id } = params;
  const response = yield ajaxCall('easyjobs_post_data', {
    ...params,
  });
  const response2 = yield ajaxCall('easyjobs_get_invited_candidates', {
    job_id: id,
  });

  if (response.status === 'success') {
    yield put({
      type: DELETE_INVITE_CANDIDATE_SUCCESS,
      data: response.candidates,
    });
    yield put({
      type: GET_INVITED_CANDIDATES_SUCCESS,
      data: response2.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: DELETE_INVITE_CANDIDATE_FAILED,
      error: response.error,
    });
    yield put({
      type: GET_INVITED_CANDIDATES_FAILED,
      error: response2.error,
    });
  }
}
export function* deleteInviteCandidate() {
  yield takeLatest(DELETE_INVITE_CANDIDATE, deleteICandidate);
}

export default function* rootSaga() {
  yield all([
    allJobCandidates(),
    updateCandidatesRating(),
    getPendingCandidates(),
    deletePendingCandidate(),
    sendInvitation(),
    getInvitedCandidates(),
    getFilteredCandidates(),
    deleteInviteCandidate(),
  ]);
}
