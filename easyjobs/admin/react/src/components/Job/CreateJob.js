import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  changeStatus,
  getBasiInfo,
  getInitialJobTemplates,
  getJobCategories,
  getJobCountries,
  getJobCreateMeta,
  getJobRequiredFields,
  getJobSkills,
  getJobTemplates,
  getQuestions,
  getQuiz,
  getQuizMeta,
  getScreeningQuestionMeta,
  saveInformation,
  saveJobRequiredFields,
  saveQuestions,
  saveQuiz,
  setJobId,
  updateJobInfo,
  resetData,
  saveCreatedState,
  saveCreatedCity,
} from '../../redux/actions/jobActions';
import { ARCHIVE_JOB, PUBLISH_JOB } from '../../constants';
import BasicInfoTab from './tabs/BasicInfoTab';
import { getStates } from '../../redux/actions/addressActions';
import { getCities } from '../../redux/actions/addressActions';
import ScreeningQuestionTab from './tabs/ScreeningQuestionTab';
import QuizTab from './tabs/QuizTab';
import {
  getCompanyInfo,
  getCompanyMetaData,
} from '../../redux/actions/companyActions';
import {
  emptyErrors,
  getVerificationStatus,
} from '../../redux/actions/settingsActions';
import { toast } from 'react-toastify';

const mapStateToProps = (state) => {
  return {
    createData: state.job.createData,
    countryStates: state.job.countryStates,
    cities: state.job.cities,
    saveJobInfoErrors: state.job.saveJobInfoErrors,
    saveJobInfo: state.job.saveJobInfo,
    screeningMeta: state.job.screeningMeta,
    isLoading: state.job.loading,
    questionSaved: state.job.questionSaved,
    quizMeta: state.job.quizMeta,
    quizSaved: state.job.quizSaved,
    jobId: state.job.creatingId,
    basicInfo: state.job.basicInfo,
    questions: state.job.questions,
    quiz: state.job.quiz,
    requiredFields: state.job.requiredFields,
    requiredFieldsUpdated: state.job.requiredFieldsUpdated,
    hasRedirect: state.job.hasRedirect,
    jobPublished: state.job.jobPublished,
    isVerified: state.settings.isVerified,
    statusMessage: state.job.statusMessage,
    categories: state.job.categories,
    skills: state.job.skills,
    countries: state.job.countries,
    company: state.job.company,
    templates: state.job.jobTemplates,
    companyMetadata: state.settings.metadata,
    createdState: state.job.createdState,
    createdCity: state.job.createdCity,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCompanyInfo: () => dispatch(getCompanyInfo()),
    getJobMeta: () => dispatch(getJobCreateMeta()),
    getStates: (country) => dispatch(getStates(country)),
    getCities: (country, state) => dispatch(getCities(country, state)),
    saveInfo: (data) => dispatch(saveInformation(data)),
    getScreeningQuestionMeta: () => dispatch(getScreeningQuestionMeta()),
    saveQuestions: (jobId, questions, description, instruction) =>
      dispatch(saveQuestions(jobId, questions, description, instruction)),
    getQuizMeta: () => dispatch(getQuizMeta()),
    saveQuiz: (jobId, data) => dispatch(saveQuiz(jobId, data)),
    changeStatus: (jobId, status) => dispatch(changeStatus(jobId, status)),
    getBasicInfo: (jobId) => dispatch(getBasiInfo(jobId)),
    getQuestions: (jobId) => dispatch(getQuestions(jobId)),
    getQuiz: (jobId) => dispatch(getQuiz(jobId)),
    updateJobInfo: (jobId, data) => dispatch(updateJobInfo(jobId, data)),
    getJobRequiredFields: (jobId) => dispatch(getJobRequiredFields(jobId)),
    saveJobRequiredFields: (jobId, data, hasRedirect) =>
      dispatch(saveJobRequiredFields(jobId, data, hasRedirect)),
    setJobId: (jobId) => dispatch(setJobId(jobId)),
    getVerificationStatus: () => dispatch(getVerificationStatus()),
    emptyErrors: () => dispatch(emptyErrors()),
    getJobCategories: () => dispatch(getJobCategories()),
    getJobSkills: () => dispatch(getJobSkills()),
    getJobCountries: () => dispatch(getJobCountries()),
    getJobTemplates: (params) => dispatch(getJobTemplates(params)),
    getCompanyMetaData: () => dispatch(getCompanyMetaData()),
    reset: (keys) => dispatch(resetData(keys)),
    saveCreatedState: (country, state) =>
      dispatch(saveCreatedState(country, state)),
    saveCreatedCity: (country, state, city) =>
      dispatch(saveCreatedCity(country, state, city)),
  };
};

