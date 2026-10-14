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
  DUPLICATE_QUESTION_SUCCESS,
  DUPLICATE_QUESTION_FAILED,
  DUPLICATE_RESET_QUESTION,
  SAVE_ASSESSMENT,
  SAVE_ASSESSMENT_SUCCESS,
  SAVE_ASSESSMENT_FAILED,
  GET_ASSESSMENT,
  GET_ASSESSMENT_SUCCESS,
  GET_ASSESSMENT_FAILED,
  RESET_EDIT,
  RESET_ERRORS,
} from '../actions/evaluationActions';
import { toast } from 'react-toastify';

const initialState = {
  allQuestion: undefined,
  loading: undefined,
  deleteLoading: undefined,
  saveLoading: undefined,
  questionSet: undefined,
  editLoading: undefined,
  duplicateLoading: undefined,
  duplicated: undefined,
  created: undefined,
  saveErrors: undefined,
};

export default function evaluation(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_QUESTION:
      return {
        ...state,
        allQuestion: undefined,
        loading: true,
      };
    case GET_ALL_QUESTION_SUCCESS:
      return {
        ...state,
        allQuestion: action?.data,
        loading: false,
      };
    case GET_ALL_QUESTION_FAILED:
      return {
        ...state,
        allQuestion: undefined,
        loading: false,
      };
    case DELETE_QUESTION:
      return {
        ...state,
        deleteLoading: true,
      };
    case DELETE_QUESTION_SUCCESS:
      toast.success(
        (action?.message && action.message) || 'Deleted Question Set',
      );
      return {
        ...state,
        deleteLoading: false,
      };
    case DELETE_QUESTION_FAILED:
      toast.error(
        (action?.message && action.message) || 'Failed to delete Question Set',
      );
      return {
        ...state,
        deleteLoading: false,
      };
    case SAVE_QUESTION:
      return {
        ...state,
        saveLoading: true,
        created: false,
        saveErrors: undefined,
      };
    case SAVE_QUESTION_SUCCESS:
      toast.success((action?.message && action.message) || 'Question saved');
      return {
        ...state,
        saveLoading: false,
        created: true,
        saveErrors: undefined,
      };
    case SAVE_QUESTION_FAILED:
      toast.error(
        (action?.message && action.message) || 'Question save failed',
      );
      return {
        ...state,
        saveLoading: false,
        created: false,
        saveErrors: action.message,
      };
    case GET_QUESTION:
      return {
        ...state,
        questionSet: undefined,
        editLoading: true,
      };
    case GET_QUESTION_SUCCESS:
      return {
        ...state,
        questionSet: action.data,
        editLoading: false,
      };
    case GET_QUESTION_FAILED:
      return {
        ...state,
        questionSet: undefined,
        editLoading: false,
      };
    case DUPLICATE_QUESTION:
      return {
        ...state,
        duplicateLoading: true,
        duplicated: undefined,
      };
    case DUPLICATE_QUESTION_SUCCESS:
      return {
        ...state,
        duplicateLoading: false,
        duplicated: action?.data,
      };
    case DUPLICATE_QUESTION_FAILED:
      toast.error(
        action?.message?.length
          ? action.message
          : 'Unable to duplicate question set',
      );
      return {
        ...state,
        duplicateLoading: false,
        duplicated: undefined,
      };
    case DUPLICATE_RESET_QUESTION:
      return {
        ...state,
        duplicateLoading: false,
        duplicated: undefined,
      };
    case SAVE_ASSESSMENT:
      return {
        ...state,
        saveLoading: true,
        created: false,
        saveErrors: undefined,
      };
    case SAVE_ASSESSMENT_SUCCESS:
      toast.success((action?.message && action.message) || 'Assessment saved');
      return {
        ...state,
        saveLoading: false,
        created: true,
        saveErrors: undefined,
      };
    case SAVE_ASSESSMENT_FAILED:
      // toast.error(
      //   (action?.message && action.message) || 'Assessment save failed'
      // );
      return {
        ...state,
        saveLoading: false,
        created: false,
        saveErrors: action.message,
      };
    case GET_ASSESSMENT:
      return {
        ...state,
        questionSet: undefined,
        editLoading: true,
      };
    case GET_ASSESSMENT_SUCCESS:
      return {
        ...state,
        questionSet: action.data,
        editLoading: false,
      };
    case GET_ASSESSMENT_FAILED:
      return {
        ...state,
        questionSet: undefined,
        editLoading: false,
      };
    case RESET_EDIT:
      return {
        ...state,
        created: undefined,
        questionSet: undefined,
      };
    case RESET_ERRORS:
      return {
        ...state,
        saveErrors: undefined,
      };
    default:
      return state;
  }
}
