export const GET_ALL_PIPELINE = 'GET_ALL_PIPELINE';
export const GET_ALL_PIPELINE_SUCCESS = 'GET_ALL_PIPELINE_SUCCESS';
export const GET_ALL_PIPELINE_FAILED = 'GET_ALL_PIPELINE_FAILED';

export const GET_PIPELINE_TEMPLATES = 'GET_PIPELINE_TEMPLATES';
export const GET_PIPELINE_TEMPLATES_SUCCESS = 'GET_PIPELINE_TEMPLATES_SUCCESS';
export const GET_PIPELINE_TEMPLATES_FAILED = 'GET_PIPELINE_TEMPLATES_FAILED';

export const CHANGE_PIPELINE = 'CHANGE_PIPELINE';
export const CHANGE_PIPELINE_SUCCESS = 'CHANGE_PIPELINE_SUCCESS';
export const CHANGE_PIPELINE_FAILED = 'CHANGE_PIPELINE_FAILED';

export const SAVE_PIPELINE = 'SAVE_PIPELINE';
export const SAVE_PIPELINE_SUCCESS = 'SAVE_PIPELINE_SUCCESS';
export const SAVE_PIPELINE_FAILED = 'SAVE_PIPELINE_FAILED';

export function getAllPipelines(params) {
  return {
    type: GET_ALL_PIPELINE,
    params,
  };
}

export function getPipelineTemplates() {
  return {
    type: GET_PIPELINE_TEMPLATES,
  };
}

export function changePipeline(params) {
  return {
    type: CHANGE_PIPELINE,
    params,
  };
}

export function savePipeline(params) {
  return {
    type: SAVE_PIPELINE,
    params,
  };
}
