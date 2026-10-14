// All Candidates
export const GET_ALL_CANDIDATES = 'GET_ALL_CANDIDATES';
export const GET_ALL_CANDIDATES_SUCCESS = 'GET_ALL_CANDIDATES_SUCCESS';
export const GET_ALL_CANDIDATES_FAILED = 'GET_ALL_CANDIDATES_FAILED';

// Company Jobs
export const GET_COMPANY_JOBS = 'GET_COMPANY_JOBS';
export const GET_COMPANY_JOBS_SUCCESS = 'GET_COMPANY_JOBS_SUCCESS';
export const GET_COMPANY_JOBS_FAILED = 'GET_COMPANY_JOBS_FAILED';

// Candidate Details
export const GET_CANDIDATE_DETAILS = 'GET_CANDIDATE_DETAILS';
export const GET_CANDIDATE_DETAILS_SUCCESS = 'GET_CANDIDATE_DETAILS_SUCCESS';
export const GET_CANDIDATE_DETAILS_FAILED = 'GET_CANDIDATE_DETAILS_FAILED';

export const TEST_AJAX_ACTION = 'TEST_AJAX_ACTION';
export const TEST_AJAX_ACTION_SUCCESS = 'TEST_AJAX_ACTION_SUCCESS';
export const TEST_AJAX_ACTION_FAILED = 'TEST_AJAX_ACTION_FAILED';

export const REMOVE_RATING = 'REMOVE_RATING';
export const REMOVE_RATING_SUCCESS = 'REMOVE_RATING_SUCCESS';
export const REMOVE_RATING_FAILED = 'REMOVE_RATING_FAILED';

export const CHANGE_CANDIDATE_PIPELINE = 'CHANGE_CANDIDATE_PIPELINE';
export const CHANGE_CANDIDATE_PIPELINE_SUCCESS =
  'CHANGE_CANDIDATE_PIPELINE_SUCCESS';
export const CHANGE_CANDIDATE_PIPELINE_FAILED =
  'CHANGE_CANDIDATE_PIPELINE_FAILED';

export const CHANGE_CANDIDATE_DETAIL_RATING = 'CHANGE_CANDIDATE_DETAIL_RATING';
export const CHANGE_CANDIDATE_DETAIL_RATING_SUCCESS =
  'CHANGE_CANDIDATE_DETAIL_RATING_SUCCESS';
export const CHANGE_CANDIDATE_DETAIL_RATING_FAILED =
  'CHANGE_CANDIDATE_DETAIL_RATING_FAILED';

export const REMOVE_CANDIDATE = 'REMOVE_CANDIDATE';
export const REMOVE_CANDIDATE_SUCCESS = 'REMOVE_CANDIDATE_SUCCESS';
export const REMOVE_CANDIDATE_FAILED = 'REMOVE_CANDIDATE_FAILED';

export const REMOVE_NOTE = 'REMOVE_NOTE';
export const REMOVE_NOTE_SUCCESS = 'REMOVE_NOTE_SUCCESS';
export const REMOVE_NOTE_FAILED = 'REMOVE_NOTE_FAILED';

export const ADD_NOTE_AND_MANAGERS = 'ADD_NOTE_AND_MANAGERS';
export const ADD_NOTE_AND_MANAGERS_SUCCESS = 'ADD_NOTE_AND_MANAGERS_SUCCESS';
export const ADD_NOTE_AND_MANAGERS_FAILED = 'ADD_NOTE_AND_MANAGERS_FAILED';

export const GET_CANDIDATES_ID = 'GET_CANDIDATES_ID';
export const GET_CANDIDATES_ID_SUCCESS = 'GET_CANDIDATES_ID_SUCCESS';
export const GET_CANDIDATES_ID_FAILED = 'GET_CANDIDATES_ID_FAILED';
export const RESET_CANDIDATES_ID = 'RESET_CANDIDATES_ID';

export function getAllCandidates(params) {
  return {
    type: GET_ALL_CANDIDATES,
    params,
  };
}

export function getCompanyJobs() {
  return {
    type: GET_COMPANY_JOBS,
  };
}

export function getCandidateDetails(params) {
  return {
    type: GET_CANDIDATE_DETAILS,
    params,
  };
}

export function removeRating(params) {
  return {
    type: REMOVE_RATING,
    params,
  };
}

export function testAction(data) {
  return {
    type: TEST_AJAX_ACTION,
    data,
  };
}

export function changePipeline(params) {
  return {
    type: CHANGE_CANDIDATE_PIPELINE,
    params,
  };
}

export function setCandidatesRating(params) {
  return {
    type: CHANGE_CANDIDATE_DETAIL_RATING,
    params,
  };
}

export function removeCandidate(params) {
  return {
    type: REMOVE_CANDIDATE,
    params,
  };
}

export function removeNote(params) {
  return {
    type: REMOVE_NOTE,
    params,
  };
}

export function addNoteAndManagers(params) {
  return {
    type: ADD_NOTE_AND_MANAGERS,
    params,
  };
}

export function getCandidatesId(id) {
  return {
    type: GET_CANDIDATES_ID,
    id,
  };
}

export function resetCandidatesId() {
  return {
    type: RESET_CANDIDATES_ID,
  };
}
