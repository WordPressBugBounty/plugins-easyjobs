import { all, put, takeLatest } from 'redux-saga/effects';
import { ajaxCall } from '../../util/ajaxCall';
import {
  GET_ALL_QUESTION,
  GET_ALL_QUESTION_SUCCESS,
  GET_ALL_QUESTION_FAILED,
  DELETE_QUESTION,
  DELETE_QUESTION_SUCCESS,
  DELETE_QUESTION_FAILED,
  SAVE_QUESTION,
  SAVE_QUESTION_SUCCESS,
  SAVE_QUESTION_FAILED,
  GET_QUESTION,
  GET_QUESTION_SUCCESS,
  GET_QUESTION_FAILED,
  DUPLICATE_QUESTION,
  DUPLICATE_QUESTION_FAILED,
  DUPLICATE_QUESTION_SUCCESS,
  SAVE_ASSESSMENT_SUCCESS,
  SAVE_ASSESSMENT,
  SAVE_ASSESSMENT_FAILED,
  GET_ASSESSMENT,
  GET_ASSESSMENT_SUCCESS,
  GET_ASSESSMENT_FAILED,
} from '../actions/evaluationActions';

export function* questions({ params }) {
  const response = yield ajaxCall('easyjobs_get_evaluation_question', {
    ...params,
  });
  if (response.status === 'success') {
    yield put({
      type: GET_ALL_QUESTION_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_ALL_QUESTION_FAILED,
      error: response.error,
    });
  }
}
export function* allQuestion() {
  yield takeLatest(GET_ALL_QUESTION, questions);
}

export function* remove({ params }) {
  const response = yield ajaxCall('easyjobs_delete_evaluation_question', {
    ...params,
  });
  let params2 = {};
  if (params?.type === 'delete_assessment') {
    params2 = { type: 'assessments' };
  }
  const response2 = yield ajaxCall('easyjobs_get_evaluation_question', {
    ...params2,
  });
  if (response.status === 'success') {
    yield put({
      type: DELETE_QUESTION_SUCCESS,
      message: response?.message,
    });
    yield put({
      type: GET_ALL_QUESTION_SUCCESS,
      data: response2.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: DELETE_QUESTION_FAILED,
      message: response.message,
    });
    yield put({
      type: GET_ALL_QUESTION_FAILED,
      error: response2.error,
    });
  }
}
export function* deleteQuestion() {
  yield takeLatest(DELETE_QUESTION, remove);
}

export function* save({ params }) {
  const response = yield ajaxCall('easyjobs_save_question', {
    ...params,
  });
  if (response.status === 'success') {
    yield put({
      type: SAVE_QUESTION_SUCCESS,
      message: response.message,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_QUESTION_FAILED,
      message: response.message,
    });
  }
}
export function* saveQuestion() {
  yield takeLatest(SAVE_QUESTION, save);
}

export function* get({ id }) {
  const response = yield ajaxCall('easyjobs_get_question', {
    id,
  });
  if (response.status === 'success') {
    yield put({
      type: GET_QUESTION_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_QUESTION_FAILED,
      error: response.error,
    });
  }
}
export function* getQuestion() {
  yield takeLatest(GET_QUESTION, get);
}

export function* duplicate({ id }) {
  const response = yield ajaxCall('easyjobs_duplicate_question', {
    id,
  });
  if (response.status === 'success') {
    yield put({
      type: DUPLICATE_QUESTION_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: DUPLICATE_QUESTION_FAILED,
      message: response.message,
    });
  }
}
export function* duplicateQuestion() {
  yield takeLatest(DUPLICATE_QUESTION, duplicate);
}

export function* doSave({ params }) {
  const response = yield ajaxCall('easyjobs_save_assessment', {
    ...params,
  });
  if (response.status === 'success') {
    yield put({
      type: SAVE_ASSESSMENT_SUCCESS,
      message: response.message,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_ASSESSMENT_FAILED,
      message: response.message,
    });
  }
}
export function* saveAssessment() {
  yield takeLatest(SAVE_ASSESSMENT, doSave);
}

export function* assessment({ id }) {
  const response = yield ajaxCall('easyjobs_get_assessment', {
    id,
  });
  if (response.status === 'success') {
    yield put({
      type: GET_ASSESSMENT_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_ASSESSMENT_FAILED,
      error: response.error,
    });
  }
}
export function* getAssessment() {
  yield takeLatest(GET_ASSESSMENT, assessment);
}

export default function* rootSaga() {
  yield all([
    allQuestion(),
    deleteQuestion(),
    saveQuestion(),
    getQuestion(),
    duplicateQuestion(),
    saveAssessment(),
    getAssessment(),
  ]);
}
