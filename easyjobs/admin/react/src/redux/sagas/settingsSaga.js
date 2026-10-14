import { ajaxCall, fileUpload } from '../../util/ajaxCall';
import { all, put, takeLatest } from 'redux-saga/effects';
import {
  CREATE_PIPELINE,
  CREATE_PIPELINE_FAILED,
  CREATE_PIPELINE_SUCCESS,
  DELETE_CATEGORY,
  DELETE_CATEGORY_FAILED,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CUSTOM_FIELD,
  DELETE_CUSTOM_FIELD_FAILED,
  DELETE_CUSTOM_FIELD_SUCCESS,
  DELETE_PIPELINE,
  DELETE_PIPELINE_FAILED,
  DELETE_PIPELINE_SUCCESS,
  DELETE_SKILL,
  DELETE_SKILL_FAILED,
  DELETE_SKILL_SUCCESS,
  DISCONNECT_API,
  DISCONNECT_API_FAILED,
  DISCONNECT_API_SUCCESS,
  GET_AI_SETUP,
  GET_AI_SETUP_FAILED,
  GET_AI_SETUP_SUCCESS,
  GET_API_KEY,
  GET_API_KEY_FAILED,
  GET_API_KEY_SUCCESS,
  GET_APPLY_SETTINGS,
  GET_APPLY_SETTINGS_FAILED,
  GET_APPLY_SETTINGS_SUCCESS,
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
  SAVE_APPLY_SETTINGS,
  SAVE_APPLY_SETTINGS_FAILED,
  SAVE_APPLY_SETTINGS_SUCCESS,
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
  GET_TEMPLATE_SETTINGS,
  GET_TEMPLATE_SETTINGS_FAILED,
  GET_TEMPLATE_SETTINGS_SUCCESS,
  SAVE_TEMPLATE_SETTINGS,
  SAVE_TEMPLATE_SETTINGS_FAILED,
  SAVE_TEMPLATE_SETTINGS_SUCCESS,
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

export function* saveBasicInfo({ data }) {
  const response = yield ajaxCall('easyjobs_save_basic_info', {
    form_data: data,
  });
  if (response.status === 'success') {
    yield put({
      type: SAVE_COMPANY_INFO_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_COMPANY_INFO_FAILED,
      error: response.message,
    });
  }
}

export function* saveInfo() {
  yield takeLatest(SAVE_COMPANY_INFO, saveBasicInfo);
}

export function* getApiKey() {
  const response = yield ajaxCall('easyjobs_get_api_key');
  if (response.status === 'success') {
    yield put({
      type: GET_API_KEY_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_API_KEY_FAILED,
      error: response.error,
    });
  }
}

export function* apiKey() {
  yield takeLatest(GET_API_KEY, getApiKey);
}

export function* updateApiKey({ apiKey }) {
  const response = yield ajaxCall('easyjobs_update_api_key', {
    api_key: apiKey,
  });
  if (response.status === 'success') {
    yield put({
      type: UPDATE_API_KEY_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: UPDATE_API_KEY_FAILED,
      error: response.message,
    });
  }
}

export function* updateKey() {
  yield takeLatest(UPDATE_API_KEY, updateApiKey);
}

export function* disconnectApiKey() {
  const response = yield ajaxCall('easyjobs_disconnect_api_key');
  if (response.status === 'success') {
    yield put({
      type: DISCONNECT_API_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: DISCONNECT_API_FAILED,
      error: response.message,
    });
  }
}

export function* disconnectApi() {
  yield takeLatest(DISCONNECT_API, disconnectApiKey);
}

export function* getCustomizerLink() {
  const response = yield ajaxCall('easyjobs_get_customizer_link');
  if (response.status === 'success') {
    yield put({
      type: GET_CUSTOMIZER_LINK_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_CUSTOMIZER_LINK_FAILED,
      error: response.error,
    });
  }
}
export function* customizerLink() {
  yield takeLatest(GET_CUSTOMIZER_LINK, getCustomizerLink);
}

export function* getVerificationCode() {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'verification_code',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_VERIFICATION_CODE_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_VERIFICATION_CODE_FAILED,
      error: response.message,
    });
  }
}
export function* verificationCode() {
  yield takeLatest(GET_VERIFICATION_CODE, getVerificationCode);
}

