import { all, put, takeLatest } from 'redux-saga/effects';
import { ajaxCall } from '../../util/ajaxCall';
import {
  GET_COUNTRIES,
  GET_COUNTRIES_FAILED,
  GET_COUNTRIES_SUCCESS,
  GET_STATES,
  GET_STATES_FAILED,
  GET_STATES_SUCCESS,
  GET_CITIES,
  GET_CITIES_FAILED,
  GET_CITIES_SUCCESS,
} from '../actions/addressActions';
export function* getCountries() {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'country',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_COUNTRIES_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_COUNTRIES_FAILED,
      error: response.error,
    });
  }
}

export function* countries() {
  yield takeLatest(GET_COUNTRIES, getCountries);
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

export default function* rootSaga() {
  yield all([countries(), states(), cities()]);
}
