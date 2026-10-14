export const SIGN_IN = 'SIGN_IN';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_IN_FAILED = 'SIGN_IN_FAILED';

export const CONNECT_API_KEY = 'CONNECT';
export const CONNECT_API_KEY_SUCCESS = 'CONNECT_API_KEY_SUCCESS';
export const CONNECT_API_KEY_FAILED = 'CONNECT_API_KEY_FAILED';

export const SIGN_UP = 'SIGN_UP';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILED = 'SIGN_UP_FAILED';

export const CREATE_COMPANY = 'CREATE_COMPANY';
export const CREATE_COMPANY_SUCCESS = 'CREATE_COMPANY_SUCCESS';
export const CREATE_COMPANY_FAILED = 'CREATE_COMPANY_FAILED';

export function signIn(data) {
  return {
    type: SIGN_IN,
    data,
  };
}

export function connectApiKey(apiKey) {
  return {
    type: CONNECT_API_KEY,
    apiKey,
  };
}

export function signUp(data) {
  return {
    type: SIGN_UP,
    data,
  };
}

export function createCompany(data) {
  return {
    type: CREATE_COMPANY,
    data,
  };
}
