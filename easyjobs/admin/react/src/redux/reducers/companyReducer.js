import {
  SYNC_COMPANY_INFO,
  SYNC_COMPANY_INFO_FAILED,
  SYNC_COMPANY_INFO_SUCCESS,
} from '../actions/companyActions';

const initialState = {
  loading: undefined,
  synced: undefined,
  statusMessage: undefined,
};
export default function company(state = initialState, action) {
  switch (action.type) {
    case SYNC_COMPANY_INFO:
      return {
        ...state,
        loading: true,
        synced: undefined,
      };
    case SYNC_COMPANY_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        synced: true,
        statusMessage: {
          type: 'success',
          message: action.message ? action.message : 'Data synced successfully',
        },
      };
    case SYNC_COMPANY_INFO_FAILED:
      return {
        ...state,
        loading: false,
        synced: false,
        statusMessage: {
          type: 'error',
          message: action.message ? action.message : 'Data synced failed',
        },
      };
    default:
      return state;
  }
}