export function* verifyCompany({ isVerified }) {
  const response = yield ajaxCall('easyjobs_verify_company', {
    is_verified: isVerified,
  });
  if (response.status === 'success') {
    yield put({
      type: VERIFY_COMPANY_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: VERIFY_COMPANY_FAILED,
      error: response.message,
    });
  }
}
export function* verify() {
  yield takeLatest(VERIFY_COMPANY, verifyCompany);
}

export function* getShortcodes() {
  const response = yield ajaxCall('easyjobs_get_shortcodes');
  if (response.status === 'success') {
    yield put({
      type: GET_SHORTCODES_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_SHORTCODES_FAILED,
      error: response.message,
    });
  }
}
export function* shortcodes() {
  yield takeLatest(GET_SHORTCODES, getShortcodes);
}

export function* getPhotosAndColors() {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'photos_and_colors',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_PHOTOS_AND_COLORS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_PHOTOS_AND_COLORS_FAILED,
      error: response.message,
    });
  }
}
export function* photosAndColors() {
  yield takeLatest(GET_PHOTOS_AND_COLORS, getPhotosAndColors);
}

export function* uploadCompanyImage({ image, target }) {
  const response = yield fileUpload(
    'easyjobs_upload_company_image',
    {
      key: 'file',
      name: 'logo.jpg',
      file: image,
    },
    {
      target: target,
    },
  );
  if (response.status === 'success') {
    yield put({
      type: UPLOAD_COMPANY_IMAGE_SUCCESS,
      data: response.data,
      target,
    });
  } else if (response.status === 'error') {
    yield put({
      type: UPLOAD_COMPANY_IMAGE_FAILED,
      error: response.message,
    });
  }
}
export function* uploadImage() {
  yield takeLatest(UPLOAD_COMPANY_IMAGE, uploadCompanyImage);
}

export function* updateBrandColor({ color }) {
  const response = yield ajaxCall('easyjobs_update_brand_color', {
    brand_color: color,
  });
  if (response.status === 'success') {
    yield put({
      type: UPDATE_BRAND_COLOR_SUCCESS,
      data: response.data,
      message: response.message,
    });
  } else if (response.status === 'error') {
    yield put({
      type: UPDATE_BRAND_COLOR_FAILED,
      error: response.message,
    });
  }
}
export function* updateColor() {
  yield takeLatest(UPDATE_BRAND_COLOR, updateBrandColor);
}

export function* updateShowLife({ status }) {
  const response = yield ajaxCall('easyjobs_update_show_life', {
    show_life: status,
  });
  if (response.status === 'success') {
    yield put({
      type: SHOW_LIFE_SUCCESS,
      data: response.data,
      message: response.message,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SHOW_LIFE_FAILED,
      error: response.message,
    });
  }
}
export function* showLife() {
  yield takeLatest(SHOW_LIFE, updateShowLife);
}

export function* getAiSetup() {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'ai_setup',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_AI_SETUP_SUCCESS,
      data: response.data,
      message: response.message,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_AI_SETUP_FAILED,
      error: response.message,
    });
  }
}
export function* aiSetup() {
  yield takeLatest(GET_AI_SETUP, getAiSetup);
}

export function* updateAiSetupData({ data }) {
  const response = yield ajaxCall('easyjobs_update_ai_setup', data);
  if (response.status === 'success') {
    yield put({
      type: UPDATE_AI_SETUP_SUCCESS,
      data: response.data,
      message: response.message,
      sendData: data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: UPDATE_AI_SETUP_FAILED,
      error: response.message,
    });
  }
}
export function* updateAiSetup() {
  yield takeLatest(UPDATE_AI_SETUP, updateAiSetupData);
}

export function* getPipelineSetup() {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'settings_pipeline',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_PIPELINE_SETUP_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_PIPELINE_SETUP_FAILED,
      error: response.message,
    });
  }
}

export function* pipelineSetUp() {
  yield takeLatest(GET_PIPELINE_SETUP, getPipelineSetup);
}

export function* createNewPipeline({ data }) {
  const response = yield ajaxCall('easyjobs_create_pipeline', data);
  if (response.status === 'success') {
    yield put({
      type: CREATE_PIPELINE_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: CREATE_PIPELINE_FAILED,
      error: response.message,
    });
  }
}

export function* pipelineCreate() {
  yield takeLatest(CREATE_PIPELINE, createNewPipeline);
}

