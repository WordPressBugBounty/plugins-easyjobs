import { all, put, takeLatest } from 'redux-saga/effects';
import { ajaxCall } from '../../util/ajaxCall';
import {
  GET_JOB_CREATE_META,
  GET_JOB_CREATE_META_SUCCESS,
  GET_JOB_CREATE_META_FAILED,
  SAVE_INFORMATION_SUCCESS,
  SAVE_INFORMATION_FAILED,
  SAVE_INFORMATION,
  GET_SCREENING_QUESTION_META_SUCCESS,
  GET_SCREENING_QUESTION_META_FAILED,
  GET_SCREENING_QUESTION_META,
  SAVE_QUESTIONS_SUCCESS,
  SAVE_QUESTIONS_FAILED,
  SAVE_QUESTIONS,
  GET_QUIZ_META_SUCCESS,
  GET_QUIZ_META_FAILED,
  GET_QUIZ_META,
  SAVE_QUIZ_SUCCESS,
  SAVE_QUIZ,
  SAVE_QUIZ_FAILED,
  CHANGE_STATUS_SUCCESS,
  CHANGE_STATUS_FAILED,
  CHANGE_STATUS,
  GET_JOB_BASIC_INFO_SUCCESS,
  GET_JOB_BASIC_INFO_FAILED,
  GET_JOB_BASIC_INFO,
  GET_QUESTIONS_SUCCESS,
  GET_QUESTIONS_FAILED,
  GET_QUIZ_SUCCESS,
  GET_QUIZ_FAILED,
  GET_QUIZ,
  GET_QUESTIONS,
  UPDATE_JOB_SUCCESS,
  UPDATE_JOB_FAILED,
  UPDATE_JOB,
  GET_REQUIRED_FIELDS_SUCCESS,
  GET_REQUIRED_FIELDS_FAILED,
  GET_REQUIRED_FIELDS,
  SAVE_REQUIRED_FIELDS_SUCCESS,
  SAVE_REQUIRED_FIELDS_FAILED,
  SAVE_REQUIRED_FIELDS,
  SET_JOB_ID,
  GET_JOB_CATEGORIES_SUCCESS,
  GET_JOB_CATEGORIES_FAILED,
  GET_JOB_CATEGORIES,
  GET_JOB_SKILLS_SUCCESS,
  GET_JOB_SKILLS_FAILED,
  GET_JOB_SKILLS,
  GET_JOB_COUNTRIES_SUCCESS,
  GET_JOB_COUNTRIES_FAILED,
  GET_JOB_COUNTRIES,
  GET_JOB_TEMPLATES,
  GET_JOB_TEMPLATES_SUCCESS,
  GET_JOB_TEMPLATES_FAILED,
  GET_JOBS_SUCCESS,
  GET_JOBS_FAILED,
  GET_JOBS,
  DUPLICATE_JOB_SUCCESS,
  DUPLICATE_JOB_FAILED,
  DUPLICATE_JOB,
  DELETE_JOB,
  DELETE_JOB_SUCCESS,
  DELETE_JOB_FAILED,
  EJ_DELETE_SCREENING,
  EJ_DELETE_SCREENING_SUCCESS,
  EJ_DELETE_SCREENING_FAILED,
  PIN_UNPIN_JOB,
  PIN_UNPIN_JOB_SUCCESS,
  PIN_UNPIN_JOB_FAILED,
  SAVE_CREATED_STATE,
  SAVE_CREATED_STATE_SUCCESS,
  SAVE_CREATED_STATE_FAILED,
  SAVE_CREATED_CITY,
  SAVE_CREATED_CITY_SUCCESS,
  SAVE_CREATED_CITY_FAILED,
} from '../actions/jobActions';

import {
  GET_CITIES,
  GET_CITIES_FAILED,
  GET_CITIES_SUCCESS,
  GET_STATES,
  GET_STATES_FAILED,
  GET_STATES_SUCCESS,
} from '../actions/addressActions';

