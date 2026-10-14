export const GET_JOB_CREATE_META = 'GET_JOB_CREATE_META';
export const GET_JOB_CREATE_META_SUCCESS = 'GET_JOB_CREATE_META_SUCCESS';
export const GET_JOB_CREATE_META_FAILED = 'GET_JOB_CREATE_META_FAILED';

export const SAVE_INFORMATION = 'SAVE_INFORMATION';
export const SAVE_INFORMATION_SUCCESS = 'SAVE_INFORMATION_SUCCESS';
export const SAVE_INFORMATION_FAILED = 'SAVE_INFORMATION_FAILED';

export const GET_SCREENING_QUESTION_META = 'GET_SCREENING_QUESTION_META';
export const GET_SCREENING_QUESTION_META_SUCCESS =
  'GET_SCREENING_QUESTION_META_SUCCESS';
export const GET_SCREENING_QUESTION_META_FAILED =
  'GET_SCREENING_QUESTION_META_FAILED';

export const SAVE_QUESTIONS = 'SAVE_QUESTIONS';
export const SAVE_QUESTIONS_SUCCESS = 'SAVE_QUESTIONS_SUCCESS';
export const SAVE_QUESTIONS_FAILED = 'SAVE_QUESTIONS_FAILED';

export const GET_QUIZ_META = 'GET_QUIZ_META';
export const GET_QUIZ_META_SUCCESS = 'GET_QUIZ_META_SUCCESS';
export const GET_QUIZ_META_FAILED = 'GET_QUIZ_META_FAILED';

export const SAVE_QUIZ = 'SAVE_QUIZ';
export const SAVE_QUIZ_SUCCESS = 'SAVE_QUIZ_SUCCESS';
export const SAVE_QUIZ_FAILED = 'SAVE_QUIZ_FAILED';

export const CHANGE_STATUS = 'CHANGE_STATUS';
export const CHANGE_STATUS_SUCCESS = 'CHANGE_STATUS_SUCCESS';
export const CHANGE_STATUS_FAILED = 'CHANGE_STATUS_FAILED';

export const GET_JOB_BASIC_INFO = 'GET_JOB_BASIC_INFO';
export const GET_JOB_BASIC_INFO_SUCCESS = 'GET_JOB_BASIC_INFO_SUCCESS';
export const GET_JOB_BASIC_INFO_FAILED = 'GET_JOB_BASIC_INFO_FAILED';

export const GET_QUESTIONS = 'GET_QUESTIONS';
export const GET_QUESTIONS_SUCCESS = 'GET_QUESTIONS_SUCCESS';
export const GET_QUESTIONS_FAILED = 'GET_QUESTIONS_FAILED';

export const GET_QUIZ = 'GET_QUIZ';
export const GET_QUIZ_SUCCESS = 'GET_QUIZ_SUCCESS';
export const GET_QUIZ_FAILED = 'GET_QUIZ_FAILED';

export const UPDATE_JOB = 'UPDATE_JOB';
export const UPDATE_JOB_SUCCESS = 'UPDATE_JOB_SUCCESS';
export const UPDATE_JOB_FAILED = 'UPDATE_JOB_FAILED';

export const GET_REQUIRED_FIELDS = 'GET_REQUIRED_FIELDS';
export const GET_REQUIRED_FIELDS_SUCCESS = 'GET_REQUIRED_FIELDS_SUCCESS';
export const GET_REQUIRED_FIELDS_FAILED = 'GET_REQUIRED_FIELDS_FAILED';

export const SAVE_REQUIRED_FIELDS = 'SAVE_REQUIRED_FIELDS';
export const SAVE_REQUIRED_FIELDS_SUCCESS = 'SAVE_REQUIRED_FIELDS_SUCCESS';
export const SAVE_REQUIRED_FIELDS_FAILED = 'SAVE_REQUIRED_FIELDS_FAILED';

export const SET_JOB_ID = 'SET_JOB_ID';
export const JOB_CREATE_SUCCESS = 'JOB_CREATE_SUCCESS';

export const GET_JOB_CATEGORIES = 'GET_JOB_CATEGORIES';
export const GET_JOB_CATEGORIES_SUCCESS = 'GET_JOB_CATEGORIES_SUCCESS';
export const GET_JOB_CATEGORIES_FAILED = 'GET_JOB_CATEGORIES_FAILED';

export const GET_JOB_SKILLS = 'GET_JOB_SKILLS';
export const GET_JOB_SKILLS_SUCCESS = 'GET_JOB_SKILLS_SUCCESS';
export const GET_JOB_SKILLS_FAILED = 'GET_JOB_SKILLS_FAILED';

export const GET_JOB_COUNTRIES = 'GET_JOB_COUNTRIES';
export const GET_JOB_COUNTRIES_SUCCESS = 'GET_JOB_COUNTRIES_SUCCESS';
export const GET_JOB_COUNTRIES_FAILED = 'GET_JOB_COUNTRIES_FAILED';

export const GET_JOB_TEMPLATES = 'GET_JOB_TEMPLATES';
export const GET_JOB_TEMPLATES_SUCCESS = 'GET_JOB_TEMPLATES_SUCCESS';
export const GET_JOB_TEMPLATES_FAILED = 'GET_JOB_TEMPLATES_FAILED';

