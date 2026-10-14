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
import { toast } from 'react-toastify';
import { getMessage } from '../../util/helper';

const initialState = {
  allPipeline: undefined,
  loading: undefined,
  allPipelineTemplates: undefined,
  pipelineJob: undefined,
  savedPipeline: undefined,
  loadingPipeline: undefined,
  loadingModal: undefined,
};

export default function pipeline(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_PIPELINE:
      return {
        ...state,
        allPipeline: undefined,
        pipelineJob: undefined,
        loading: true,
      };

    case GET_ALL_PIPELINE_SUCCESS:
      return {
        ...state,
        allPipeline: action.data,
        pipelineJob: action.job,
        loading: false,
      };

    case GET_ALL_PIPELINE_FAILED:
      return {
        ...state,
        allPipeline: undefined,
        pipelineJob: undefined,
        loading: false,
      };

    case GET_PIPELINE_TEMPLATES:
      return {
        ...state,
        allPipelineTemplates: undefined,
      };

    case GET_PIPELINE_TEMPLATES_SUCCESS:
      return {
        ...state,
        allPipelineTemplates: action?.data,
      };

    case GET_PIPELINE_TEMPLATES_FAILED:
      return {
        ...state,
        allPipelineTemplates: undefined,
      };

    case CHANGE_PIPELINE:
      return {
        ...state,
        loadingPipeline: true,
      };

    case CHANGE_PIPELINE_SUCCESS:
      return {
        ...state,
        loadingPipeline: false,
      };
    case CHANGE_PIPELINE_FAILED:
      return {
        ...state,
        loadingPipeline: false,
      };

    case SAVE_PIPELINE:
      return {
        ...state,
        savedPipeline: undefined,
        loadingModal: true,
      };

    case SAVE_PIPELINE_SUCCESS:
      toast.success(getMessage(action, 'Pipeline updated'), {
        autoClose: 1200,
      });
      return {
        ...state,
        savedPipeline: action?.data,
        loadingModal: false,
      };

    case SAVE_PIPELINE_FAILED:
      toast.error(getMessage(action, 'Unable to change template'), {
        autoClose: 1200,
      });
      return {
        ...state,
        savedPipeline: undefined,
        loadingModal: false,
      };

    default:
      return state;
  }
}
