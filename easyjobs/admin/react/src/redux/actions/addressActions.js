export const GET_COUNTRIES = 'GET_COUNTRIES';
export const GET_COUNTRIES_SUCCESS = 'GET_COUNTRIES_SUCCESS';
export const GET_COUNTRIES_FAILED = 'GET_COUNTRIES_FAILED';

export const GET_CITIES = 'GET_CITIES';
export const GET_CITIES_SUCCESS = 'GET_CITIES_SUCCESS';
export const GET_CITIES_FAILED = 'GET_CITIES_FAILED';

export const GET_STATES = 'GET_STATES';
export const GET_STATES_SUCCESS = 'GET_STATES_SUCCESS';
export const GET_STATES_FAILED = 'GET_STATES_SUCCESS';

export const RESET_ADDRESS = 'RESET_ADDRESS';

export function getCountries() {
  return {
    type: GET_COUNTRIES,
  };
}

export function getStates(country) {
  return {
    type: GET_STATES,
    country: country,
  };
}

export function getCities(country, state) {
  return {
    type: GET_CITIES,
    country,
    state,
  };
}

export function resetAddress(keys) {
  return {
    type: RESET_ADDRESS,
    keys,
  };
}