const CreateJob = ({
  createData,
  countryStates,
  cities,
  getJobMeta,
  getStates,
  getCities,
  saveInfo,
  saveJobInfo,
  saveJobInfoErrors,
  screeningMeta,
  getScreeningQuestionMeta,
  saveQuestions,
  isLoading,
  questionSaved,
  getQuizMeta,
  quizMeta,
  saveQuiz,
  quizSaved,
  changeStatus,
  jobId,
  getBasicInfo,
  getQuestions,
  getQuiz,
  basicInfo,
  questions,
  quiz,
  updateJobInfo,
  getJobRequiredFields,
  requiredFields,
  saveJobRequiredFields,
  requiredFieldsUpdated,
  history,
  jobPublished,
  isVerified,
  statusMessage,
  emptyErrors,
  getJobCategories,
  getJobSkills,
  categories,
  skills,
  getJobCountries,
  countries,
  getJobTemplates,
  company,
  templates,
  getCompanyMetaData,
  companyMetadata,
  reset,
  saveCreatedState,
  createdState,
  saveCreatedCity,
  createdCity,
}) => {
  const [completedTabs, setCompletedTabs] = useState([]);
  const [currentTab, setCurrentTab] = useState('basic-info');
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const [fields, setFields] = useState({});
  const [showStatus, setShowStatus] = useState(undefined);
  const [alertMessage, setAlertMessage] = useState(undefined);
  const [submitType, setSubmitType] = useState('save');
  const [requiredFieldsSaved, setRequiredFieldsSaved] = useState(false);
  const [showLimitAlert, setShowLimitAlert] = useState(undefined);
  const [subscriptionExpired, setSubscriptionExpired] = useState(undefined);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    document.title = `Easyjobs - Create Job ‹ ${easyJobsJs.title} — Wordpress`;
    getJobMeta();
    if (firstLoad) {
      setFirstLoad(false);
    }
    reset(['quiz', 'questions']);
    return () => {
      reset([
        'requiredFieldsUpdated',
        'quizSaved',
        'jobPublished',
        'statusMessage',
        'jobCreated',
        'saveJobInfoErrors',
        'createdState',
        'createdCity',
      ]);
    };
  }, []);

  useEffect(() => {
    reset([
      'requiredFieldsUpdated',
      'statusMessage',
      'saveJobInfo',
      'questionSaved',
      'quizSaved',
      'basicInfo',
      'saveJobInfoErrors',
      // 'questions',
      // 'quiz',
    ]);
  }, [
    questionSaved,
    saveJobInfo,
    quizSaved,
    basicInfo,
    questions,
    quiz,
    statusMessage,
  ]);

  useEffect(() => {
    if (createData?.company_info?.is_pro && saveJobInfo && !firstLoad) {
      setCompletedTabs([...completedTabs, 'basic-info']);
      setCurrentTab('screening-question');
      if (jobId) {
        history.push(
          `/wp-admin/admin.php?page=easyjobs-edit&id=${jobId}&tab=screening-question`,
        );
      }
    } else if (saveJobInfo && !firstLoad) {
      setCompletedTabs([...completedTabs, 'basic-info']);
      setCurrentTab('quiz');
      if (jobId) {
        history.push(
          `/wp-admin/admin.php?page=easyjobs-edit&id=${jobId}&tab=quiz`,
        );
      }
    }
  }, [saveJobInfo]);

  /*useEffect(() => {
    if (questionSaved && !firstLoad) {
      setCompletedTabs([...completedTabs, 'screening-question']);
      setCurrentTab('quiz');
    }
  }, [questionSaved]);

  useEffect(() => {
    if (quizSaved) {
      setCompletedTabs([...completedTabs, 'quiz']);
    }
  }, [quizSaved]);*/

  useEffect(() => {
    if (typeof requiredFieldsUpdated !== 'undefined' && !firstLoad) {
      if (requiredFieldsUpdated) {
        setTimeout(() => setShowFieldsModal(false), 200);
        setAlertMessage('Job apply rules updated successfully.');
        setRequiredFieldsSaved(true);
      } else {
        setAlertMessage('Failed to update job apply rules.');
        setRequiredFieldsSaved(false);
      }
      setShowStatus(requiredFieldsUpdated);
      setTimeout(() => setShowStatus(undefined), 3000);
    }
  }, [requiredFieldsUpdated]);

  useEffect(() => {
    if (jobPublished) {
      if (jobId) {
        history.push(`/wp-admin/admin.php?page=easyjobs-edit&id=${jobId}`);
      }
    }
  }, [jobPublished]);

  useEffect(() => {
    if (statusMessage && !firstLoad) {
      statusMessage.type === 'success' && toast.success(statusMessage.message);
      statusMessage.type === 'error' && toast.error(statusMessage.message);
    }
  }, [statusMessage]);

  useEffect(() => {
    if (createData && createData.company_info) {
      if (
        createData.stats &&
        !createData.company_info.is_pro &&
        parseInt(createData.company_info.stats.published_jobs) >= 1
      ) {
        setShowLimitAlert(true);
      }
      if (createData.company_info.subscription_expired) {
        setSubscriptionExpired(true);
        setShowLimitAlert(true);
      }
    } else {
      setShowLimitAlert(false);
    }
    /*createData &&
      createData.company_info &&
      !createData.company_info.is_pro &&
      createData.company_info.stats &&
      parseInt(createData.company_info.stats.published_jobs) === 1 &&
      setShowLimitAlert(true);*/
  }, [createData]);

  useEffect(() => {
    showFieldsModal && jobId && getJobRequiredFields(jobId);
  }, [showFieldsModal]);

  useEffect(() => {
    requiredFields && setFields(requiredFields);
  }, [requiredFields]);

  const { __ } = wp.i18n;

  const changeTab = (e, name) => {
    e.preventDefault();
    if (completedTabs.includes('basic-info')) {
      setCurrentTab(name);
      emptyErrors();
    }
  };

  const handleStatusChange = (e, status) => {
    e.preventDefault();
    if (status === PUBLISH_JOB) {
      if (!requiredFieldsSaved) {
        setSubmitType('publish');
        setShowFieldsModal(true);
        return;
      }
    }
    jobId && changeStatus(jobId, { status });
  };

  const showAlert = (status, message, hideAfter = 3000) => {
    setAlertMessage(message);
    setShowStatus(status);
    setTimeout(() => setShowStatus(undefined), hideAfter);
  };

  const handleFieldCheck = (e, index, name, key) => {
    if (typeof index === 'undefined') {
      return;
    }
    if (!name) {
      return;
    }
    const fieldsWithKeys = { ...fields };
    const allFields = [...fieldsWithKeys[key]];

    const relevantFields = ['education_qualification', 'employment_history'];

    if (e.target.checked) {
      if (relevantFields.includes(allFields[index].id)) {
        allFields[index].selected = allFields[index].rules.map((e) => e.field);
        allFields[index].selectAll = true;
      } else {
        allFields[index].selected.push(name);
        if (
          allFields[index].selected.length === allFields[index].rules.length
        ) {
          allFields[index].selectAll = true;
        }
      }
    } else {
      if (relevantFields.includes(allFields[index].id)) {
        allFields[index].selected = [];
      } else {
        allFields[index].selected = allFields[index].selected.filter(
          (e) => e !== name,
        );
      }
      allFields[index].selectAll = false;
    }
    fieldsWithKeys[key] = allFields;
    setFields(fieldsWithKeys);
  };

  const handleAllCheck = (e, index, key) => {
    if (typeof index === 'undefined') {
      return;
    }
    const fieldsWithKeys = { ...fields };
    const allFields = [...fieldsWithKeys[key]];
    if (e.target.checked) {
      allFields[index].selected = allFields[index].rules.map(
        (each) => each.field,
      );
      allFields[index].selectAll = true;
    } else {
      allFields[index].selectAll = false;
      allFields[index].selected = [];
    }

    fieldsWithKeys[key] = allFields;
    setFields(fieldsWithKeys);
  };

  const handleRequiredFieldSubmit = (e, publish = false) => {
    e.preventDefault();
    if (jobId) {
      if (publish) {
        saveJobRequiredFields(jobId, fields, true);
        if (basicInfo) {
          basicInfo.status !== PUBLISH_JOB &&
            changeStatus(jobId, { status: PUBLISH_JOB });
        } else {
          changeStatus(jobId, { status: PUBLISH_JOB });
        }
      } else {
        saveJobRequiredFields(jobId, fields, false);
      }
    }
  };

  const handleFieldsModal = (e) => {
    e.preventDefault();
    if (!completedTabs.includes('basic-info')) {
      return;
    }
    setShowFieldsModal(true);
  };
  const hideLimitAlert = (e) => {
    e.preventDefault();
    setShowLimitAlert(false);
  };
  return (
    <section
      className={`Job-create-section section-gap ${
        isLoading ? 'ej-loading' : ''
      }`}
    >
      {showLimitAlert && (
        <div className="alert alert-warning ej-job-limit-alert">
          <i className="dashicons dashicons-warning"></i>
          {(subscriptionExpired && (
            <>
              Your Easyjobs subscription is expired. Your job will be created
              but it will saved as draft. Please{' '}
              <a href={`${easyJobsJs.easyjobs_app_url}/my-account`}>
                Update subscription
              </a>{' '}
              for publish more than one job.
            </>
          )) || (
            <>
              You have Easyjobs free account and you can publish only one job.
              Your job will be created but it will saved as draft. Please{' '}
              <a
                href={`${easyJobsJs.easyjobs_app_url}/my-account`}
                target="_blank"
              >
                {' '}
                <strong> Upgrade to pro </strong>{' '}
              </a>{' '}
              for publish more than one job.
            </>
          )}
          <span
            className="close dashicons dashicons-no-alt"
            onClick={(e) => hideLimitAlert(e)}
          ></span>
        </div>
      )}
      <div className="section-title-wrap">
        <div className="section-title mb-3">
          {__('Create a New Job', 'easyjobs')}
        </div>
      </div>
      <ul className="progress-step-group">
        <li className="progress-step__wrap">
          <div
            className={`progress-step ${
              currentTab === 'basic-info' ? 'progress-step--activated' : ''
            }`}
            onClick={(e) => changeTab(e, 'basic-info')}
          >
            <div className="progress-step__icon">
              <div className="easyjobs-icon easyjobs-tick"></div>
            </div>
            <div className="progress-step__text">Informations</div>
          </div>
        </li>
        {createData?.company_info?.is_pro && (
          <li className="progress-step__wrap">
            <div
              className={`progress-step ${
                currentTab === 'screening-question'
                  ? 'progress-step--activated'
                  : ''
              }`}
              onClick={(e) => changeTab(e, 'screening-question')}
            >
              <div className="progress-step__icon">
                <div className="easyjobs-icon easyjobs-tick"></div>
              </div>
              <div className="progress-step__text">Screening Questions</div>
            </div>
          </li>
        )}
        <li className="progress-step__wrap">
          <div
            className={`progress-step ${
              currentTab === 'quiz' ? 'progress-step--activated' : ''
            }`}
            onClick={(e) => changeTab(e, 'quiz')}
          >
            <div className="progress-step__icon">
              <div className="easyjobs-icon easyjobs-tick"></div>
            </div>
            <div className="progress-step__text">Quiz</div>
          </div>
        </li>
      </ul>

      {currentTab === 'basic-info' && (
        <BasicInfoTab
          createData={createData}
          setCompletedTabs={setCompletedTabs}
          getStates={getStates}
          countryStates={countryStates}
          getCities={getCities}
          cities={cities}
          saveInfo={saveInfo}
          saveJobInfoErrors={saveJobInfoErrors}
          saveJobInfo={saveJobInfo}
          jobId={jobId}
          getBasicInfo={getBasicInfo}
          basicInfo={basicInfo}
          updateJobInfo={updateJobInfo}
          getJobCategories={getJobCategories}
          getJobSkills={getJobSkills}
          allCategories={categories}
          allSkills={skills}
          allCountries={countries}
          getJobCountries={getJobCountries}
          isLoading={isLoading}
          getJobTemplates={getJobTemplates}
          company={company}
          templates={templates}
          getCompanyMetaData={getCompanyMetaData}
          companyMetadata={companyMetadata}
          isCreateJob={true}
          saveCreatedState={saveCreatedState}
          createdState={createdState}
          saveCreatedCity={saveCreatedCity}
          createdCity={createdCity}
          reset={reset}
        />
      )}

      {/* {currentTab === 'screening-question' && (
        <ScreeningQuestionTab
          getScreeningQuestionMeta={getScreeningQuestionMeta}
          screeningMeta={screeningMeta}
          createData={createData}
          saveQuestions={saveQuestions}
          getQuestions={getQuestions}
          screeningQuestions={questions}
          jobId={jobId}
          changeTab={changeTab}
          showAlert={showAlert}
          isCreateJob={true}
        />
      )}

      {currentTab === 'quiz' && (
        <QuizTab
          createData={createData}
          getQuizMeta={getQuizMeta}
          quizMeta={quizMeta}
          saveQuiz={saveQuiz}
          getQuiz={getQuiz}
          quiz={quiz}
          jobId={jobId}
          quizSaved={quizSaved}
          setShowFieldsModal={setShowFieldsModal}
          changeTab={changeTab}
          setSubmitType={setSubmitType}
          setShowStatus={setShowStatus}
          setAlertMessage={setAlertMessage}
          showAlert={showAlert}
          isCreateJob={true}
        />
      )} */}
      {showFieldsModal && (
        <div className={`modal fade custom-fields show`}>
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <form>
                <div className="modal-header">
                  <h4 className="modal-title">Custom Job Apply Field</h4>
                  <button
                    type="button"
                    className="close"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowFieldsModal(false);
                    }}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="">
                      Mark the information that you want from the applicants
                      (Unmarked option will be invisible to the applicants.)
                    </label>
                  </div>
                  {(Object.keys(fields).length && (
                    <div className="row row-cols-md-3">
                      {Object.keys(fields).map((key) =>
                        fields[key].map(
                          (each, index) =>
                            (each.rules.length && (
                              <div className="col" key={`field-${index}`}>
                                <div className="custom-field-card">
                                  <div className="custom-field-card__head">
                                    <label className="checkbox">
                                      <input
                                        type="checkbox"
                                        checked={each.selectAll}
                                        onChange={(e) =>
                                          handleAllCheck(e, index, key)
                                        }
                                      />
                                      <span>{each.name}</span>
                                    </label>
                                  </div>
                                  <div className="custom-field-card__body">
                                    <ul>
                                      {each.rules.map((rule, i) => (
                                        <li key={`rule-${i}`}>
                                          <label className="checkbox">
                                            <input
                                              type="checkbox"
                                              checked={
                                                each.selected.length
                                                  ? each.selected.includes(
                                                      rule.field,
                                                    )
                                                  : false
                                              }
                                              onChange={(e) =>
                                                handleFieldCheck(
                                                  e,
                                                  index,
                                                  rule.field,
                                                  key,
                                                )
                                              }
                                            />
                                            <span>{rule.name}</span>
                                          </label>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )) ||
                            '',
                        ),
                      )}
                    </div>
                  )) ||
                    ''}

                  <div className="custom-field-card auto-height">
                    <div className="custom-field-card__body">
                      <div className="form-note">
                        <span>TIPS: </span>Fields of ‘Educational Qualification’
                        are relevant, field can’t be chosen partially.
                      </div>
                      <div className="form-note">
                        <span>TIPS: </span>Fields of ‘Employment History’ are
                        relevant, field can’t be chosen partially.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <button
                    className="button semi-button-info"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowFieldsModal(false);
                    }}
                  >
                    Back
                  </button>
                  {(submitType === 'save' && (
                    <button
                      className="button info-button"
                      type="submit"
                      onClick={(e) => handleRequiredFieldSubmit(e, false)}
                    >
                      Save & Continue
                    </button>
                  )) || (
                    <button
                      className="button success-button"
                      type="submit"
                      onClick={(e) => handleRequiredFieldSubmit(e, true)}
                    >
                      Save & Publish
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showFieldsModal && <div className={`modal-backdrop fade show`}></div>}
      {
        <div
          className={`custom-fields-status ${
            typeof showStatus !== 'undefined'
              ? showStatus
                ? 'success-status show'
                : 'error-status show'
              : ''
          }`}
        >
          {alertMessage && alertMessage}
        </div>
      }
    </section>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateJob);
