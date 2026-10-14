import { connect } from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';
import {
  getCompanyInfo,
  getCompanyMetaData,
  getMinimalInfo,
} from '../../redux/actions/companyActions';
import {
  getCities,
  getCountries,
  getStates,
  resetAddress,
} from '../../redux/actions/addressActions';
import {
  createPipeline,
  deleteCategory,
  deleteCustomField,
  deletePipeline,
  deleteSkill,
  disconnectApi,
  emptyErrors,
  getAiSetup,
  getApiKey,
  getApplySettings,
  getCustomizerLink,
  getPackages,
  getPhotosAndColors,
  getPipelineSetup,
  getPlans,
  getSettingsCategories,
  getSettingsSkills,
  getShortcodes,
  getVerificationCode,
  getVerificationStatus,
  saveApplySettings,
  saveBasicSettings,
  saveSettingsCategory,
  saveSettingsSkill,
  updateAiSetup,
  updateApiKey,
  updateBrandColor,
  updatePipeline,
  updateShowLife,
  uploadCompanyImage,
  verifyCompany,
  saveTemplateSettings,
  getTemplateSettings,
  resetData,
  removeImages,
  updateShowCoverPhoto,
  updateLoginAttachment,
} from '../../redux/actions/settingsActions';
import BasicInfoTab from './tabs/BasicInfoTab';
import ApiKeyTab from './tabs/ApiKeyTab';
import VerificationTab from './tabs/VerificationTab';
import DesignTab from './tabs/DesignTab';
import ShortcodesTab from './tabs/ShortcodesTab';
import PhotosAndColorsTab from './tabs/PhotosAndColorsTab';
import AITab from './tabs/AITab';
import PipelineTab from './tabs/PipelineTab';
import { toast } from 'react-toastify';
import SubscriptionTab from './tabs/SubscriptionTab';
import ApplySettingsTab from './tabs/ApplySettingsTab';
import CategoryAndSkillsTab from './tabs/CategoryAndSkillsTab';
import TemplateTab from './tabs/TemplateTab';
import PrivacyTab from './tabs/PrivacyTab';
import { useHistory } from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    loading: state.settings.settingsLoading,
    basicInfo: state.settings.basicInfo,
    metadata: state.settings.metadata,
    address: state.address,
    basicInfoError: state.settings.basicInfoError,
    apiKey: state.settings.apiKey,
    apiKeyError: state.settings.apiKeyError,
    customizerLink: state.settings.customizerLink,
    apiDisconnected: state.settings.apiDisconnected,
    isVerified: state.settings.isVerified,
    verificationError: state.settings.verificationError,
    shortcodes: state.settings.shortcodes,
    shortcodesError: state.settings.shortcodesError,
    verificationCode: state.settings.verificationCode,
    photosAndColors: state.settings.photosAndColors,
    errorMessage: state.settings.errorMessage,
    verifiedSuccess: state.settings.verifiedSuccess,
    uploadedImg: state.settings.uploadedImg,
    aiSetup: state.settings.aiSetup,
    aiEnabled: state.settings.aiEnabled,
    statusMessage: state.settings.statusMessage,
    pipelineSetup: state.settings.pipelineSetup,
    updatedPipelines: state.settings.updatedPipelines,
    pipelineDeleted: state.settings.pipelineDeleted,
    packages: state.settings.packages,
    settingsCategories: state.settings.categories,
    settingsSkills: state.settings.skills,
    dataSaved: state.settings.dataSaved,
    applySettings: state.settings.applySettings,
    deletedField: state.settings.deletedField,
    formError: state.settings.formError,
    companyInfo: state.settings.companyInfo,
    templateSettings: state.settings.templateSettings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCompanyInfo: () => dispatch(getCompanyInfo()),
    getCompanyMetaData: () => dispatch(getCompanyMetaData()),
    getCountries: () => dispatch(getCountries()),
    getCities: (country, state) => dispatch(getCities(country, state)),
    getStates: (country) => dispatch(getStates(country)),
    saveBasicInfo: (data) => dispatch(saveBasicSettings(data)),
    getApiKey: () => dispatch(getApiKey()),
    updateApiKey: (apiKey) => dispatch(updateApiKey(apiKey)),
    getCustomizerLink: () => dispatch(getCustomizerLink()),
    disconnectApi: () => dispatch(disconnectApi()),
    verifyCompany: (isVerified) => dispatch(verifyCompany(isVerified)),
    getShortcodes: () => dispatch(getShortcodes()),
    getVerificationCode: () => dispatch(getVerificationCode()),
    uploadCompanyImage: (image, target) =>
      dispatch(uploadCompanyImage(image, target)),
    getPhotosAndColors: () => dispatch(getPhotosAndColors()),
    updateBrandColor: (color) => dispatch(updateBrandColor(color)),
    emptyErrors: () => dispatch(emptyErrors()),
    updateShowLife: (status) => dispatch(updateShowLife(status)),
    updateShowCoverPhoto: (status) => dispatch(updateShowCoverPhoto(status)),
    getAiSetup: () => dispatch(getAiSetup()),
    updateAiSetup: (data) => dispatch(updateAiSetup(data)),
    getPipelineSetup: () => dispatch(getPipelineSetup()),
    createPipeline: (data) => dispatch(createPipeline(data)),
    updatePipeline: (data) => dispatch(updatePipeline(data)),
    deletePipeline: (pipeline, index) =>
      dispatch(deletePipeline(pipeline, index)),
    getPackages: () => dispatch(getPackages()),
    getSettingsCategories: (page) => dispatch(getSettingsCategories(page)),
    getSettingsSkills: (page) => dispatch(getSettingsSkills(page)),
    saveSettingsCategory: (category) =>
      dispatch(saveSettingsCategory(category)),
    saveSettingsSkill: (skill) => dispatch(saveSettingsSkill(skill)),
    deleteCategory: (id) => dispatch(deleteCategory(id)),
    deleteSkill: (id) => dispatch(deleteSkill(id)),
    getApplySettings: () => dispatch(getApplySettings()),
    deleteCustomField: (id) => dispatch(deleteCustomField(id)),
    saveApplySettings: (data) => dispatch(saveApplySettings(data)),
    getMinimalCompanyInfo: () => dispatch(getMinimalInfo()),
    getTemplateSettings: () => dispatch(getTemplateSettings()),
    saveTemplateSettings: (template) =>
      dispatch(saveTemplateSettings(template)),
    reset: (keys) => dispatch(resetData(keys)),
    resetAddress: (keys) => dispatch(resetAddress(keys)),
    removeImages: (keys) => dispatch(removeImages(keys)),
    updateLoginAttachment: (data) => dispatch(updateLoginAttachment(data)),
  };
};
const Settings = ({
  loading,
  getCompanyInfo,
  basicInfo,
  getCompanyMetaData,
  metadata,
  address,
  getCountries,
  getStates,
  getCities,
  saveBasicInfo,
  basicInfoError,
  getApiKey,
  apiKey,
  updateApiKey,
  apiKeyError,
  getCustomizerLink,
  customizerLink,
  disconnectApi,
  apiDisconnected,
  verifyCompany,
  isVerified,
  verificationError,
  getShortcodes,
  shortcodes,
  shortcodesError,
  getVerificationCode,
  verificationCode,
  uploadCompanyImage,
  getPhotosAndColors,
  photosAndColors,
  updateBrandColor,
  emptyErrors,
  updateShowLife,
  verifiedSuccess,
  uploadedImg,
  getAiSetup,
  updateAiSetup,
  aiSetup,
  aiEnabled,
  statusMessage,
  getPipelineSetup,
  pipelineSetup,
  createPipeline,
  updatePipeline,
  updatedPipelines,
  deletePipeline,
  pipelineDeleted,
  getPackages,
  packages,
  getSettingsCategories,
  getSettingsSkills,
  settingsCategories,
  settingsSkills,
  saveSettingsCategory,
  saveSettingsSkill,
  dataSaved,
  deleteCategory,
  deleteSkill,
  getApplySettings,
  applySettings,
  deleteCustomField,
  deletedField,
  saveApplySettings,
  formError,
  getMinimalCompanyInfo,
  companyInfo,
  getTemplateSettings,
  templateSettings,
  saveTemplateSettings,
  reset,
  resetAddress,
  removeImages,
  updateShowCoverPhoto,
  updateLoginAttachment,
  match,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const sidebarRef = useRef(null);
  useEffect(() => {
    document.title = `Easyjobs - Settings ‹ ${easyJobsJs.title} — Wordpress`;
    // Set initial tab from URL parameter on mount
    if (match && match.params && match.params.tab) {
      setCurrentTab(match.params.tab);
    }
    return () => {
      reset(['statusMessage']);
    };
  }, []);

  useEffect(() => {
    if (statusMessage) {
      statusMessage.type === 'success' && toast.success(statusMessage.message);
      statusMessage.type === 'error' && toast.error(statusMessage.message);
    }
  }, [statusMessage]);

  const tabs = [
    {
      key: 'basic',
      name: 'Basic Information',
    },
    {
      key: 'api-key',
      name: 'API Key',
    },
    {
      key: 'template',
      name: 'Template',
    },
    {
      key: 'verification',
      name: 'Verification',
    },
    {
      key: 'photos-colors',
      name: 'Photos and Colors',
    },
    {
      key: 'pipeline',
      name: 'Pipeline Setup',
    },
    {
      key: 'ai-setup',
      name: 'AI Setup',
    },
    {
      key: 'subscription',
      name: 'Subscription',
    },
    {
      key: 'apply-Settings',
      name: 'Candidate Apply Settings',
    },
    {
      key: 'category-skill',
      name: 'Categories & Skills',
    },
    {
      key: 'design',
      name: 'Design',
    },
    {
      key: 'shortcodes',
      name: 'Shortcodes',
    },
    {
      key: 'privacy',
      name: 'Privacy',
    },
  ];
  const [currentTab, setCurrentTab] = useState('basic');
  const [loadingTab, setLoadingTab] = useState(false);
  const history = useHistory();
  const changeTab = (e, key) => {
    if (companyInfo?.is_pro && companyInfo?.subscription_expired) {
      setCurrentTab('subscription');
    } else {
      history.push(`admin.php?page=easyjobs-settings&tab=${key}`);
      setLoadingTab(true);
      e.preventDefault();
      setCurrentTab(key);
      setLoadingTab(false);
      emptyErrors();
      setShowMobileMenu(false);
    }
  };

  useEffect(() => {
    if (
      match &&
      match.params &&
      match.params.tab &&
      match.params.tab !== currentTab
    ) {
      setCurrentTab(match.params.tab);
    }
  }, [match]);

  useEffect(() => {
    if (companyInfo?.is_pro && companyInfo?.subscription_expired) {
      setCurrentTab('subscription');
    }
  }, [companyInfo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  return (
    <>
      {companyInfo?.subscription_expired && (
        <h4 className="pro-expired-message">
          Your subscription package expired, please pay now to continue.
        </h4>
      )}
      <section className="settings-section section-gap">
        <div className="secondary-sidebar setting-menu" ref={sidebarRef}>
          <div
            className="secondary-sidebar-heading setting-control-heading gutter-10"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <div className="section-title">Settings</div>
          </div>
          <div
            className={`secondary-sidebar-body setting-control-body gutter-10 ${
              showMobileMenu ? 'hamburger-menu-show' : ''
            }`}
          >
            <ul className="settings__nav" data-testid="ej-settings-nav">
              {tabs.map((each, i) => (
                <li className="settings__nav__item" key={`settings-${i}`}>
                  <a
                    href="#"
                    data-testid={`ej-settings-tab-${each.key}`}
                    className={`settings__nav__link ${
                      each.key === currentTab ? 'active' : ''
                    }`}
                    onClick={(e) => changeTab(e, each.key)}
                  >
                    {each.name}
                  </a>
                </li>
              ))}
            </ul>
            {/*<a href="#" className="button danger-button w-100">Delete Company</a>*/}
          </div>
        </div>
        <div
          className={`setting-content tabs-wrapper ${
            loadingTab ? 'ej-loading' : ''
          }`}
        >
          {currentTab === 'basic' && (
            <BasicInfoTab
              currentTab={currentTab}
              getBasicInfo={getCompanyInfo}
              basicInfo={basicInfo}
              getCompanyMetaData={getCompanyMetaData}
              metadata={metadata}
              loading={loading}
              address={address}
              getCountries={getCountries}
              getStates={getStates}
              getCities={getCities}
              saveBasicInfo={saveBasicInfo}
              basicInfoError={basicInfoError}
              resetAddress={resetAddress}
            />
          )}
          {currentTab === 'api-key' && (
            <ApiKeyTab
              currentTab={currentTab}
              getApiKey={getApiKey}
              apiKey={apiKey}
              updateApiKey={updateApiKey}
              loading={loading}
              apiKeyError={apiKeyError}
              disconnectApi={disconnectApi}
              apiDisconnected={apiDisconnected}
            />
          )}
          {currentTab === 'template' && (
            <TemplateTab
              templateSettings={templateSettings}
              getTemplateSettings={getTemplateSettings}
              loading={loading}
              saveTemplateSettings={saveTemplateSettings}
            />
          )}
          {currentTab === 'verification' && (
            <VerificationTab
              currentTab={currentTab}
              loading={loading}
              verifyCompany={verifyCompany}
              isVerified={isVerified}
              verificationError={verificationError}
              getVerificationCode={getVerificationCode}
              verificationCode={verificationCode}
              verifiedSuccess={verifiedSuccess}
            />
          )}
          {currentTab === 'design' && (
            <DesignTab
              currentTab={currentTab}
              loading={loading}
              getCustomizerLink={getCustomizerLink}
              customizerLink={customizerLink}
            />
          )}
          {currentTab === 'photos-colors' && (
            <PhotosAndColorsTab
              currentTab={currentTab}
              loading={loading}
              getPhotosAndColors={getPhotosAndColors}
              photosAndColors={photosAndColors}
              uploadCompanyImage={uploadCompanyImage}
              updateBrandColor={updateBrandColor}
              updateShowLife={updateShowLife}
              uploadedImg={uploadedImg}
              statusMessage={statusMessage}
              removeImages={removeImages}
              updateShowCoverPhoto={updateShowCoverPhoto}
              reset={reset}
            />
          )}
          {currentTab === 'privacy' && <PrivacyTab currentTab={currentTab} />}
          {currentTab === 'shortcodes' && (
            <ShortcodesTab
              currentTab={currentTab}
              loading={loading}
              getShortcodes={getShortcodes}
              shortcodes={shortcodes}
              shortcodesError={shortcodesError}
            />
          )}
          {currentTab === 'pipeline' && (
            <PipelineTab
              currentTab={currentTab}
              loading={loading}
              getPipelineSetup={getPipelineSetup}
              pipelineSetup={pipelineSetup}
              createPipeline={createPipeline}
              updatePipeline={updatePipeline}
              updatedPipelines={updatedPipelines}
              statusMessage={statusMessage}
              deletePipeline={deletePipeline}
              pipelineDeleted={pipelineDeleted}
            />
          )}
          {currentTab === 'ai-setup' && (
            <AITab
              currentTab={currentTab}
              loading={loading}
              getAiSetup={getAiSetup}
              updateAiSetup={updateAiSetup}
              aiSetup={aiSetup}
              aiEnabled={aiEnabled}
              statusMessage={statusMessage}
              getMinimalCompanyInfo={getMinimalCompanyInfo}
              companyInfo={companyInfo}
            />
          )}
          {currentTab === 'subscription' && (
            <SubscriptionTab
              currentTab={currentTab}
              loading={loading}
              getPackages={getPackages}
              allPackages={packages}
            />
          )}
          {currentTab === 'apply-Settings' && (
            <ApplySettingsTab
              currentTab={currentTab}
              loading={loading}
              getApplySettings={getApplySettings}
              applySettings={applySettings}
              deleteCustomField={deleteCustomField}
              deletedField={deletedField}
              saveApplySettings={saveApplySettings}
              formError={formError}
              updateLoginAttachment={updateLoginAttachment}
            />
          )}
          {currentTab === 'category-skill' && (
            <CategoryAndSkillsTab
              currentTab={currentTab}
              loading={loading}
              getSettingsCategories={getSettingsCategories}
              getSettingsSkills={getSettingsSkills}
              settingsCategories={settingsCategories}
              settingsSkills={settingsSkills}
              saveSettingsCategory={saveSettingsCategory}
              saveSettingsSkill={saveSettingsSkill}
              dataSaved={dataSaved}
              deleteCategory={deleteCategory}
              deleteSkill={deleteSkill}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
