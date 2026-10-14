import {
  GET_BASIC_INFO,
  GET_BASIC_INFO_FAILED,
  GET_BASIC_INFO_SUCCESS,
  GET_COMPANY_METADATA,
  GET_COMPANY_METADATA_FAILED,
  GET_COMPANY_METADATA_SUCCESS,
  GET_MINIMAL_INFO,
  GET_MINIMAL_INFO_FAILED,
  GET_MINIMAL_INFO_SUCCESS,
} from '../actions/companyActions';
import {
  CREATE_PIPELINE,
  CREATE_PIPELINE_FAILED,
  CREATE_PIPELINE_SUCCESS,
  DELETE_CATEGORY,
  DELETE_CATEGORY_FAILED,
  DELETE_CATEGORY_SUCCESS,
  DELETE_SKILL_FAILED,
  DELETE_SKILL_SUCCESS,
  DELETE_PIPELINE,
  DELETE_PIPELINE_FAILED,
  DELETE_PIPELINE_SUCCESS,
  DELETE_SKILL,
  DISCONNECT_API,
  DISCONNECT_API_FAILED,
  DISCONNECT_API_SUCCESS,
  EMPTY_ERRORS,
  GET_AI_SETUP,
  GET_AI_SETUP_FAILED,
  GET_AI_SETUP_SUCCESS,
  GET_API_KEY,
  GET_API_KEY_FAILED,
  GET_API_KEY_SUCCESS,
  GET_CUSTOMIZER_LINK,
  GET_CUSTOMIZER_LINK_FAILED,
  GET_CUSTOMIZER_LINK_SUCCESS,
  GET_PACKAGES,
  GET_PACKAGES_FAILED,
  GET_PACKAGES_SUCCESS,
  GET_PHOTOS_AND_COLORS,
  GET_PHOTOS_AND_COLORS_FAILED,
  GET_PHOTOS_AND_COLORS_SUCCESS,
  GET_PIPELINE_SETUP,
  GET_PIPELINE_SETUP_FAILED,
  GET_PIPELINE_SETUP_SUCCESS,
  GET_SETTINGS_CATEGORIES,
  GET_SETTINGS_CATEGORIES_FAILED,
  GET_SETTINGS_CATEGORIES_SUCCESS,
  GET_SETTINGS_SKILLS,
  GET_SETTINGS_SKILLS_FAILED,
  GET_SETTINGS_SKILLS_SUCCESS,
  GET_SHORTCODES,
  GET_SHORTCODES_FAILED,
  GET_SHORTCODES_SUCCESS,
  GET_VERIFICATION_CODE,
  GET_VERIFICATION_CODE_FAILED,
  GET_VERIFICATION_CODE_SUCCESS,
  SAVE_CATEGORY,
  SAVE_CATEGORY_FAILED,
  SAVE_CATEGORY_SUCCESS,
  SAVE_COMPANY_INFO,
  SAVE_COMPANY_INFO_FAILED,
  SAVE_COMPANY_INFO_SUCCESS,
  SAVE_SKILL,
  SAVE_SKILL_FAILED,
  SAVE_SKILL_SUCCESS,
  SHOW_LIFE,
  SHOW_LIFE_FAILED,
  SHOW_LIFE_SUCCESS,
  UPDATE_AI_SETUP,
  UPDATE_AI_SETUP_FAILED,
  UPDATE_AI_SETUP_SUCCESS,
  UPDATE_API_KEY,
  UPDATE_API_KEY_FAILED,
  UPDATE_API_KEY_SUCCESS,
  UPDATE_BRAND_COLOR,
  UPDATE_BRAND_COLOR_FAILED,
  UPDATE_BRAND_COLOR_SUCCESS,
  UPDATE_PIPELINE,
  UPDATE_PIPELINE_FAILED,
  UPDATE_PIPELINE_SUCCESS,
  UPLOAD_COMPANY_IMAGE,
  UPLOAD_COMPANY_IMAGE_FAILED,
  UPLOAD_COMPANY_IMAGE_SUCCESS,
  VERIFY_COMPANY,
  VERIFY_COMPANY_FAILED,
  VERIFY_COMPANY_SUCCESS,
  GET_APPLY_SETTINGS,
  GET_APPLY_SETTINGS_SUCCESS,
  GET_APPLY_SETTINGS_FAILED,
  DELETE_CUSTOM_FIELD,
  DELETE_CUSTOM_FIELD_SUCCESS,
  DELETE_CUSTOM_FIELD_FAILED,
  SAVE_APPLY_SETTINGS,
  SAVE_APPLY_SETTINGS_SUCCESS,
  SAVE_APPLY_SETTINGS_FAILED,
  GET_TEMPLATE_SETTINGS,
  GET_TEMPLATE_SETTINGS_SUCCESS,
  GET_TEMPLATE_SETTINGS_FAILED,
  SAVE_TEMPLATE_SETTINGS,
  SAVE_TEMPLATE_SETTINGS_SUCCESS,
  SAVE_TEMPLATE_SETTINGS_FAILED,
  RESET_SETTINGS_DATA,
  DELETE_COMPANY_IMAGE,
  DELETE_COMPANY_IMAGE_SUCCESS,
  DELETE_COMPANY_IMAGE_FAILED,
  SHOW_HIDE_COVER_PHOTO,
  SHOW_HIDE_COVER_PHOTO_SUCCESS,
  SHOW_HIDE_COVER_PHOTO_FAILED,
  UPDATE_LOGIN_ATTACHMENT,
  UPDATE_LOGIN_ATTACHMENT_SUCCESS,
  UPDATE_LOGIN_ATTACHMENT_FAILED,
} from '../actions/settingsActions';
import { toast } from 'react-toastify';

