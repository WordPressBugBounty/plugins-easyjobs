import { all, put, takeLatest } from 'redux-saga/effects';
import { ajaxCall } from '../../util/ajaxCall';
import {
  GET_ALL_CANDIDATES,
  GET_ALL_CANDIDATES_SUCCESS,
  GET_ALL_CANDIDATES_FAILED,
  GET_COMPANY_JOBS,
  GET_COMPANY_JOBS_SUCCESS,
  GET_COMPANY_JOBS_FAILED,
  GET_CANDIDATE_DETAILS,
  GET_CANDIDATE_DETAILS_SUCCESS,
  GET_CANDIDATE_DETAILS_FAILED,
  REMOVE_RATING,
  REMOVE_RATING_SUCCESS,
  REMOVE_RATING_FAILED,
  CHANGE_CANDIDATE_PIPELINE_SUCCESS,
  CHANGE_CANDIDATE_PIPELINE_FAILED,
  CHANGE_CANDIDATE_PIPELINE,
  CHANGE_CANDIDATE_DETAIL_RATING,
  CHANGE_CANDIDATE_DETAIL_RATING_SUCCESS,
  CHANGE_CANDIDATE_DETAIL_RATING_FAILED,
  REMOVE_CANDIDATE,
  REMOVE_CANDIDATE_SUCCESS,
  REMOVE_CANDIDATE_FAILED,
  REMOVE_NOTE,
  REMOVE_NOTE_SUCCESS,
  REMOVE_NOTE_FAILED,
  ADD_NOTE_AND_MANAGERS,
  ADD_NOTE_AND_MANAGERS_SUCCESS,
  ADD_NOTE_AND_MANAGERS_FAILED,
  GET_CANDIDATES_ID,
  GET_CANDIDATES_ID_SUCCESS,
  GET_CANDIDATES_ID_FAILED,
} from '../actions/candidateActions';

// All Candidate
export function* getAllCandidates({ params }) {
  const response = yield ajaxCall('easyjobs_get_candidates', { ...params });

  if (response.status === 'success') {
    yield put({
      type: GET_ALL_CANDIDATES_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_ALL_CANDIDATES_FAILED,
      error: response.error,
    });
  }
}
export function* allCandidates() {
  yield takeLatest(GET_ALL_CANDIDATES, getAllCandidates);
}

// Company Jobs
export function* getCompanyJobs() {
  const response = yield ajaxCall('easyjobs_get_company_jobs');

  if (response.status === 'success') {
    yield put({
      type: GET_COMPANY_JOBS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_COMPANY_JOBS_FAILED,
      error: response.error,
    });
  }
}

export function* companyJobs() {
  yield takeLatest(GET_COMPANY_JOBS, getCompanyJobs);
}

// Candidate Details
export function* getCandidateDetails({ params }) {
  const response = yield ajaxCall('easyjobs_candidate_details', { ...params });
  if (response.status === 'success') {
    yield put({
      type: GET_CANDIDATE_DETAILS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_CANDIDATE_DETAILS_FAILED,
      error: response.error,
    });
  }
}

export function* candidateDetails() {
  yield takeLatest(GET_CANDIDATE_DETAILS, getCandidateDetails);
}

// Remove Rating
export function* remove({ params }) {
  const response = yield ajaxCall('easyjobs_post_data', { ...params });
  const { id } = params;
  const response2 = yield ajaxCall('easyjobs_candidate_details', { id });
  if (response.status === 'success') {
    yield put({
      type: REMOVE_RATING_SUCCESS,
      data: response.data,
    });
    yield put({
      type: GET_CANDIDATE_DETAILS_SUCCESS,
      data: response2.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: REMOVE_RATING_FAILED,
      error: response.error,
    });
    yield put({
      type: GET_CANDIDATE_DETAILS_FAILED,
      error: response2.error,
    });
  }
}

export function* removeRating() {
  yield takeLatest(REMOVE_RATING, remove);
}

