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
import { toast } from 'react-toastify';

const initialState = {
  loggedIn: undefined,
  signInData: undefined,
  connected: false,
  loading: false,
  signUpData: undefined,
  signUpErrors: undefined,
  createCompanyErrors: undefined,
};

export default function login(state = initialState, action) {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        loggedIn: undefined,
        signInData: undefined,
        loading: true,
      };
    case SIGN_IN_SUCCESS:
      if (action?.data?.action !== 'select_company') {
        window.location.reload();
      }
      return {
        ...state,
        signInData: action.data,
        loading: false,
      };
    case SIGN_IN_FAILED:
      toast.error(action.message);
      return {
        ...state,
        loggedIn: undefined,
        signInData: undefined,
        loading: false,
      };
    case CONNECT_API_KEY:
      return {
        ...state,
        loading: true,
        connected: false,
      };
    case CONNECT_API_KEY_SUCCESS:
      toast.success(action.message);
      return {
        ...state,
        loading: false,
        connected: true,
      };
    case CONNECT_API_KEY_FAILED:
      toast.error(action.message);
      return {
        ...state,
        loading: false,
        connected: false,
      };
    case SIGN_UP:
      return {
        ...state,
        loading: true,
        signUpErrors: undefined,
      };
    case SIGN_UP_SUCCESS:
      toast.success(action.message);
      return {
        ...state,
        loading: false,
        signUpData: action.data,
      };
    case SIGN_UP_FAILED:
      toast.error(action.message);
      return {
        ...state,
        signUpErrors: action.error,
        loading: false,
        signUpData: undefined,
      };
    case CREATE_COMPANY:
      return {
        ...state,
        loading: true,
        createCompanyErrors: undefined,
      };
    case CREATE_COMPANY_SUCCESS:
      toast.success(action.message);
      window.location.reload();
      return {
        ...state,
        loading: false,
        createCompanyErrors: undefined,
      };
    case CREATE_COMPANY_FAILED:
      toast.error(action.message);
      return {
        ...state,
        createCompanyErrors: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
