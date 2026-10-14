import {
  CHANGE_STATUS,
  CHANGE_STATUS_FAILED,
  CHANGE_STATUS_SUCCESS,
  GET_JOB_BASIC_INFO,
  GET_JOB_BASIC_INFO_FAILED,
  GET_JOB_BASIC_INFO_SUCCESS,
  GET_JOB_TEMPLATES,
  GET_JOB_TEMPLATES_FAILED,
  GET_JOB_TEMPLATES_SUCCESS,
  GET_JOB_CATEGORIES,
  GET_JOB_CATEGORIES_FAILED,
  GET_JOB_CATEGORIES_SUCCESS,
  GET_JOB_COUNTRIES,
  GET_JOB_COUNTRIES_FAILED,
  GET_JOB_COUNTRIES_SUCCESS,
  GET_JOB_CREATE_META_SUCCESS,
  GET_JOB_SKILLS,
  GET_JOB_SKILLS_FAILED,
  GET_JOB_SKILLS_SUCCESS,
  GET_QUESTIONS,
  GET_QUESTIONS_FAILED,
  GET_QUESTIONS_SUCCESS,
  GET_QUIZ,
  GET_QUIZ_FAILED,
  GET_QUIZ_META,
  GET_QUIZ_META_FAILED,
  GET_QUIZ_META_SUCCESS,
  GET_QUIZ_SUCCESS,
  GET_REQUIRED_FIELDS,
  GET_REQUIRED_FIELDS_FAILED,
  GET_REQUIRED_FIELDS_SUCCESS,
  GET_SCREENING_QUESTION_META,
  GET_SCREENING_QUESTION_META_FAILED,
  GET_SCREENING_QUESTION_META_SUCCESS,
  JOB_CREATE_SUCCESS,
  JOB_PUBLISHED,
  SAVE_INFORMATION,
  SAVE_INFORMATION_FAILED,
  SAVE_INFORMATION_SUCCESS,
  SAVE_QUESTIONS,
  SAVE_QUESTIONS_FAILED,
  SAVE_QUESTIONS_SUCCESS,
  SAVE_QUIZ,
  SAVE_QUIZ_FAILED,
  SAVE_QUIZ_SUCCESS,
  SAVE_REQUIRED_FIELDS,
  SAVE_REQUIRED_FIELDS_FAILED,
  SAVE_REQUIRED_FIELDS_SUCCESS,
  SET_JOB_ID,
  UPDATE_JOB,
  UPDATE_JOB_FAILED,
  UPDATE_JOB_SUCCESS,
  GET_JOBS,
  GET_JOBS_SUCCESS,
  GET_JOBS_FAILED,
  DUPLICATE_JOB,
  DUPLICATE_JOB_SUCCESS,
  DUPLICATE_JOB_FAILED,
  RESET_DUPLICATED,
  DELETE_JOB,
  DELETE_JOB_SUCCESS,
  DELETE_JOB_FAILED,
  RESET_DATA,
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
  GET_CITIES_SUCCESS,
  GET_STATES,
  GET_STATES_FAILED,
  GET_STATES_SUCCESS,
} from '../actions/addressActions';
import { EMPTY_ERRORS } from '../actions/settingsActions';
import { toast } from 'react-toastify';
import { getJobTypeObjectKey } from '../../util/helper';

const initialState = {
  createData: undefined,
  countryStates: undefined,
  cities: undefined,
  saveJobInfoErrors: undefined,
  jobCreateErrors: undefined,
  saveJobInfo: false,
  loading: false,
  screeningMeta: undefined,
  questionSaved: false,
  quizMeta: undefined,
  quizSaved: false,
  jobPublished: false,
  creatingId: undefined,
  basicInfo: undefined,
  quiz: undefined,
  questions: undefined,
  requiredFields: undefined,
  requiredFieldsUpdated: undefined,
  requiredFieldsError: undefined,
  quizError: undefined,
  hasRedirect: undefined,
  jobCreated: undefined,
  jobStatus: undefined,
  statusMessage: undefined,
  categories: undefined,
  skills: undefined,
  countries: undefined,
  company: undefined,
  jobTemplates: undefined,
  publishedJobs: undefined,
  archivedJobs: undefined,
  draftJobs: undefined,
  allJobs: undefined,
  internalJobs: undefined,
  duplicated: undefined,
  jobDeleteLoading: undefined,
  jobDeleted: undefined,
  statusChanged: undefined,
  screeningQuizDeleted: undefined,
  isDeletedScreenQuiz: undefined,
  pinUnpinJobData: undefined,
  createdState: undefined,
  createdCity: undefined,
};

