// All Candidates of a particular job
export const GET_ALL_JOB_CANDIDATES = 'GET_ALL_JOB_CANDIDATES';
export const GET_ALL_JOB_CANDIDATES_SUCCESS = 'GET_ALL_JOB_CANDIDATES_SUCCESS';
export const GET_ALL_JOB_CANDIDATES_FAILED = 'GET_ALL_JOB_CANDIDATES_FAILED';

export const SET_CANDIDATES_RATING = 'SET_CANDIDATES_RATING';
export const SET_CANDIDATES_RATING_SUCCESS = 'SET_CANDIDATES_RATING_SUCCESS';
export const SET_CANDIDATES_RATING_FAILED = 'SET_CANDIDATES_RATING_FAILED';

export const GET_PENDING_CANDIDATES = 'GET_PENDING_CANDIDATES';
export const GET_PENDING_CANDIDATES_SUCCESS = 'GET_PENDING_CANDIDATES_SUCCESS';
export const GET_PENDING_CANDIDATES_FAILED = 'GET_PENDING_CANDIDATES_FAILED';

export const DELETE_PENDING_CANDIDATE = 'DELETE_PENDING_CANDIDATE';
export const DELETE_PENDING_CANDIDATE_SUCCESS =
  'DELETE_PENDING_CANDIDATE_SUCCESS';
export const DELETE_PENDING_CANDIDATE_FAILED =
  'DELETE_PENDING_CANDIDATE_FAILED';

export const SEND_INVITATION = 'SEND_INVITATION';
export const SEND_INVITATION_SUCCESS = 'SEND_INVITATION_SUCCESS';
export const SEND_INVITATION_FAILED = 'SEND_INVITATION_FAILED';

export const GET_INVITED_CANDIDATES = 'GET_INVITED_CANDIDATES';
export const GET_INVITED_CANDIDATES_SUCCESS = 'GET_INVITED_CANDIDATES_SUCCESS';
export const GET_INVITED_CANDIDATES_FAILED = 'GET_INVITED_CANDIDATES_FAILED';

export const GET_FILTERED_CANDIDATES = 'GET_FILTERED_CANDIDATES';
export const GET_FILTERED_CANDIDATES_SUCCESS =
  'GET_FILTERED_CANDIDATES_SUCCESS';
export const GET_FILTERED_CANDIDATES_FAILED = 'GET_FILTERED_CANDIDATES_FAILED';

export const DELETE_INVITE_CANDIDATE = 'DELETE_INVITE_CANDIDATE';
export const DELETE_INVITE_CANDIDATE_SUCCESS =
  'DELETE_INVITE_CANDIDATE_SUCCESS';
export const DELETE_INVITE_CANDIDATE_FAILED = 'DELETE_INVITE_CANDIDATE_FAILED';

export function getAllJobCandidates(params) {
  return {
    type: GET_ALL_JOB_CANDIDATES,
    params,
  };
}

export function setCandidatesRating(params) {
  return {
    type: SET_CANDIDATES_RATING,
    params,
  };
}

export function getPendingCandidates(params) {
  return {
    type: GET_PENDING_CANDIDATES,
    params,
  };
}

export function deletePendingCandidate(params) {
  return {
    type: DELETE_PENDING_CANDIDATE,
    params,
  };
}

export function sendInvitation(params) {
  return {
    type: SEND_INVITATION,
    params,
  };
}

export function getInvitedCandidates(params) {
  return {
    type: GET_INVITED_CANDIDATES,
    params,
  };
}

export function getFilteredCandidates(params) {
  return {
    type: GET_FILTERED_CANDIDATES,
    params,
  };
}

export function deleteInviteCandidate(params) {
  return {
    type: DELETE_INVITE_CANDIDATE,
    params,
  };
}
