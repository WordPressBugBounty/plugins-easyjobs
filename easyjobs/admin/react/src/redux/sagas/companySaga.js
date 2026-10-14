import { all, put, takeLatest } from 'redux-saga/effects';
import { ajaxCall } from '../../util/ajaxCall';
import {
  GET_BASIC_INFO,
  GET_BASIC_INFO_FAILED,
  GET_BASIC_INFO_SUCCESS,
  GET_COMPANY_METADATA,
  GET_COMPANY_METADATA_FAILED,
  GET_COMPANY_METADATA_SUCCESS,
  GET_MINIMAL_INFO,
  GET_MINIMAL_INFO_FAILED,
  GET_MINIMAL_INFO_SUCCESS,
  SYNC_COMPANY_INFO,
  SYNC_COMPANY_INFO_FAILED,
  SYNC_COMPANY_INFO_SUCCESS,
} from '../actions/companyActions';
import {
  GET_VERIFICATION_CODE_SUCCESS,
  GET_VERIFICATION_STATUS,
  GET_VERIFICATION_STATUS_FAILED,
  GET_VERIFICATION_STATUS_SUCCESS,
  SHOW_LIFE,
  SHOW_LIFE_FAILED,
  SHOW_LIFE_SUCCESS,
} from '../actions/settingsActions';

export function* getCompanyBasicInfo() {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'settings_basic_info',
  });

  if (response.status === 'success') {
    yield put({
      type: GET_BASIC_INFO_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_BASIC_INFO_FAILED,
      error: response.error,
    });
  }
}

export function* companyBasicInfo() {
  yield takeLatest(GET_BASIC_INFO, getCompanyBasicInfo);
}

export function* getCompanyMetadata() {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'settings_metadata',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_COMPANY_METADATA_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_COMPANY_METADATA_FAILED,
      error: response.error,
    });
  }
}

export function* companyMetadata() {
  yield takeLatest(GET_COMPANY_METADATA, getCompanyMetadata);
}

export function* getVerificationStatus({ status }) {
  const response = yield ajaxCall('easyjobs_get_verification_status', {
    show_life: status,
  });
  if (response.status === 'success') {
    yield put({
      type: GET_VERIFICATION_STATUS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_VERIFICATION_STATUS_FAILED,
      error: response.message,
    });
  }
}
export function* verificationStatus() {
  yield takeLatest(GET_VERIFICATION_STATUS, getVerificationStatus);
}

export function* getMinimalInfo() {
  const response = yield ajaxCall('easyjobs_get_minimal_company_info');
  if (response.status === 'success') {
    yield put({
      type: GET_MINIMAL_INFO_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_MINIMAL_INFO_FAILED,
      error: response.error,
    });
  }
}
export function* minimalInfo() {
  yield takeLatest(GET_MINIMAL_INFO, getMinimalInfo);
}

export function* syncCompanyInfo() {
  const response = yield ajaxCall('easyjobs_sync_data');
  if (response.status === 'success') {
    yield put({
      type: SYNC_COMPANY_INFO_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SYNC_COMPANY_INFO_FAILED,
      error: response.error,
    });
  }
}
export function* syncInfo() {
  yield takeLatest(SYNC_COMPANY_INFO, syncCompanyInfo);
}

export default function* rootSaga() {
  yield all([
    companyBasicInfo(),
    companyMetadata(),
    verificationStatus(),
    minimalInfo(),
    syncInfo(),
  ]);
}