export default function jobs(state = initialState, action) {
  switch (action.type) {
    case GET_JOB_CREATE_META_SUCCESS:
      return {
        ...state,
        createData: { ...state.createData, ...action.data },
      };
    case GET_STATES:
      return {
        ...state,
        loading: true,
      };
    case GET_STATES_SUCCESS:
      return {
        ...state,
        countryStates: action.data,
        loading: false,
      };
    case GET_STATES_FAILED:
      return {
        ...state,
        loading: false,
      };
    case GET_CITIES:
      return {
        ...state,
        loading: true,
      };
    case GET_CITIES_SUCCESS:
      return {
        ...state,
        cities: action.data,
        loading: false,
      };
    case SAVE_INFORMATION:
      return {
        ...state,
        loading: true,
      };
    case SAVE_INFORMATION_SUCCESS:
      return {
        ...state,
        createData: { ...state.createData, editing: action.data },
        saveJobInfo: true,
        saveJobInfoErrors: undefined,
        loading: false,
        creatingId: action.data.id,
        basicInfo: action.data,
      };
    case SAVE_INFORMATION_FAILED:
      return {
        ...state,
        saveJobInfo: false,
        saveJobInfoErrors: action.error,
        loading: false,
        creatingId: undefined,
        statusMessage: {
          type: 'error',
          message:
            (action.error && action.error.global && action.error.global) ||
            'Save job failed, please check inputs',
        },
      };
    case GET_SCREENING_QUESTION_META:
      return {
        ...state,
        loading: true,
      };
    case GET_SCREENING_QUESTION_META_SUCCESS:
      return {
        ...state,
        loading: false,
        questionSaved: false,
        screeningMeta: action.data,
      };
    case GET_SCREENING_QUESTION_META_FAILED:
      return {
        ...state,
        questionSaved: false,
        loading: false,
      };
    case SAVE_QUESTIONS:
      return {
        ...state,
        loading: true,
      };
    case SAVE_QUESTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        questionSaved: true,
        createData:
          action.data && action.data.length
            ? { ...state.createData, editing: action.data }
            : { ...state.createData },
        statusMessage: {
          type: 'success',
          message:
            (action.message && action.message) ||
            'Questions saved successfully',
        },
      };
    case SAVE_QUESTIONS_FAILED:
      return {
        ...state,
        loading: false,
        questionSaved: false,
        statusMessage: {
          type: 'error',
          message:
            (action.error && action.error) ||
            'Unable to save questions, please try again or skip to next step',
        },
      };
    case GET_QUIZ_META:
      return {
        ...state,
        loading: true,
        quizSaved: undefined,
      };
    case GET_QUIZ_META_SUCCESS:
      return {
        ...state,
        quizMeta: action.data,
        loading: false,
        quizSaved: undefined,
      };
    case GET_QUIZ_META_FAILED:
      return {
        ...state,
        loading: false,
        quizSaved: undefined,
      };
    case SAVE_QUIZ:
      return {
        ...state,
        quizSaved: undefined,
        loading: true,
        quizError: undefined,
      };
    case SAVE_QUIZ_SUCCESS:
      return {
        ...state,
        quizSaved: true,
        loading: false,
        quizError: undefined,
      };
    case SAVE_QUIZ_FAILED:
      return {
        ...state,
        quizSaved: false,
        loading: false,
        quizError: action.error,
      };
    case CHANGE_STATUS:
      return {
        ...state,
        loading: true,
        jobPublished: undefined,
        statusChanged: undefined,
      };
    case CHANGE_STATUS_SUCCESS:
      toast.success(action.message);
      return {
        ...state,
        loading: false,
        jobPublished: true,
        statusChanged: true,
        jobStatus: action.jobStatus,
        createData: action.data
          ? { ...state.createData, editing: action.data }
          : { ...state.createData },
      };
    case CHANGE_STATUS_FAILED:
      toast.error((action?.error && action.error) || 'Failed to change status');
      return {
        ...state,
        loading: false,
        jobPublished: false,
        statusChanged: undefined,
        // statusMessage: {
        //   type: 'error',
        //   message: (action.error && action.error) || 'Failed to change status',
        // },
      };
    case GET_JOB_BASIC_INFO:
      return {
        ...state,
        loading: true,
      };
    case GET_JOB_BASIC_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        basicInfo: action.data,
        createData: { ...state.createData, editing: action.data },
      };
    case GET_JOB_BASIC_INFO_FAILED:
      return {
        ...state,
        loading: false,
        basicInfo: undefined,
      };
    case GET_QUESTIONS:
      return {
        ...state,
        loading: true,
      };
    case GET_QUESTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        questions: action.data,
      };
    case GET_QUESTIONS_FAILED:
      return {
        ...state,
        loading: false,
        questions: undefined,
      };
    case GET_QUIZ:
      return {
        ...state,
        loading: true,
      };
    case GET_QUIZ_SUCCESS:
      return {
        ...state,
        loading: false,
        quiz: action.data,
      };
    case GET_QUIZ_FAILED:
      return {
        ...state,
        loading: false,
        quiz: undefined,
      };
    case UPDATE_JOB:
      return {
        ...state,
        saveJobInfo: undefined,
        loading: true,
      };
    case UPDATE_JOB_SUCCESS:
      return {
        ...state,
        saveJobInfo: true,
        loading: false,
        basicInfo: {
          ...state.basicInfo,
          ...action.updatedData,
        },
      };
    case UPDATE_JOB_FAILED:
      return {
        ...state,
        saveJobInfo: false,
        loading: false,
        statusMessage: {
          type: 'error',
          message:
            action.error && action.error.global && action.error.global.length
              ? action.error.global
              : 'Unable to update job',
        },
        saveJobInfoErrors: action.error,
      };
    case GET_REQUIRED_FIELDS:
      return {
        ...state,
        loading: true,
      };
    case GET_REQUIRED_FIELDS_SUCCESS:
      return {
        ...state,
        requiredFields: action.data,
        loading: false,
      };
    case GET_REQUIRED_FIELDS_FAILED:
      return {
        ...state,
        requiredFields: undefined,
        loading: false,
      };
    case SET_JOB_ID:
      return {
        ...state,
        creatingId: action.jobId,
      };
    case SAVE_REQUIRED_FIELDS:
      return {
        ...state,
        loading: true,
        requiredFieldsUpdated: undefined,
        hasRedirect: undefined,
        quizSaved: undefined,
      };
    case SAVE_REQUIRED_FIELDS_SUCCESS:
      return {
        ...state,
        loading: false,
        requiredFieldsUpdated: true,
        requiredFieldsError: undefined,
        hasRedirect: action.hasRedirect,
      };
    case SAVE_REQUIRED_FIELDS_FAILED:
      return {
        ...state,
        loading: false,
        requiredFieldsUpdated: false,
        requiredFieldsError: action.error,
        hasRedirect: undefined,
      };
    case JOB_CREATE_SUCCESS:
      return {
        ...state,
        jobCreated: true,
      };
    case EMPTY_ERRORS:
      return {
        ...state,
        statusMessage: undefined,
        quizError: undefined,
        requiredFieldsError: undefined,
        saveJobInfoErrors: undefined,
        jobCreateErrors: undefined,
      };
    case GET_JOB_CATEGORIES:
      return {
        ...state,
        loading: true,
        categories: undefined,
      };
    case GET_JOB_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.data,
      };
    case GET_JOB_CATEGORIES_FAILED:
      return {
        ...state,
        loading: false,
        categories: undefined,
        statusMessage: {
          type: 'error',
          message: 'Unable to get categories',
        },
      };
    case GET_JOB_SKILLS:
      return {
        ...state,
        loading: true,
        skills: undefined,
      };
    case GET_JOB_SKILLS_SUCCESS:
      return {
        ...state,
        loading: false,
        skills: action.data,
      };
    case GET_JOB_SKILLS_FAILED:
      return {
        ...state,
        loading: false,
        skills: undefined,
        statusMessage: {
          type: 'error',
          message: 'Unable to get skills',
        },
      };
    case GET_JOB_COUNTRIES:
      return {
        ...state,
        loading: true,
        countries: undefined,
      };
    case GET_JOB_COUNTRIES_SUCCESS:
      return {
        ...state,
        loading: false,
        countries: action.data,
      };
    case GET_JOB_COUNTRIES_FAILED:
      return {
        ...state,
        loading: false,
        countries: undefined,
        statusMessage: {
          type: 'error',
          message: 'Unable to get countries',
        },
      };
    case GET_JOB_TEMPLATES:
      let company = undefined;
      if (typeof state.company != 'undefined') {
        company = state.company;
      }
      return {
        ...state,
        loading: true,
        company,
        jobTemplates: undefined,
      };
    case GET_JOB_TEMPLATES_SUCCESS:
      if (typeof action.data.company != 'undefined') {
        return {
          ...state,
          jobTemplates: action.data.templates,
          company: action.data.company,
          loading: false,
        };
      }
      return {
        ...state,
        jobTemplates: action.data.templates,
        loading: false,
      };
    case GET_JOB_TEMPLATES_FAILED:
      return {
        ...state,
        loading: false,
        jobTemplates: undefined,
        statusMessage: {
          type: 'error',
          message: action.error.length
            ? action.error
            : 'Unable to get templates',
        },
      };
    case GET_JOBS:
      return {
        ...state,
        loading: true,
        [getJobTypeObjectKey(action.job_type)]: undefined,
      };
    case GET_JOBS_SUCCESS:
      return {
        ...state,
        loading: false,
        [getJobTypeObjectKey(action.job_type)]: action.data,
      };
    case GET_JOBS_FAILED:
      toast.error(
        action?.message?.length ? action?.message : 'Unable to get jobs',
      );
      return {
        ...state,
        loading: false,
        [getJobTypeObjectKey(action.job_type)]: undefined,
      };
    case DUPLICATE_JOB:
      return {
        ...state,
        loading: true,
        duplicated: undefined,
      };
    case DUPLICATE_JOB_SUCCESS:
      return {
        ...state,
        loading: false,
        duplicated: action.data,
      };
    case DUPLICATE_JOB_FAILED:
      toast.error(
        action.message.length ? action.message : 'Unable to duplicate job',
      );
      return {
        ...state,
        loading: false,
        duplicated: undefined,
      };
    case PIN_UNPIN_JOB:
      return {
        ...state,
        pinUnpinJobData: undefined,
      };
    case PIN_UNPIN_JOB_SUCCESS:
      toast.success(action.message.length ? action.message : 'Data updated');
      return {
        ...state,
        pinUnpinJobData: action.data,
      };
    case PIN_UNPIN_JOB_FAILED:
      toast.error(action.message.length ? action.message : 'Unable to update');
      return {
        ...state,
        pinUnpinJobData: undefined,
      };

    case EJ_DELETE_SCREENING:
      return {
        ...state,
        loading: true,
        isDeletedScreenQuiz: false,
      };
    case EJ_DELETE_SCREENING_SUCCESS:
      toast.success(action.message.length ? action.message : 'Removed');
      return {
        ...state,
        loading: false,
        // questions: undefined,
        // quiz: undefined,
        isDeletedScreenQuiz: true,
      };
    case EJ_DELETE_SCREENING_FAILED:
      toast.error(
        action.message.length
          ? action.message
          : 'Unable to remove, please try again',
      );
      return {
        ...state,
        loading: false,
        isDeletedScreenQuiz: false,
      };
    case RESET_DUPLICATED:
      return {
        ...state,
        loading: false,
        duplicated: undefined,
      };
    case DELETE_JOB:
      return {
        ...state,
        jobDeleteLoading: true,
        jobDeleted: false,
      };
    case DELETE_JOB_SUCCESS:
      swal({
        title: 'Job deleted successfully!!',
        text: 'Click ok to continue',
        icon: 'success',
        buttons: [false, 'Ok'],
        timer: 1000,
      });
      return {
        ...state,
        jobDeleteLoading: false,
        jobDeleted: true,
      };
    case DELETE_JOB_FAILED:
      swal({
        title: 'Job delete failed',
        text: 'Click ok to continue',
        icon: 'error',
        buttons: [false, 'Ok'],
        timer: 1000,
      });
      return {
        ...state,
        jobDeleteLoading: false,
        jobDeleted: false,
      };
    case SAVE_CREATED_STATE:
      return {
        ...state,
        createdState: undefined,
      };
    case SAVE_CREATED_STATE_SUCCESS:
      return {
        ...state,
        createdState: action.data,
      };
    case SAVE_CREATED_STATE_FAILED:
      return {
        ...state,
      };
    case SAVE_CREATED_CITY:
      return {
        ...state,
        createdState: undefined,
      };
    case SAVE_CREATED_CITY_SUCCESS:
      return {
        ...state,
        createdCity: action.data,
      };
    case SAVE_CREATED_CITY_FAILED:
      return {
        ...state,
      };
    case RESET_DATA:
      return {
        ...state,
        ...action.keys.reduce(
          (acc, curr) => ((acc[curr] = undefined), acc),
          {},
        ),
      };
    default:
      return state;
  }
}