export function* getJobCreateMeta() {
  const response = yield ajaxCall('easyjobs_get_job_create_meta');
  if (response.status === 'success') {
    yield put({
      type: GET_JOB_CREATE_META_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_JOB_CREATE_META_FAILED,
      error: response.error,
    });
  }
}

export function* jobCreateMeta() {
  yield takeLatest(GET_JOB_CREATE_META, getJobCreateMeta);
}

export function* getStates({ country }) {
  const response = yield ajaxCall('easyjobs_get_states', { country });
  if (response.status === 'success') {
    yield put({
      type: GET_STATES_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_STATES_FAILED,
      error: response.error,
    });
  }
}
export function* states() {
  yield takeLatest(GET_STATES, getStates);
}

export function* getCities({ country, state }) {
  const response = yield ajaxCall('easyjobs_get_cities', { country, state });
  if (response.status === 'success') {
    yield put({
      type: GET_CITIES_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_CITIES_FAILED,
      error: response.error,
    });
  }
}
export function* cities() {
  yield takeLatest(GET_CITIES, getCities);
}

export function* saveJobInformation({ data }) {
  const response = yield ajaxCall('easyjobs_save_job_information', data);
  if (response.status === 'success') {
    yield put({
      type: SAVE_INFORMATION_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_INFORMATION_FAILED,
      error: response.error,
    });
  }
}
export function* saveInformation() {
  yield takeLatest(SAVE_INFORMATION, saveJobInformation);
}

export function* getScreeningQuestionMeta({ data }) {
  const response = yield ajaxCall('easyjobs_get_screening_question_meta', data);
  if (response.status === 'success') {
    yield put({
      type: GET_SCREENING_QUESTION_META_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_SCREENING_QUESTION_META_FAILED,
      error: response.error,
    });
  }
}
export function* screeningQuestionMeta() {
  yield takeLatest(GET_SCREENING_QUESTION_META, getScreeningQuestionMeta);
}

export function* saveJobQuestions({
  jobId,
  questions,
  description,
  instruction,
}) {
  const response = yield ajaxCall('easyjobs_save_screening_questions', {
    job_id: jobId,
    questions: questions,
    internal_note: description,
    note: instruction,
  });
  if (response.status === 'success') {
    yield put({
      type: SAVE_QUESTIONS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_QUESTIONS_FAILED,
      error: response.message,
    });
  }
}
export function* saveQuestions() {
  yield takeLatest(SAVE_QUESTIONS, saveJobQuestions);
}

export function* getQuizMeta() {
  const response = yield ajaxCall('easyjobs_get_quiz_meta');
  if (response.status === 'success') {
    yield put({
      type: GET_QUIZ_META_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_QUIZ_META_FAILED,
      error: response.error,
    });
  }
}
export function* quizMeta() {
  yield takeLatest(GET_QUIZ_META, getQuizMeta);
}

export function* saveJobQuiz({ jobId, data }) {
  const response = yield ajaxCall('easyjobs_save_quiz', {
    job_id: jobId,
    form_data: data,
  });
  if (response.status === 'success') {
    yield put({
      type: SAVE_QUIZ_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_QUIZ_FAILED,
      error: response.message,
    });
  }
}
export function* saveQuiz() {
  yield takeLatest(SAVE_QUIZ, saveJobQuiz);
}

export function* changeJobStatus({ jobId, status }) {
  const response = yield ajaxCall('easyjobs_change_job_status', {
    job_id: jobId,
    status,
  });
  if (response.status === 'success') {
    yield put({
      type: CHANGE_STATUS_SUCCESS,
      data: response.data,
      jobStatus: status,
      message: response.message,
    });
  } else if (response.status === 'error') {
    yield put({
      type: CHANGE_STATUS_FAILED,
      error: response.message,
    });
  }
}
export function* changeStatus() {
  yield takeLatest(CHANGE_STATUS, changeJobStatus);
}

