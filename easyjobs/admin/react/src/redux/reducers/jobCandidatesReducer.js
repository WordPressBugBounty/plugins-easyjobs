import {
  GET_ALL_JOB_CANDIDATES,
  GET_ALL_JOB_CANDIDATES_SUCCESS,
  GET_ALL_JOB_CANDIDATES_FAILED,
  SET_CANDIDATES_RATING,
  SET_CANDIDATES_RATING_SUCCESS,
  SET_CANDIDATES_RATING_FAILED,
  GET_PENDING_CANDIDATES,
  GET_PENDING_CANDIDATES_SUCCESS,
  GET_PENDING_CANDIDATES_FAILED,
  DELETE_PENDING_CANDIDATE,
  DELETE_PENDING_CANDIDATE_SUCCESS,
  DELETE_PENDING_CANDIDATE_FAILED,
  SEND_INVITATION,
  SEND_INVITATION_SUCCESS,
  SEND_INVITATION_FAILED,
  GET_INVITED_CANDIDATES,
  GET_INVITED_CANDIDATES_SUCCESS,
  GET_INVITED_CANDIDATES_FAILED,
  GET_FILTERED_CANDIDATES,
  GET_FILTERED_CANDIDATES_SUCCESS,
  GET_FILTERED_CANDIDATES_FAILED,
  DELETE_INVITE_CANDIDATE,
  DELETE_INVITE_CANDIDATE_SUCCESS,
  DELETE_INVITE_CANDIDATE_FAILED,
} from '../actions/jobCadidatesActions';

const initialState = {
  allJobCandidates: undefined,
  candidatesJob: undefined,
  loading: undefined,
  ratingLoading: undefined,
  pendingCandidates: undefined,
  invitedCandidates: undefined,
  invitedCandidatesLoading: undefined,
  filteredCandidates: undefined,
  ratingData: undefined,
  sendInvitationLoading: false,
  deleteInvitationLoading: false,
  deletePendingLoading: false,
};

export default function jobCandidates(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_JOB_CANDIDATES: // All Candidates
      return {
        ...state,
        allJobCandidates: undefined,
        candidatesJob: undefined,
        loading: true,
      };

    case GET_ALL_JOB_CANDIDATES_SUCCESS:
      return {
        ...state,
        allJobCandidates: action.data.candidates,
        candidatesJob: action.data.job,
        loading: false,
      };

    case GET_ALL_JOB_CANDIDATES_FAILED:
      return {
        ...state,
        allJobCandidates: undefined,
        candidatesJob: undefined,
        loading: false,
      };

    case SET_CANDIDATES_RATING:
      return {
        ...state,
        ratingData: undefined,
        ratingLoading: true,
      };

    case SET_CANDIDATES_RATING_SUCCESS:
      swal({
        title: 'Rated successfully',
        text: 'Click ok to continue',
        icon: 'success',
        buttons: [false, 'Ok'],
        timer: 1500,
      });
      return {
        ...state,
        ratingData: action.data,
        ratingLoading: false,
      };

    case SET_CANDIDATES_RATING_FAILED:
      swal({
        title: 'Unable rate candidate',
        text: 'Click ok to continue',
        icon: 'error',
        buttons: [false, 'Ok'],
        timer: 2000,
      });
      return {
        ...state,
        ratingData: undefined,
        ratingLoading: false,
      };

    case GET_PENDING_CANDIDATES:
      return {
        ...state,
        pendingCandidates: undefined,
      };

    case GET_PENDING_CANDIDATES_SUCCESS:
      return {
        ...state,
        pendingCandidates: action.data,
      };

    case GET_PENDING_CANDIDATES_FAILED:
      return {
        ...state,
        pendingCandidates: undefined,
      };

    case DELETE_PENDING_CANDIDATE:
      return {
        ...state,
        deletePendingLoading: true,
      };

    case DELETE_PENDING_CANDIDATE_SUCCESS:
      swal({
        title: 'Candidate removed',
        text: 'Click ok to continue',
        icon: 'success',
        buttons: [false, 'Ok'],
        timer: 2000,
      });
      return {
        ...state,
        deletePendingLoading: false,
      };

    case DELETE_PENDING_CANDIDATE_FAILED:
      swal({
        title: 'Candidate not removed',
        text: 'Click ok to continue',
        icon: 'error',
        buttons: [false, 'Ok'],
      });
      return {
        ...state,
        deletePendingLoading: false,
      };

    case SEND_INVITATION:
      return {
        ...state,
        sendInvitationLoading: true,
      };

    case SEND_INVITATION_SUCCESS:
      swal({
        title: 'Invitation link is sent to candidate',
        text: 'Click ok to continue',
        icon: 'success',
        buttons: [false, 'Ok'],
        timer: 2000,
      });
      return {
        ...state,
        sendInvitationLoading: false,
      };

    case SEND_INVITATION_FAILED:
      swal({
        title: 'Unable to invite candidates',
        text: 'Click ok to continue',
        icon: 'error',
        buttons: [false, 'Ok'],
        timer: 2000,
      });
      return {
        ...state,
        sendInvitationLoading: false,
      };

    case GET_INVITED_CANDIDATES:
      return {
        ...state,
        invitedCandidates: undefined,
        invitedCandidatesLoading: true,
      };

    case GET_INVITED_CANDIDATES_SUCCESS:
      return {
        ...state,
        invitedCandidates: action.data,
        invitedCandidatesLoading: false,
      };

    case GET_INVITED_CANDIDATES_FAILED:
      return {
        ...state,
        invitedCandidates: undefined,
        invitedCandidatesLoading: false,
      };

    case GET_FILTERED_CANDIDATES:
      return {
        ...state,
        filteredCandidates: undefined,
        loading: true,
      };

    case GET_FILTERED_CANDIDATES_SUCCESS:
      return {
        ...state,
        allJobCandidates: action.data,
        loading: false,
      };

    case GET_FILTERED_CANDIDATES_FAILED:
      return {
        ...state,
        filteredCandidates: undefined,
        loading: false,
      };

    case DELETE_INVITE_CANDIDATE:
      return {
        ...state,
        deleteInvitationLoading: true,
      };

    case DELETE_INVITE_CANDIDATE_SUCCESS:
      swal({
        title: 'Invitation removed',
        text: 'Click ok to continue',
        icon: 'success',
        buttons: [false, 'Ok'],
        timer: 2000,
      });
      return {
        ...state,
        deleteInvitationLoading: false,
      };

    case DELETE_INVITE_CANDIDATE_FAILED:
      swal({
        title: 'Unable to remove invitation',
        text: 'Click ok to continue',
        icon: 'error',
        buttons: [false, 'Ok'],
        timer: 2000,
      });
      return {
        ...state,
        deleteInvitationLoading: false,
      };

    default:
      return state;
  }
}
