import {
  GET_ALL_CANDIDATES,
  GET_ALL_CANDIDATES_SUCCESS,
  GET_ALL_CANDIDATES_FAILED,
  GET_COMPANY_JOBS,
  GET_COMPANY_JOBS_SUCCESS,
  GET_COMPANY_JOBS_FAILED,
  GET_CANDIDATE_DETAILS,
  GET_CANDIDATE_DETAILS_SUCCESS,
  GET_CANDIDATE_DETAILS_FAILED,
  REMOVE_RATING,
  REMOVE_RATING_SUCCESS,
  REMOVE_RATING_FAILED,
  CHANGE_CANDIDATE_PIPELINE,
  CHANGE_CANDIDATE_PIPELINE_SUCCESS,
  CHANGE_CANDIDATE_PIPELINE_FAILED,
  CHANGE_CANDIDATE_DETAIL_RATING,
  CHANGE_CANDIDATE_DETAIL_RATING_SUCCESS,
  CHANGE_CANDIDATE_DETAIL_RATING_FAILED,
  REMOVE_CANDIDATE,
  REMOVE_CANDIDATE_SUCCESS,
  REMOVE_CANDIDATE_FAILED,
  REMOVE_NOTE,
  REMOVE_NOTE_FAILED,
  REMOVE_NOTE_SUCCESS,
  ADD_NOTE_AND_MANAGERS,
  ADD_NOTE_AND_MANAGERS_SUCCESS,
  ADD_NOTE_AND_MANAGERS_FAILED,
  GET_CANDIDATES_ID,
  GET_CANDIDATES_ID_SUCCESS,
  GET_CANDIDATES_ID_FAILED,
  RESET_CANDIDATES_ID,
} from '../actions/candidateActions';
import { toast } from 'react-toastify';
import { getMessage } from '../../util/helper';

const initialState = {
  allCandidates: undefined,
  companyJobs: undefined,
  candidateDetails: undefined,
  loading: undefined,
  newRating: undefined,
  pipelineLoading: undefined,
  ratingLoading: undefined,
  removeLoading: undefined,
  isCandidateDeleted: undefined,
  noteLoading: undefined,
  addNoteLoading: undefined,
  candidatesId: undefined,
};