export function* doChangePipeline({ params }) {
  const response = yield ajaxCall('easyjobs_change_pipeline', {
    ...params,
  });
  const { applicants_id } = params;
  const [id] = applicants_id;
  const response2 = yield ajaxCall('easyjobs_candidate_details', { id });

  if (response.status === 'success') {
    yield put({
      type: CHANGE_CANDIDATE_PIPELINE_SUCCESS,
      data: response.data,
    });
    yield put({
      type: GET_CANDIDATE_DETAILS_SUCCESS,
      data: response2.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: CHANGE_CANDIDATE_PIPELINE_FAILED,
      error: response.error,
    });
    yield put({
      type: GET_CANDIDATE_DETAILS_FAILED,
      error: response2.error,
    });
  }
}
export function* changingPipeline() {
  yield takeLatest(CHANGE_CANDIDATE_PIPELINE, doChangePipeline);
}

export function* updateRating({ params }) {
  const { id } = params;

  const response1 = yield ajaxCall('easyjobs_post_data', {
    ...params,
  });
  const response2 = yield ajaxCall('easyjobs_candidate_details', { id });
  if (response1.status === 'success') {
    yield put({
      type: CHANGE_CANDIDATE_DETAIL_RATING_SUCCESS,
      data: response1.data,
    });
    yield put({
      type: GET_CANDIDATE_DETAILS_SUCCESS,
      data: response2.data,
    });
  } else if (response1.status === 'error') {
    yield put({
      type: CHANGE_CANDIDATE_DETAIL_RATING_FAILED,
      error: response1.error,
    });
    yield put({
      type: GET_CANDIDATE_DETAILS_FAILED,
      error: response2.error,
    });
  }
}
export function* updateCandidatesRating() {
  yield takeLatest(CHANGE_CANDIDATE_DETAIL_RATING, updateRating);
}

export function* removeCandidates({ params }) {
  const response = yield ajaxCall('easyjobs_delete_candidate', { ...params });
  if (response.status === 'success') {
    yield put({
      type: REMOVE_CANDIDATE_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: REMOVE_CANDIDATE_FAILED,
      error: response.error,
    });
  }
}
export function* removeCandidateInit() {
  yield takeLatest(REMOVE_CANDIDATE, removeCandidates);
}

export function* removeNotes({ params }) {
  const response = yield ajaxCall('easyjobs_delete_candidate_note', {
    ...params,
  });
  const { candidate_id } = params;

  const response2 = yield ajaxCall('easyjobs_candidate_details', {
    id: candidate_id,
  });
  if (response.status === 'success') {
    yield put({
      type: REMOVE_NOTE_SUCCESS,
      data: response.data,
    });
    yield put({
      type: GET_CANDIDATE_DETAILS_SUCCESS,
      data: response2.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: REMOVE_NOTE_FAILED,
      error: response.error,
    });
    yield put({
      type: GET_CANDIDATE_DETAILS_FAILED,
      error: response2.error,
    });
  }
}
export function* removeNoteInit() {
  yield takeLatest(REMOVE_NOTE, removeNotes);
}

export function* doAddNoteAndManagers({ params }) {
  const response = yield ajaxCall('easyjobs_save_candidate_note', {
    ...params,
  });
  const { candidate_id } = params;
  const response2 = yield ajaxCall('easyjobs_candidate_details', {
    id: candidate_id,
  });
  if (response.status === 'success') {
    yield put({
      type: ADD_NOTE_AND_MANAGERS_SUCCESS,
      data: response.data,
    });
    yield put({
      type: GET_CANDIDATE_DETAILS_SUCCESS,
      data: response2.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: ADD_NOTE_AND_MANAGERS_FAILED,
      error: response.error,
    });
    yield put({
      type: GET_CANDIDATE_DETAILS_FAILED,
      error: response2.error,
    });
  }
}
export function* addNoteAndManagersInit() {
  yield takeLatest(ADD_NOTE_AND_MANAGERS, doAddNoteAndManagers);
}

export function* getIds({ id }) {
  const response = yield ajaxCall('easyjobs_get_candidates_id', { id });
  if (response.status === 'success') {
    yield put({
      type: GET_CANDIDATES_ID_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_CANDIDATES_ID_FAILED,
      error: response.error,
    });
  }
}
export function* candidatesId() {
  yield takeLatest(GET_CANDIDATES_ID, getIds);
}

export default function* rootSaga() {
  yield all([
    allCandidates(),
    companyJobs(),
    candidateDetails(),
    removeRating(),
    changingPipeline(),
    updateCandidatesRating(),
    addNoteAndManagersInit(),
    removeCandidateInit(),
    removeNoteInit(),
    candidatesId(),
  ]);
}
