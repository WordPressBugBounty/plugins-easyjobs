import {
  GET_CITIES,
  GET_CITIES_FAILED,
  GET_CITIES_SUCCESS,
  GET_COUNTRIES,
  GET_COUNTRIES_FAILED,
  GET_COUNTRIES_SUCCESS,
  GET_STATES,
  GET_STATES_FAILED,
  GET_STATES_SUCCESS,
  RESET_ADDRESS,
} from '../actions/addressActions';

const initialState = {
  addressLoading: undefined,
  countries: undefined,
  states: undefined,
  cities: undefined,
  addressError: undefined,
};

export default function settings(state = initialState, action) {
  switch (action.type) {
    case GET_COUNTRIES:
      return {
        ...state,
        addressLoading: true,
      };
    case GET_COUNTRIES_SUCCESS:
      return {
        ...state,
        addressLoading: false,
        countries: action.data,
      };
    case GET_COUNTRIES_FAILED:
      return {
        ...state,
        addressLoading: false,
        addressError: action.error,
      };
    case GET_STATES:
      return {
        ...state,
        addressLoading: true,
      };
    case GET_STATES_SUCCESS:
      return {
        ...state,
        addressLoading: false,
        states: action.data,
      };
    case GET_STATES_FAILED:
      return {
        ...state,
        addressLoading: false,
        addressError: action.data,
      };
    case GET_CITIES:
      return {
        ...state,
        addressLoading: true,
      };
    case GET_CITIES_SUCCESS:
      return {
        ...state,
        addressLoading: false,
        cities: action.data,
      };
    case GET_CITIES_FAILED:
      return {
        ...state,
        addressLoading: false,
        addressError: action.error,
      };
    case RESET_ADDRESS:
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
