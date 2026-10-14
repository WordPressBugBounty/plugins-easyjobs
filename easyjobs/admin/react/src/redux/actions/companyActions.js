export const GET_BASIC_INFO = 'GET_BASIC_INFO';
export const GET_BASIC_INFO_SUCCESS = 'GET_BASIC_INFO_SUCCESS';
export const GET_BASIC_INFO_FAILED = 'GET_BASIC_INFO_FAILED';

export const GET_COMPANY_METADATA = 'GET_COMPANY_METADATA';
export const GET_COMPANY_METADATA_SUCCESS = 'GET_COMPANY_METADATA_SUCCESS';
export const GET_COMPANY_METADATA_FAILED = 'GET_COMPANY_METADATA_FAILED';

export const GET_MINIMAL_INFO = 'GET_MINIMAL_INFO';
export const GET_MINIMAL_INFO_SUCCESS = 'GET_MINIMAL_INFO_SUCCESS';
export const GET_MINIMAL_INFO_FAILED = 'GET_MINIMAL_INFO_FAILED';

export const SYNC_COMPANY_INFO = 'SYNC_COMPANY_INFO';
export const SYNC_COMPANY_INFO_SUCCESS = 'SYNC_COMPANY_INFO_SUCCESS';
export const SYNC_COMPANY_INFO_FAILED = 'SYNC_COMPANY_INFO_FAILED';

export function getCompanyInfo() {
  return {
    type: GET_BASIC_INFO,
  };
}

export function getCompanyMetaData() {
  return {
    type: GET_COMPANY_METADATA,
  };
}

export function getMinimalInfo() {
  return {
    type: GET_MINIMAL_INFO,
  };
}
export function syncCompanyInfo() {
  return {
    type: SYNC_COMPANY_INFO,
  };
}
