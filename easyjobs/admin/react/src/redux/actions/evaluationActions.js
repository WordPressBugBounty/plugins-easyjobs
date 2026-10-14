export const GET_ALL_QUESTION = 'GET_ALL_QUESTION';
export const GET_ALL_QUESTION_SUCCESS = 'GET_ALL_QUESTION_SUCCESS';
export const GET_ALL_QUESTION_FAILED = 'GET_ALL_QUESTION_FAILED';

export const DELETE_QUESTION = 'DELETE_QUESTION';
export const DELETE_QUESTION_SUCCESS = 'DELETE_QUESTION_SUCCESS';
export const DELETE_QUESTION_FAILED = 'DELETE_QUESTION_FAILED';

export const SAVE_QUESTION = 'SAVE_QUESTION';
export const SAVE_QUESTION_SUCCESS = 'SAVE_QUESTION_SUCCESS';
export const SAVE_QUESTION_FAILED = 'SAVE_QUESTION_FAILED';

export const GET_QUESTION = 'GET_QUESTION';
export const GET_QUESTION_SUCCESS = 'GET_QUESTION_SUCCESS';
export const GET_QUESTION_FAILED = 'GET_QUESTION_FAILED';

export const DUPLICATE_QUESTION = 'DUPLICATE_QUESTION';
export const DUPLICATE_QUESTION_SUCCESS = 'DUPLICATE_QUESTION_SUCCESS';
export const DUPLICATE_QUESTION_FAILED = 'DUPLICATE_QUESTION_FAILED';
export const DUPLICATE_RESET_QUESTION = 'DUPLICATE_RESET_QUESTION';

export const SAVE_ASSESSMENT = 'SAVE_ASSESSMENT';
export const SAVE_ASSESSMENT_SUCCESS = 'SAVE_ASSESSMENT_SUCCESS';
export const SAVE_ASSESSMENT_FAILED = 'SAVE_ASSESSMENT_FAILED';
export const RESET_ERRORS = 'RESET_ERRORS';

export const GET_ASSESSMENT = 'GET_ASSESSMENT';
export const GET_ASSESSMENT_SUCCESS = 'GET_ASSESSMENT_SUCCESS';
export const GET_ASSESSMENT_FAILED = 'GET_ASSESSMENT_FAILED';
export const RESET_EDIT = 'RESET_EDIT';

export function getAllQuestion(params) {
  return {
    type: GET_ALL_QUESTION,
    params,
  };
}

export function deleteQuestion(params) {
  return {
    type: DELETE_QUESTION,
    params,
  };
}

export function saveQuestion(params) {
  return {
    type: SAVE_QUESTION,
    params,
  };
}

export function getQuestionSet(id) {
  return {
    type: GET_QUESTION,
    id,
  };
}

export function duplicateQuestion(id) {
  return {
    type: DUPLICATE_QUESTION,
    id,
  };
}

export function resetDuplicateSet(id) {
  return {
    type: DUPLICATE_RESET_QUESTION,
  };
}

export function saveAssessment(params) {
  return {
    type: SAVE_ASSESSMENT,
    params,
  };
}

export function getAssessment(id) {
  return {
    type: GET_ASSESSMENT,
    id,
  };
}

export function resetEdit() {
  return {
    type: RESET_EDIT,
  };
}

export function resetErrors() {
  return {
    type: RESET_ERRORS,
  };
}