export function* getBasicInfo({ jobId }) {
  const response = yield ajaxCall('easyjobs_get_job_data', {
    job_id: jobId,
    type: 'basic',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_JOB_BASIC_INFO_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_JOB_BASIC_INFO_FAILED,
      error: response.error,
    });
  }
}
export function* basicInfo() {
  yield takeLatest(GET_JOB_BASIC_INFO, getBasicInfo);
}

export function* getQuestions({ jobId }) {
  const response = yield ajaxCall('easyjobs_get_job_data', {
    job_id: jobId,
    type: 'screening',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_QUESTIONS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_QUESTIONS_FAILED,
      error: response.error,
    });
  }
}
export function* questions() {
  yield takeLatest(GET_QUESTIONS, getQuestions);
}

export function* getQuiz({ jobId }) {
  const response = yield ajaxCall('easyjobs_get_job_data', {
    job_id: jobId,
    type: 'quiz',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_QUIZ_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_QUIZ_FAILED,
      error: response.message,
    });
  }
}
export function* quiz() {
  yield takeLatest(GET_QUIZ, getQuiz);
}

export function* updateJobInfo({ jobId, data }) {
  const response = yield ajaxCall('easyjobs_save_job_information', {
    ...data,
    job_id: jobId,
  });
  if (response.status === 'success') {
    yield put({
      type: UPDATE_JOB_SUCCESS,
      data: response.data,
      updatedData: data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: UPDATE_JOB_FAILED,
      error: response.error,
    });
  }
}
export function* updateInfo() {
  yield takeLatest(UPDATE_JOB, updateJobInfo);
}

export function* getRequiredFields({ jobId }) {
  const response = yield ajaxCall('easyjobs_get_job_data', {
    job_id: jobId,
    type: 'required-fields',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_REQUIRED_FIELDS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_REQUIRED_FIELDS_FAILED,
      error: response.error,
    });
  }
}
export function* requiredFields() {
  yield takeLatest(GET_REQUIRED_FIELDS, getRequiredFields);
}

export function* saveRequiredFields({ jobId, data, hasRedirect }) {
  const response = yield ajaxCall('easyjobs_save_required_fields', {
    job_id: jobId,
    data,
  });
  if (response.status === 'success') {
    yield put({
      type: SAVE_REQUIRED_FIELDS_SUCCESS,
      data: response.data,
      hasRedirect,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_REQUIRED_FIELDS_FAILED,
      error: response.error,
    });
  }
}
export function* saveFields() {
  yield takeLatest(SAVE_REQUIRED_FIELDS, saveRequiredFields);
}

export function* getCategories() {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'categories',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_JOB_CATEGORIES_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_JOB_CATEGORIES_FAILED,
      error: response.error,
    });
  }
}
export function* categories() {
  yield takeLatest(GET_JOB_CATEGORIES, getCategories);
}

export function* getSkills() {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'skills',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_JOB_SKILLS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_JOB_SKILLS_FAILED,
      error: response.error,
    });
  }
}
export function* skills() {
  yield takeLatest(GET_JOB_SKILLS, getSkills);
}

export function* getCountries() {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'country',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_JOB_COUNTRIES_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_JOB_COUNTRIES_FAILED,
      error: response.error,
    });
  }
}
export function* countries() {
  yield takeLatest(GET_JOB_COUNTRIES, getCountries);
}

export function* getJobTemplates({ params }) {
  const response = yield ajaxCall('easyjobs_get_initial_job_templates', {
    industry_id: params.industry_id ? params.industry_id : '',
    title: params.title,
    page: params.page,
  });
  if (response.status === 'success') {
    yield put({
      type: GET_JOB_TEMPLATES_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_JOB_TEMPLATES_FAILED,
      error: response.error,
    });
  }
}
export function* jobTemplates() {
  yield takeLatest(GET_JOB_TEMPLATES, getJobTemplates);
}
export function* getJobs({ job_type, params }) {
  let response;
  if (params?.search === '') {
    delete params?.search;
    response = yield ajaxCall('easyjobs_get_jobs', {
      job_type,
      ...params,
    });
  } else {
    response = yield ajaxCall('easyjobs_search_jobs', {
      job_type,
      ...params,
    });
  }
  if (response.status === 'success') {
    yield put({
      type: GET_JOBS_SUCCESS,
      data: response.data || response.jobs,
      job_type,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_JOBS_FAILED,
      error: response.error,
      message: response.message,
      job_type,
    });
  }
}
export function* jobs() {
  yield takeLatest(GET_JOBS, getJobs);
}