export const GET_JOBS = 'GET_JOBS';
export const GET_JOBS_SUCCESS = 'GET_JOBS_SUCCESS';
export const GET_JOBS_FAILED = 'GET_JOBS_FAILED';

export const DUPLICATE_JOB = 'DUPLICATE_JOB';
export const DUPLICATE_JOB_SUCCESS = 'DUPLICATE_JOB_SUCCESS';
export const DUPLICATE_JOB_FAILED = 'DUPLICATE_JOB_FAILED';
export const RESET_DUPLICATED = 'RESET_DUPLICATED';

export const DELETE_JOB = 'DELETE_JOB';
export const DELETE_JOB_SUCCESS = 'DELETE_JOB_SUCCESS';
export const DELETE_JOB_FAILED = 'DELETE_JOB_FAILED';

export const EJ_DELETE_SCREENING = 'EJ_DELETE_SCREENING';
export const EJ_DELETE_SCREENING_SUCCESS = 'EJ_DELETE_SCREENING_SUCCESS';
export const EJ_DELETE_SCREENING_FAILED = 'EJ_DELETE_SCREENING_FAILED';

export const PIN_UNPIN_JOB = 'PIN_UNPIN_JOB';
export const PIN_UNPIN_JOB_SUCCESS = 'PIN_UNPIN_JOB_SUCCESS';
export const PIN_UNPIN_JOB_FAILED = 'PIN_UNPIN_JOB_FAILED';

export const SAVE_CREATED_STATE = 'SAVE_CREATED_STATE';
export const SAVE_CREATED_STATE_SUCCESS = 'SAVE_CREATED_STATE_SUCCESS';
export const SAVE_CREATED_STATE_FAILED = 'SAVE_CREATED_STATE_FAILED';

export const SAVE_CREATED_CITY = 'SAVE_CREATED_CITY';
export const SAVE_CREATED_CITY_SUCCESS = 'SAVE_CREATED_CITY_SUCCESS';
export const SAVE_CREATED_CITY_FAILED = 'SAVE_CREATED_CITY_FAILED';

export const RESET_DATA = 'RESET_DATA';

export function getJobCreateMeta() {
  return {
    type: GET_JOB_CREATE_META,
  };
}

export function saveInformation(data) {
  return {
    type: SAVE_INFORMATION,
    data,
  };
}

export function getScreeningQuestionMeta() {
  return {
    type: GET_SCREENING_QUESTION_META,
  };
}

export function saveQuestions(jobId, questions, description, instruction) {
  return {
    type: SAVE_QUESTIONS,
    jobId,
    questions,
    description,
    instruction,
  };
}

export function getQuizMeta() {
  return {
    type: GET_QUIZ_META,
  };
}

export function saveQuiz(jobId, data) {
  return {
    type: SAVE_QUIZ,
    jobId,
    data,
  };
}

export function changeStatus(jobId, status) {
  return {
    type: CHANGE_STATUS,
    jobId,
    status,
  };
}

export function getBasiInfo(jobId) {
  return {
    type: GET_JOB_BASIC_INFO,
    jobId,
  };
}

export function getQuestions(jobId) {
  return {
    type: GET_QUESTIONS,
    jobId,
  };
}

export function getQuiz(jobId) {
  return {
    type: GET_QUIZ,
    jobId,
  };
}

export function updateJobInfo(jobId, data) {
  return {
    type: UPDATE_JOB,
    jobId,
    data,
  };
}

export function getJobRequiredFields(jobId) {
  return {
    type: GET_REQUIRED_FIELDS,
    jobId,
  };
}

export function saveJobRequiredFields(jobId, data, hasRedirect) {
  return {
    type: SAVE_REQUIRED_FIELDS,
    jobId,
    data,
    hasRedirect,
  };
}

export function setJobId(jobId) {
  return {
    type: SET_JOB_ID,
    jobId,
  };
}

export function getJobCategories() {
  return {
    type: GET_JOB_CATEGORIES,
  };
}

export function getJobSkills() {
  return {
    type: GET_JOB_SKILLS,
  };
}

export function getJobCountries() {
  return {
    type: GET_JOB_COUNTRIES,
  };
}

export function getJobTemplates(params) {
  return {
    type: GET_JOB_TEMPLATES,
    params,
  };
}

export function getJobs(job_type, params) {
  return {
    type: GET_JOBS,
    job_type,
    params,
  };
}

export function duplicateJob(job_id) {
  return {
    type: DUPLICATE_JOB,
    job_id,
  };
}

export function resetDuplicateJob() {
  return {
    type: RESET_DUPLICATED,
  };
}

export function deleteJob(params) {
  return {
    type: DELETE_JOB,
    params,
  };
}

export function deleteScreening(jobId, tab) {
  return {
    type: EJ_DELETE_SCREENING,
    jobId,
    tab,
  };
}

export function resetData(keys) {
  return {
    type: RESET_DATA,
    keys,
  };
}

export function pinUnpinnedJob(data) {
  return {
    type: PIN_UNPIN_JOB,
    payload: { ...data },
  };
}

export function saveCreatedState(country, state) {
  return {
    type: SAVE_CREATED_STATE,
    payload: { country, state },
  };
}

export function saveCreatedCity(country, state, city) {
  return {
    type: SAVE_CREATED_CITY,
    payload: { country, state, city },
  };
}