export function* updatePipeline({ data }) {
  const response = yield ajaxCall('easyjobs_update_pipeline', data);
  if (response.status === 'success') {
    yield put({
      type: UPDATE_PIPELINE_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: UPDATE_PIPELINE_FAILED,
      error: response.message,
    });
  }
}

export function* pipelineUpdate() {
  yield takeLatest(UPDATE_PIPELINE, updatePipeline);
}

export function* deletePipeline({ pipeline, index }) {
  const response = yield ajaxCall('easyjobs_delete_pipeline', {
    pipeline: pipeline,
    index,
  });
  if (response.status === 'success') {
    yield put({
      type: DELETE_PIPELINE_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: DELETE_PIPELINE_FAILED,
      error: response.message,
    });
  }
}

export function* pipelineDelete() {
  yield takeLatest(DELETE_PIPELINE, deletePipeline);
}

export function* getPackages() {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'packages',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_PACKAGES_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_PACKAGES_FAILED,
      error: response.message,
    });
  }
}

export function* packages() {
  yield takeLatest(GET_PACKAGES, getPackages);
}
export function* getSettingsCategories({ page }) {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'settings_categories',
    params: { page },
  });
  if (response.status === 'success') {
    yield put({
      type: GET_SETTINGS_CATEGORIES_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_SETTINGS_CATEGORIES_FAILED,
      error: response.message,
    });
  }
}

export function* settingsCategories() {
  yield takeLatest(GET_SETTINGS_CATEGORIES, getSettingsCategories);
}

export function* getSettingsSkills({ page }) {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'settings_skills',
    params: { page },
  });
  if (response.status === 'success') {
    yield put({
      type: GET_SETTINGS_SKILLS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_SETTINGS_SKILLS_FAILED,
      error: response.message,
    });
  }
}

export function* settingsSkills() {
  yield takeLatest(GET_SETTINGS_SKILLS, getSettingsSkills);
}

export function* saveSettingsCategory({ category }) {
  const response = yield ajaxCall('easyjobs_post_data', {
    type: 'save_category',
    data: category,
  });
  if (response.status === 'success') {
    yield put({
      type: SAVE_CATEGORY_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_CATEGORY_FAILED,
      error: response.message,
    });
  }
}

export function* saveCategory() {
  yield takeLatest(SAVE_CATEGORY, saveSettingsCategory);
}
export function* saveSettingsSkills({ skill }) {
  const response = yield ajaxCall('easyjobs_post_data', {
    type: 'save_skill',
    data: skill,
  });
  if (response.status === 'success') {
    yield put({
      type: SAVE_SKILL_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_SKILL_FAILED,
      error: response.message,
    });
  }
}

export function* saveSkill() {
  yield takeLatest(SAVE_SKILL, saveSettingsSkills);
}
export function* deleteSettingsCategory({ id }) {
  const response = yield ajaxCall('easyjobs_post_data', {
    type: 'delete_category',
    id,
  });
  if (response.status === 'success') {
    yield put({
      type: DELETE_CATEGORY_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: DELETE_CATEGORY_FAILED,
      error: response.message,
    });
  }
}

export function* deleteCategory() {
  yield takeLatest(DELETE_CATEGORY, deleteSettingsCategory);
}

export function* deleteSettingsSkill({ id }) {
  const response = yield ajaxCall('easyjobs_post_data', {
    type: 'delete_skill',
    id,
  });
  if (response.status === 'success') {
    yield put({
      type: DELETE_SKILL_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: DELETE_SKILL_FAILED,
      error: response.message,
    });
  }
}

export function* deleteSkill() {
  yield takeLatest(DELETE_SKILL, deleteSettingsSkill);
}
export function* getApplySettings() {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'apply_settings',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_APPLY_SETTINGS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_APPLY_SETTINGS_FAILED,
      error: response.message,
    });
  }
}

export function* applySettings() {
  yield takeLatest(GET_APPLY_SETTINGS, getApplySettings);
}
export function* deleteCustomApplyField({ id }) {
  const response = yield ajaxCall('easyjobs_post_data', {
    type: 'delete_custom_field',
    id: id,
  });
  if (response.status === 'success') {
    yield put({
      type: DELETE_CUSTOM_FIELD_SUCCESS,
      data: response.data,
      deleted: id,
    });
  } else if (response.status === 'error') {
    yield put({
      type: DELETE_CUSTOM_FIELD_FAILED,
      error: response.message,
    });
  }
}

