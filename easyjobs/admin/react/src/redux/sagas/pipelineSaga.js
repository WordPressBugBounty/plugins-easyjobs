import { all, put, takeLatest } from 'redux-saga/effects';
import { ajaxCall } from '../../util/ajaxCall';
import {
  GET_ALL_PIPELINE,
  GET_ALL_PIPELINE_SUCCESS,
  GET_ALL_PIPELINE_FAILED,
  GET_PIPELINE_TEMPLATES,
  GET_PIPELINE_TEMPLATES_SUCCESS,
  GET_PIPELINE_TEMPLATES_FAILED,
  CHANGE_PIPELINE,
  CHANGE_PIPELINE_SUCCESS,
  CHANGE_PIPELINE_FAILED,
  SAVE_PIPELINE,
  SAVE_PIPELINE_SUCCESS,
  SAVE_PIPELINE_FAILED,
} from '../actions/pipelineActions';

export function* pipelines({ params }) {
  const response = yield ajaxCall('easyjobs_get_pipeline', {
    ...params,
  });

  if (response.status === 'success') {
    yield put({
      type: GET_ALL_PIPELINE_SUCCESS,
      data: response.data,
      job: response?.job,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_ALL_PIPELINE_FAILED,
      error: response.error,
    });
  }
}
export function* allPipelines() {
  yield takeLatest(GET_ALL_PIPELINE, pipelines);
}

export function* pipelineTemplates() {
  const response = yield ajaxCall('easyjobs_get_pipeline_templates');

  if (response.status === 'success') {
    yield put({
      type: GET_PIPELINE_TEMPLATES_SUCCESS,
      data: response?.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_PIPELINE_TEMPLATES_FAILED,
      error: response?.error,
    });
  }
}
export function* allPipelineTemplates() {
  yield takeLatest(GET_PIPELINE_TEMPLATES, pipelineTemplates);
}

export function* doChangePipeline({ params }) {
  const response = yield ajaxCall('easyjobs_change_pipeline', {
    ...params,
  });
  const { job_id } = params;
  const response2 = yield ajaxCall('easyjobs_get_pipeline', {
    job_id,
  });

  if (response.status === 'success') {
    yield put({
      type: CHANGE_PIPELINE_SUCCESS,
      data: response.data,
    });
    yield put({
      type: GET_ALL_PIPELINE_SUCCESS,
      data: response2?.data,
      job: response2?.job,
    });
  } else if (response.status === 'error') {
    yield put({
      type: CHANGE_PIPELINE_FAILED,
      error: response.error,
    });
    yield put({
      type: GET_ALL_PIPELINE_FAILED,
      error: response2.error,
    });
  }
}
export function* changePipeline() {
  yield takeLatest(CHANGE_PIPELINE, doChangePipeline);
}

export function* savePipeline({ params }) {
  const response = yield ajaxCall('easyjobs_save_pipeline', {
    ...params,
  });
  const { job_id } = params;
  const response2 = yield ajaxCall('easyjobs_get_pipeline', {
    job_id,
  });

  if (response.status === 'success') {
    yield put({
      type: SAVE_PIPELINE_SUCCESS,
      data: response.data,
    });
    yield put({
      type: GET_ALL_PIPELINE_SUCCESS,
      data: response2.data,
      job: response2?.job,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_PIPELINE_FAILED,
      error: response.error,
    });
    yield put({
      type: GET_ALL_PIPELINE_FAILED,
      error: response2.error,
    });
  }
}
export function* savedPipelines() {
  yield takeLatest(SAVE_PIPELINE, savePipeline);
}

export default function* rootSaga() {
  yield all([
    allPipelines(),
    allPipelineTemplates(),
    changePipeline(),
    savedPipelines(),
  ]);
}