export function* jobDuplicate({ job_id }) {
  const response = yield ajaxCall('easyjobs_duplicate_job', {
    job_id,
  });
  if (response.status === 'success') {
    yield put({
      type: DUPLICATE_JOB_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: DUPLICATE_JOB_FAILED,
      error: response.error,
      message: response.message,
    });
  }
}
export function* duplicate() {
  yield takeLatest(DUPLICATE_JOB, jobDuplicate);
}

export function* deleteJob({ params }) {
  const response = yield ajaxCall('easyjobs_delete_job', {
    ...params,
  });

  if (response.status === 'success') {
    yield put({
      type: DELETE_JOB_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: DELETE_JOB_FAILED,
      error: response.error,
    });
  }
}
export function* deleteJobInit() {
  yield takeLatest(DELETE_JOB, deleteJob);
}

export function* deleteScreeningQuiz({ jobId, tab }) {
  const response = yield ajaxCall('easyjobs_delete_screening_quiz', {
    jobId,
    _method: 'DELETE',
    tab,
  });
  if (response.status === 'success') {
    yield put({
      type: EJ_DELETE_SCREENING_SUCCESS,
      data: response.data,
      message: response.message,
    });
  } else if (response.status === 'error') {
    yield put({
      type: EJ_DELETE_SCREENING_FAILED,
      message: response.message,
    });
  }
}
export function* deleteScreeningInit() {
  yield takeLatest(EJ_DELETE_SCREENING, deleteScreeningQuiz);
}

export function* pinUnpin({ payload }) {
  const response = yield ajaxCall('easyjobs_pin_unpin_job', {
    ...payload,
  });
  if (response.status === 'success') {
    yield put({
      type: PIN_UNPIN_JOB_SUCCESS,
      data: response.data,
      message: response.message,
    });
  } else if (response.status === 'error') {
    yield put({
      type: PIN_UNPIN_JOB_FAILED,
      message: response.message,
    });
  }
}
export function* pinUnpinJob() {
  yield takeLatest(PIN_UNPIN_JOB, pinUnpin);
}

export function* createState({ payload }) {
  const response = yield ajaxCall('easyjobs_save_create_state', {
    ...payload,
  });
  if (response.status === 'success') {
    yield put({
      type: SAVE_CREATED_STATE_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_CREATED_STATE_FAILED,
      message: response.message,
    });
  }
}
export function* newState() {
  yield takeLatest(SAVE_CREATED_STATE, createState);
}

export function* createCity({ payload }) {
  const response = yield ajaxCall('easyjobs_save_create_city', {
    ...payload,
  });
  if (response.status === 'success') {
    yield put({
      type: SAVE_CREATED_CITY_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_CREATED_CITY_FAILED,
      message: response.message,
    });
  }
}
export function* newCity() {
  yield takeLatest(SAVE_CREATED_CITY, createCity);
}

export default function* rootSaga() {
  yield all([
    jobCreateMeta(),
    states(),
    cities(),
    saveInformation(),
    screeningQuestionMeta(),
    saveQuestions(),
    quizMeta(),
    saveQuiz(),
    changeStatus(),
    basicInfo(),
    questions(),
    quiz(),
    updateInfo(),
    requiredFields(),
    saveFields(),
    categories(),
    skills(),
    countries(),
    jobTemplates(),
    jobs(),
    duplicate(),
    deleteJobInit(),
    deleteScreeningInit(),
    pinUnpinJob(),
    newState(),
    newCity(),
  ]);
}
