import { all, put, takeLatest } from 'redux-saga/effects';
import { ajaxCall } from '../../util/ajaxCall';
import {
  CONNECT_API_KEY,
  CONNECT_API_KEY_FAILED,
  CONNECT_API_KEY_SUCCESS,
  CREATE_COMPANY,
  CREATE_COMPANY_FAILED,
  CREATE_COMPANY_SUCCESS,
  SIGN_IN,
  SIGN_IN_FAILED,
  SIGN_IN_SUCCESS,
  SIGN_UP,
  SIGN_UP_FAILED,
  SIGN_UP_SUCCESS,
} from '../actions/landingActions';

export function* accountSignIn({ data }) {
  const response = yield ajaxCall('easyjobs_signin', { data });
  if (response.status === 'success') {
    yield put({
      type: SIGN_IN_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SIGN_IN_FAILED,
      error: response.error,
      message: response.message,
    });
  }
}

export function* signIn() {
  yield takeLatest(SIGN_IN, accountSignIn);
}

export function* connectWithApiKey({ apiKey }) {
  const response = yield ajaxCall('easyjobs_connect_api', { apikey: apiKey });
  if (response.status === 'success') {
    yield put({
      type: CONNECT_API_KEY_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: CONNECT_API_KEY_FAILED,
      error: response.error,
      message: response.message,
    });
  }
}

export function* connectApiKey() {
  yield takeLatest(CONNECT_API_KEY, connectWithApiKey);
}

export function* accountSIgnUp({ data }) {
  const response = yield ajaxCall('easyjobs_signup', { form_data: data });
  if (response.status === 'success') {
    yield put({
      type: SIGN_UP_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SIGN_UP_FAILED,
      error: response.errors,
      message: response.message,
    });
  }
}

export function* signUp() {
  yield takeLatest(SIGN_UP, accountSIgnUp);
}

export function* createCompany({ data }) {
  const response = yield ajaxCall('easyjobs_create_company', { ...data });
  if (response.status === 'success') {
    yield put({
      type: CREATE_COMPANY_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: CREATE_COMPANY_FAILED,
      error: response.errors,
      message: response.message,
    });
  }
}

export function* companyCreate() {
  yield takeLatest(CREATE_COMPANY, createCompany);
}

export default function* rootSaga() {
  yield all([signIn(), connectApiKey(), signUp(), companyCreate()]);
}