export function* deleteApplyField() {
  yield takeLatest(DELETE_CUSTOM_FIELD, deleteCustomApplyField);
}
export function* saveApplySettingsData({ data }) {
  const response = yield ajaxCall('easyjobs_save_apply_settings', data);
  if (response.status === 'success') {
    yield put({
      type: SAVE_APPLY_SETTINGS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_APPLY_SETTINGS_FAILED,
      error: response.message,
    });
  }
}

export function* saveApplySettings() {
  yield takeLatest(SAVE_APPLY_SETTINGS, saveApplySettingsData);
}

export function* getTemplateSettings() {
  const response = yield ajaxCall('easyjobs_get_data', {
    type: 'template_settings',
  });
  if (response.status === 'success') {
    yield put({
      type: GET_TEMPLATE_SETTINGS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: GET_TEMPLATE_SETTINGS_FAILED,
      error: response.message,
    });
  }
}

export function* templateSettings() {
  yield takeLatest(GET_TEMPLATE_SETTINGS, getTemplateSettings);
}

export function* saveTemplateSettings({ template }) {
  const response = yield ajaxCall('easyjobs_save_template_settings', {
    template: template,
  });
  if (response.status === 'success') {
    yield put({
      type: SAVE_TEMPLATE_SETTINGS_SUCCESS,
      data: response.data,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SAVE_TEMPLATE_SETTINGS_FAILED,
      error: response.message,
    });
  }
}

export function* saveTemplate() {
  yield takeLatest(SAVE_TEMPLATE_SETTINGS, saveTemplateSettings);
}

export function* deleteImages({ keys }) {
  const response = yield ajaxCall('easyjobs_delete_company_image', {
    ...keys,
  });
  if (response.status === 'success') {
    yield put({
      type: DELETE_COMPANY_IMAGE_SUCCESS,
      data: response.data,
      message: response.message,
    });
  } else if (response.status === 'failed') {
    yield put({
      type: DELETE_COMPANY_IMAGE_FAILED,
      error: response.message,
    });
  }
}

export function* removeImages() {
  yield takeLatest(DELETE_COMPANY_IMAGE, deleteImages);
}

export function* updateShowCover({ status }) {
  const response = yield ajaxCall('easyjobs_update_show_cover_photo', {
    show_hide_cover_photo: status,
  });
  if (response.status === 'success') {
    yield put({
      type: SHOW_HIDE_COVER_PHOTO_SUCCESS,
      data: response.data,
      message: response.message,
    });
  } else if (response.status === 'error') {
    yield put({
      type: SHOW_HIDE_COVER_PHOTO_FAILED,
      error: response.message,
    });
  }
}
export function* showHideCoverPhotos() {
  yield takeLatest(SHOW_HIDE_COVER_PHOTO, updateShowCover);
}

export function* updateLoginAttach({ data }) {
  const response = yield ajaxCall('easyjobs_update_login_attachment', {
    data,
  });
  if (response.status === 'success') {
    yield put({
      type: UPDATE_LOGIN_ATTACHMENT_SUCCESS,
      data: response.data,
      message: 'Apply settings updated',
    });
  } else if (response.status === 'error') {
    yield put({
      type: UPDATE_LOGIN_ATTACHMENT_FAILED,
      message: 'Apply settings update failed',
    });
  }
}
export function* loginAttachment() {
  yield takeLatest(UPDATE_LOGIN_ATTACHMENT, updateLoginAttach);
}

export default function* rootSaga() {
  yield all([
    saveInfo(),
    apiKey(),
    updateKey(),
    customizerLink(),
    disconnectApi(),
    verify(),
    shortcodes(),
    verificationCode(),
    photosAndColors(),
    uploadImage(),
    updateColor(),
    showLife(),
    aiSetup(),
    updateAiSetup(),
    pipelineSetUp(),
    pipelineCreate(),
    pipelineUpdate(),
    pipelineDelete(),
    packages(),
    settingsCategories(),
    settingsSkills(),
    saveCategory(),
    saveSkill(),
    deleteCategory(),
    deleteSkill(),
    applySettings(),
    deleteApplyField(),
    saveApplySettings(),
    saveTemplate(),
    templateSettings(),
    removeImages(),
    showHideCoverPhotos(),
    loginAttachment(),
  ]);
}