const initialState = {
  settingsLoading: undefined,
  basicInfo: undefined,
  metadata: undefined,
  globalError: undefined,
  basicInfoError: undefined,
  apiKey: undefined,
  apiKeyError: undefined,
  customizerLink: undefined,
  apiDisconnected: undefined,
  isVerified: undefined,
  shortcodes: undefined,
  shortcodesError: undefined,
  verificationCode: undefined,
  photosAndColors: undefined,
  errorMessage: undefined,
  brandColorUpdated: undefined,
  showLifeUpdated: undefined,
  uploadedImg: undefined,
  aiSetup: undefined,
  aiEnabled: undefined,
  statusMessage: undefined,
  pipelineSetup: undefined,
  updatedPipelines: undefined,
  pipelineDeleted: undefined,
  packages: undefined,
  categories: undefined,
  skills: undefined,
  dataSaved: undefined,
  applySettings: undefined,
  deletedField: undefined,
  formError: undefined,
  companyInfo: undefined,
  templateSettings: undefined,
};

export default function settings(state = initialState, action) {
  switch (action.type) {
    case GET_BASIC_INFO:
      return {
        ...state,
        settingsLoading: true,
        apiKeyError: undefined,
        basicInfoError: undefined,
      };
    case GET_BASIC_INFO_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        basicInfo: action.data,
        isVerified: action.data.is_verified,
      };
    case GET_BASIC_INFO_FAILED:
      return {
        ...state,
        settingsLoading: false,
      };
    case GET_COMPANY_METADATA:
      return {
        ...state,
        settingsLoading: true,
        globalError: undefined,
      };
    case GET_COMPANY_METADATA_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        metadata: action.data,
      };
    case GET_COMPANY_METADATA_FAILED:
      return {
        ...state,
        settingsLoading: false,
        metadata: undefined,
        globalError: action.error,
      };
    case SAVE_COMPANY_INFO:
      return {
        ...state,
        settingsLoading: true,
        basicInfoError: undefined,
      };
    case SAVE_COMPANY_INFO_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        basicInfoError: undefined,
        statusMessage: {
          type: 'success',
          message: action.message
            ? action.message
            : 'Basic information updated successfully.',
        },
      };
    case SAVE_COMPANY_INFO_FAILED:
      return {
        ...state,
        settingsLoading: false,
        statusMessage: {
          type: 'error',
          message: action.message
            ? action.message
            : 'Basic information update failed, please check inputs.',
        },
        basicInfoError: action.error
          ? action.error
          : 'Failed to save basic info.',
      };
    case GET_API_KEY:
      return {
        ...state,
        settingsLoading: true,
        apiKeyError: undefined,
        apiDisconnected: undefined,
      };
    case GET_API_KEY_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        apiKey: action.data.api_key,
      };
    case GET_API_KEY_FAILED:
      return {
        ...state,
        settingsLoading: false,
        apiKey: undefined,
      };
    case UPDATE_API_KEY:
      return {
        ...state,
        settingsLoading: true,
      };
    case UPDATE_API_KEY_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        apiKey: action.data.api_key,
        statusMessage: {
          type: 'success',
          message: action.message
            ? action.message
            : 'Api key updated successfully.',
        },
      };
    case UPDATE_API_KEY_FAILED:
      return {
        ...state,
        settingsLoading: false,
        apiKey: undefined,
        statusMessage: {
          type: 'error',
          message: action.error ? action.error : 'Failed to update Api key.',
        },
      };
    case GET_CUSTOMIZER_LINK:
      return {
        ...state,
        settingsLoading: true,
        apiKeyError: undefined,
      };
    case GET_CUSTOMIZER_LINK_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        customizerLink: action.data.link,
      };
    case GET_CUSTOMIZER_LINK_FAILED:
      return {
        ...state,
        settingsLoading: false,
      };
    case DISCONNECT_API:
      return {
        ...state,
        settingsLoading: true,
        apiDisconnected: undefined,
      };
    case DISCONNECT_API_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        apiDisconnected: true,
      };
    case DISCONNECT_API_FAILED:
      return {
        ...state,
        settingsLoading: false,
        apiDisconnected: false,
      };
    case GET_VERIFICATION_CODE:
      return {
        ...state,
        settingsLoading: true,
        verificationCode: undefined,
      };
    case GET_VERIFICATION_CODE_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        verificationCode: action.data,
      };
    case GET_VERIFICATION_CODE_FAILED:
      return {
        ...state,
        settingsLoading: true,
        verificationCode: undefined,
        statusMessage: {
          type: 'error',
          message: action.error
            ? action.error
            : 'Failed to get verification code.',
        },
      };
    case VERIFY_COMPANY:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
      };
    case VERIFY_COMPANY_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        isVerified: true,
        statusMessage: {
          type: 'success',
          message: action.message
            ? action.message
            : 'Verified company successfully.',
        },
      };
    case VERIFY_COMPANY_FAILED:
      return {
        ...state,
        settingsLoading: false,
        isVerified: false,
        statusMessage: {
          type: 'error',
          message: action.error ? action.error : 'Failed to verify company.',
        },
      };
    case GET_SHORTCODES:
      return {
        ...state,
        settingsLoading: true,
        shortcodes: undefined,
        shortcodesError: undefined,
        apiKeyError: undefined,
      };
    case GET_SHORTCODES_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        shortcodes: action.data,
      };
    case GET_SHORTCODES_FAILED:
      return {
        ...state,
        settingsLoading: false,
        shortcodes: undefined,
        shortcodesError: action.error,
      };
    case GET_PHOTOS_AND_COLORS:
      return {
        ...state,
        settingsLoading: true,
        apiKeyError: undefined,
        errorMessage: undefined,
        uploadedImg: undefined,
        statusMessage: undefined,
      };
    case GET_PHOTOS_AND_COLORS_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        photosAndColors: action.data,
      };
    case GET_PHOTOS_AND_COLORS_FAILED:
      return {
        ...state,
        settingsLoading: false,
        photosAndColors: undefined,
        statusMessage: {
          type: 'error',
          message: action.error
            ? action.error
            : 'Failed to get photos and colors.',
        },
      };
    case UPDATE_BRAND_COLOR:
      return {
        ...state,
        settingsLoading: true,
      };
    case UPDATE_BRAND_COLOR_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        statusMessage: {
          type: 'success',
          message: action.message ? action.message : 'Brand color updated.',
        },
      };
    case UPDATE_BRAND_COLOR_FAILED:
      return {
        ...state,
        settingsLoading: false,
        statusMessage: {
          type: 'error',
          message: action.error
            ? action.error
            : 'Failed to update brand color.',
        },
      };
    case EMPTY_ERRORS:
      return {
        ...state,
        errorMessage: undefined,
        apiKeyError: undefined,
        basicInfoError: undefined,
        shortcodesError: undefined,
        statusMessage: undefined,
      };
    case SHOW_LIFE:
      return {
        ...state,
        settingsLoading: true,
        errorMessage: undefined,
      };
    case SHOW_LIFE_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        statusMessage: {
          type: 'success',
          message: action.data.show
            ? 'Images will show on company page.'
            : 'Images will not show on company page.',
        },
      };
    case SHOW_LIFE_FAILED:
      return {
        ...state,
        settingsLoading: false,
        statusMessage: {
          type: 'error',
          message: action.message
            ? action.message
            : 'Failed to update, please try again.',
        },
      };
    case UPLOAD_COMPANY_IMAGE:
      return {
        ...state,
        settingsLoading: true,
        uploadedImg: undefined,
      };
    case UPLOAD_COMPANY_IMAGE_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        uploadedImg: action.target,
      };
    case UPLOAD_COMPANY_IMAGE_FAILED:
      return {
        ...state,
        settingsLoading: false,
        uploadedImg: undefined,
        statusMessage: {
          type: 'error',
          message: action.error
            ? action.error
            : 'Failed to upload image, please try again.',
        },
      };
    case GET_AI_SETUP:
      return {
        ...state,
        settingsLoading: true,
        aiEnabled: undefined,
        statusMessage: undefined,
      };
    case GET_AI_SETUP_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        aiSetup: action.data,
      };
    case GET_AI_SETUP_FAILED:
      return {
        ...state,
        settingsLoading: false,
        aiSetup: undefined,
        statusMessage: {
          type: 'error',
          message: action.error,
        },
      };
    case UPDATE_AI_SETUP:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
      };
    case UPDATE_AI_SETUP_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        aiEnabled: action.data.ai_setup_enabled,
        statusMessage: {
          type: 'success',
          message: action.sendData.hasOwnProperty('run_batch_score')
            ? 'Process started, it may take some time, please wait.'
            : 'Ai setup updated.',
        },
      };
    case UPDATE_AI_SETUP_FAILED:
      return {
        ...state,
        settingsLoading: false,
        aiEnabled: undefined,
        statusMessage: {
          type: 'error',
          message: action.error,
        },
      };
    case GET_PIPELINE_SETUP:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
        updatedPipeline: undefined,
        pipelineDeleted: undefined,
      };
    case GET_PIPELINE_SETUP_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        pipelineSetup: action.data,
      };
    case GET_PIPELINE_SETUP_FAILED:
      return {
        ...state,
        settingsLoading: false,
        pipelineSetup: undefined,
      };
    case CREATE_PIPELINE:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
        updatedPipelines: undefined,
      };
    case CREATE_PIPELINE_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        updatedPipelines: action.data,
        statusMessage: {
          type: 'success',
          message: (action.message && action.message) || 'Pipeline added.',
        },
      };
    case CREATE_PIPELINE_FAILED:
      toast.error(action.error['steps.message'][0]);
      return {
        ...state,
        settingsLoading: false,
        statusMessage: {
          type: 'error',
          message: (action.error && action.error) || 'Failed to add pipeline.',
        },
      };
    case UPDATE_PIPELINE:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
      };
    case UPDATE_PIPELINE_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        updatedPipelines: action.data,
        statusMessage: {
          type: 'success',
          message: (action.message && action.message) || 'Pipeline updated.',
        },
      };
    case UPDATE_PIPELINE_FAILED:
      toast.error(action.error['steps.message'][0]);
      return {
        ...state,
        settingsLoading: false,
        updatedPipelines: undefined,
        statusMessage: {
          type: 'error',
          message: (action.error && action.error) || 'Update pipeline failed.',
        },
      };
    case DELETE_PIPELINE:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
        pipelineDeleted: undefined,
      };
    case DELETE_PIPELINE_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        statusMessage: {
          type: 'success',
          message: 'Pipeline removed.',
        },
        pipelineDeleted: true,
      };
    case DELETE_PIPELINE_FAILED:
      return {
        ...state,
        settingsLoading: false,
        statusMessage: {
          type: 'error',
          message:
            (action.error && action.error) ||
            'Failed to delete pipeline, please try again.',
        },
        pipelineDeleted: undefined,
      };
    case GET_PACKAGES:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
      };
    case GET_PACKAGES_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        packages: action.data,
      };
    case GET_PACKAGES_FAILED:
      return {
        ...state,
        settingsLoading: false,
        packages: undefined,
        statusMessage: {
          type: 'error',
          message: action.error
            ? action.error
            : 'Unable to get subscription packages.',
        },
      };
    case GET_SETTINGS_CATEGORIES:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
      };
    case GET_SETTINGS_CATEGORIES_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        categories: action.data,
      };
    case GET_SETTINGS_CATEGORIES_FAILED:
      return {
        ...state,
        settingsLoading: false,
        categories: undefined,
        statusMessage: {
          type: 'error',
          message: action.error ? action.error : 'Unable to get categories.',
        },
      };
    case GET_SETTINGS_SKILLS:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
      };
    case GET_SETTINGS_SKILLS_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        skills: action.data,
      };
    case GET_SETTINGS_SKILLS_FAILED:
      return {
        ...state,
        settingsLoading: false,
        skills: undefined,
        statusMessage: {
          type: 'error',
          message: action.error ? action.error : 'Unable to get skills.',
        },
      };
    case SAVE_CATEGORY:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
        dataSaved: undefined,
      };
    case SAVE_CATEGORY_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        dataSaved: true,
        statusMessage: {
          type: 'success',
          message: 'Category saved successfully.',
        },
      };
    case SAVE_CATEGORY_FAILED:
      let msg = 'Failed to save category.';
      if (action.error) {
        if (typeof action.error === 'object') {
          if (action.error.hasOwnProperty('name')) {
            msg = action.error.name[0];
          }
        } else {
          msg = action.error;
        }
      }
      return {
        ...state,
        settingsLoading: false,
        dataSaved: false,
        statusMessage: {
          type: 'error',
          message: msg,
        },
      };
    case SAVE_SKILL:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
        dataSaved: undefined,
      };
    case SAVE_SKILL_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        dataSaved: true,
        statusMessage: {
          type: 'success',
          message: 'Skill saved successfully.',
        },
      };
    case SAVE_SKILL_FAILED:
      return {
        ...state,
        settingsLoading: false,
        dataSaved: false,
        statusMessage: {
          type: 'error',
          message: action.error
            ? action.error.name[0]
            : 'Failed to save skill.',
        },
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
        dataSaved: undefined,
      };
    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        dataSaved: true,
        statusMessage: {
          type: 'success',
          message: 'Category deleted successfully.',
        },
      };
    case DELETE_CATEGORY_FAILED:
      return {
        ...state,
        settingsLoading: false,
        dataSaved: false,
        statusMessage: {
          type: 'error',
          message: action.error ? action.error : 'Failed to delete category.',
        },
      };
    case DELETE_SKILL:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
        dataSaved: undefined,
      };
    case DELETE_SKILL_SUCCESS:
      return {
        ...state,
        dataSaved: true,
        statusMessage: {
          type: 'success',
          message: 'Skill deleted successfully.',
        },
      };
    case DELETE_SKILL_FAILED:
      return {
        ...state,
        settingsLoading: false,
        dataSaved: false,
        statusMessage: {
          type: 'error',
          message: action.error ? action.error : 'Failed to delete skill.',
        },
      };
    case GET_APPLY_SETTINGS:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
        deletedField: undefined,
        formError: undefined,
      };
    case GET_APPLY_SETTINGS_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        applySettings: action.data,
      };
    case GET_APPLY_SETTINGS_FAILED:
      return {
        ...state,
        settingsLoading: false,
        statusMessage: {
          type: 'error',
          message: action.error
            ? action.error
            : 'Failed to get apply Settings data.',
        },
      };
    case DELETE_CUSTOM_FIELD:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
        deletedField: undefined,
      };
    case DELETE_CUSTOM_FIELD_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        statusMessage: {
          type: 'success',
          message: action.message
            ? action.message
            : 'Field deleted successfully.',
        },
        deletedField: action.deleted,
      };
    case DELETE_CUSTOM_FIELD_FAILED:
      return {
        ...state,
        settingsLoading: false,
        statusMessage: {
          type: 'error',
          message: action.message
            ? action.message
            : 'Failed to deleted custom field.',
        },
        deletedField: undefined,
      };
    case SAVE_APPLY_SETTINGS:
      return {
        ...state,
        settingsLoading: true,
        statusMessage: undefined,
        deletedField: undefined,
        formError: undefined,
      };
    case SAVE_APPLY_SETTINGS_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        formError: undefined,
        applySettings: action.data,
        statusMessage: {
          type: 'success',
          message: action.message
            ? action.message
            : 'Apply Settings updated successfully.',
        },
      };
    case SAVE_APPLY_SETTINGS_FAILED:
      return {
        ...state,
        settingsLoading: false,
        formError: action.error,
        statusMessage: {
          type: 'error',
          message: 'Failed to save apply Settings.',
        },
      };
    case GET_MINIMAL_INFO:
      return {
        ...state,
        settingsLoading: true,
        companyInfo: undefined,
      };
    case GET_MINIMAL_INFO_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        companyInfo: action.data,
      };
    case GET_MINIMAL_INFO_FAILED:
      return {
        ...state,
        settingsLoading: false,
        companyInfo: undefined,
        statusMessage: {
          type: 'error',
          message: action.error,
        },
      };
    case GET_TEMPLATE_SETTINGS:
      return {
        ...state,
        settingsLoading: true,
        templateSettings: undefined,
      };
    case GET_TEMPLATE_SETTINGS_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        templateSettings: action.data,
      };
    case GET_TEMPLATE_SETTINGS_FAILED:
      return {
        ...state,
        settingsLoading: false,
        templateSettings: undefined,
        statusMessage: {
          type: 'error',
          message: action.error,
        },
      };
    case SAVE_TEMPLATE_SETTINGS:
      return {
        ...state,
        settingsLoading: true,
      };
    case SAVE_TEMPLATE_SETTINGS_SUCCESS:
      return {
        ...state,
        settingsLoading: false,
        templateSettings: action.data,
        statusMessage: {
          type: 'success',
          message: 'Template updated.',
        },
      };
    case SAVE_TEMPLATE_SETTINGS_FAILED:
      return {
        ...state,
        settingsLoading: false,
        statusMessage: {
          type: 'error',
          message: action.error,
        },
      };
    case RESET_SETTINGS_DATA:
      return {
        ...state,
        ...action.keys.reduce(
          (acc, curr) => ((acc[curr] = undefined), acc),
          {},
        ),
      };
    case DELETE_COMPANY_IMAGE:
      return {
        ...state,
        photosAndColors: action.data,
      };
    case DELETE_COMPANY_IMAGE_SUCCESS:
      return {
        ...state,
        photosAndColors: action.data,
        statusMessage: {
          type: 'success',
          message: action.message,
        },
      };
    case DELETE_COMPANY_IMAGE_FAILED:
      return {
        ...state,
        photosAndColors: undefined,
        statusMessage: {
          type: 'error',
          message: action.error,
        },
      };
    case SHOW_HIDE_COVER_PHOTO:
      return {
        ...state,
        // settingsLoading: true,
        errorMessage: undefined,
      };
    case SHOW_HIDE_COVER_PHOTO_SUCCESS:
      return {
        ...state,
        // settingsLoading: false,
        statusMessage: {
          type: 'success',
          message: 'Settings updated.',
        },
      };
    case SHOW_HIDE_COVER_PHOTO_FAILED:
      return {
        ...state,
        // settingsLoading: false,
        statusMessage: {
          type: 'error',
          message: 'Failed to update, please try again.',
        },
      };
    case UPDATE_LOGIN_ATTACHMENT:
      return {
        ...state,
      };
    case UPDATE_LOGIN_ATTACHMENT_SUCCESS:
      return {
        ...state,
        applySettings: action.data,
        statusMessage: {
          type: 'success',
          message: action.message,
        },
      };
    case UPDATE_LOGIN_ATTACHMENT_FAILED:
      return {
        ...state,
        statusMessage: {
          type: 'error',
          message: action.message,
        },
      };
    default:
      return state;
  }
}