export default function candidate(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_CANDIDATES: // All Candidates
      return {
        ...state,
        allCandidates: undefined,
        loading: true,
      };
    case GET_ALL_CANDIDATES_SUCCESS:
      return {
        ...state,
        allCandidates: action.data,
        loading: false,
      };
    case GET_ALL_CANDIDATES_FAILED:
      return {
        ...state,
        allCandidates: undefined,
        loading: false,
      };
    // Company Jobs — used for the filter dropdown only. It must NOT touch the
    // shared `loading` flag: that flag drives the candidate-list skeleton, and
    // since this lighter request usually resolves before the candidates fetch,
    // flipping `loading` here made the "No candidates" empty state flash.
    case GET_COMPANY_JOBS:
      return {
        ...state,
        companyJobs: undefined,
      };
    case GET_COMPANY_JOBS_SUCCESS:
      return {
        ...state,
        companyJobs: action.data,
      };
    case GET_COMPANY_JOBS_FAILED:
      return {
        ...state,
        companyJobs: undefined,
      };
    case GET_CANDIDATE_DETAILS: // Candidate Details
      return {
        ...state,
        candidateDetails: undefined,
        loading: true,
      };
    case GET_CANDIDATE_DETAILS_SUCCESS:
      return {
        ...state,
        candidateDetails: action.data,
        loading: false,
      };
    case GET_CANDIDATE_DETAILS_FAILED:
      return {
        ...state,
        candidateDetails: 'unable',
        loading: false,
      };
    case REMOVE_RATING:
      return {
        ...state,
      };
    case REMOVE_RATING_SUCCESS:
      swal({
        title: 'Rating removed successfully',
        text: 'Click ok to continue',
        icon: 'success',
        buttons: [false, 'Ok'],
        timer: 2000,
      });
      return {
        ...state,
        newRating: 0,
      };
    case REMOVE_RATING_FAILED:
      swal({
        title: 'Unable to remove rating',
        text: response.message ? response.message : 'Click ok to continue',
        icon: 'error',
        buttons: [false, 'Ok'],
        timer: 2000,
      });
      return {
        ...state,
        newRating: undefined,
      };
    case CHANGE_CANDIDATE_PIPELINE:
      return {
        ...state,
        pipelineLoading: true,
      };
    case CHANGE_CANDIDATE_PIPELINE_SUCCESS:
      toast.success(getMessage(action, 'Pipeline changed'), {
        autoClose: 1200,
      });
      return {
        ...state,
        pipelineLoading: false,
      };
    case CHANGE_CANDIDATE_PIPELINE_FAILED:
      toast.error(getMessage(action, 'Unable to change pipeline'), {
        autoClose: 1200,
      });
      return {
        ...state,
        pipelineLoading: false,
      };
    case CHANGE_CANDIDATE_DETAIL_RATING:
      return {
        ...state,
        ratingLoading: true,
      };
    case CHANGE_CANDIDATE_DETAIL_RATING_SUCCESS:
      swal({
        title: 'Rated successfully',
        text: 'Click ok to continue',
        icon: 'success',
        buttons: [false, 'Ok'],
        timer: 1500,
      });
      return {
        ...state,
        ratingLoading: false,
      };
    case CHANGE_CANDIDATE_DETAIL_RATING_FAILED:
      swal({
        title: 'Unable rate candidate',
        text: 'Click ok to continue',
        icon: 'error',
        buttons: [false, 'Ok'],
        timer: 2000,
      });
      return {
        ...state,
        ratingLoading: false,
      };
    case REMOVE_CANDIDATE:
      return {
        ...state,
        removeLoading: true,
        isCandidateDeleted: false,
      };
    case REMOVE_CANDIDATE_SUCCESS:
      toast.success(getMessage(action, 'Candidate deleted'), {
        autoClose: 1200,
      });
      return {
        ...state,
        removeLoading: false,
        isCandidateDeleted: true,
      };
    case REMOVE_CANDIDATE_FAILED:
      toast.error(getMessage(action, 'Unable to delete candidate'), {
        autoClose: 1200,
      });
      return {
        ...state,
        removeLoading: false,
        isCandidateDeleted: false,
      };
    case REMOVE_NOTE:
      return {
        ...state,
        noteLoading: true,
      };
    case REMOVE_NOTE_SUCCESS:
      toast.success(getMessage(action, 'Note deleted'), {
        autoClose: 1200,
      });
      return {
        ...state,
        noteLoading: false,
      };
    case REMOVE_NOTE_FAILED:
      toast.error(getMessage(action, 'Unable to delete note'), {
        autoClose: 1200,
      });
      return {
        ...state,
        noteLoading: false,
      };
    case ADD_NOTE_AND_MANAGERS:
      return {
        ...state,
        addNoteLoading: true,
      };
    case ADD_NOTE_AND_MANAGERS_SUCCESS:
      toast.success(getMessage(action, 'Note added successfully'), {
        autoClose: 1200,
      });
      return {
        ...state,
        addNoteLoading: false,
      };
    case ADD_NOTE_AND_MANAGERS_FAILED:
      toast.error(getMessage(action, 'Unable to add note'), {
        autoClose: 1200,
      });
      return {
        ...state,
        addNoteLoading: false,
      };
    case GET_CANDIDATES_ID:
      return {
        ...state,
        candidatesId: undefined,
      };
    case GET_CANDIDATES_ID_SUCCESS:
      return {
        ...state,
        candidatesId: action.data,
      };
    case GET_CANDIDATES_ID_FAILED:
      return {
        ...state,
        candidatesId: undefined,
      };
    case RESET_CANDIDATES_ID:
      return {
        ...state,
        candidatesId: undefined,
        candidateDetails: undefined,
      };

    default:
      return state;
  }
}
