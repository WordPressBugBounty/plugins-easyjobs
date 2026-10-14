import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  changeStatus,
  getBasiInfo,
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
  resetData,
  saveInformation,
  saveJobRequiredFields,
  saveQuestions,
  saveQuiz,
  setJobId,
  updateJobInfo,
  deleteScreening,
  saveCreatedState,
  saveCreatedCity,
} from '../../redux/actions/jobActions';
import { ARCHIVE_JOB, PUBLISH_JOB } from '../../constants';
import BasicInfoTab from './tabs/BasicInfoTab';
import { getCities, getStates } from '../../redux/actions/addressActions';
import ScreeningQuestionTab from './tabs/ScreeningQuestionTab';
import QuizTab from './tabs/QuizTab';
import { emptyErrors } from '../../redux/actions/settingsActions';
import { toast } from 'react-toastify';
import { getCompanyMetaData } from '../../redux/actions/companyActions';

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
    quizError: state.job.quizError,
    hasRedirect: state.job.hasRedirect,
    jobCreated: state.job.jobCreated,
    jobPublished: state.job.jobPublished,
    jobStatus: state.job.jobStatus,
    isVerified: state.settings.isVerified,
    statusMessage: state.job.statusMessage,
    categories: state.job.categories,
    skills: state.job.skills,
    countries: state.job.countries,
    templates: state.job.jobTemplates,
    companyMetadata: state.settings.metadata,
    isDeletedScreenQuiz: state.job.isDeletedScreenQuiz,
    createdState: state.job.createdState,
    createdCity: state.job.createdCity,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getJobMeta: () => dispatch(getJobCreateMeta()),
    getStates: (country) => dispatch(getStates(country)),
    getCities: (country, state) => dispatch(getCities(country, state)),
    saveInfo: (data) => dispatch(saveInformation(data)),
    getScreeningQuestionMeta: () => dispatch(getScreeningQuestionMeta()),
    deleteScreening: (jobId, tab) => dispatch(deleteScreening(jobId, tab)),
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
    emptyErrors: () => dispatch(emptyErrors()),
    getJobCategories: () => dispatch(getJobCategories()),
    getJobSkills: () => dispatch(getJobSkills()),
    getJobCountries: () => dispatch(getJobCountries()),
    getJobTemplates: (params) => dispatch(getJobTemplates(params)),
    getCompanyMetaData: () => dispatch(getCompanyMetaData()),
    saveCreatedState: (country, state) =>
      dispatch(saveCreatedState(country, state)),
    reset: (keys) => dispatch(resetData(keys)),
    saveCreatedCity: (country, state, city) =>
      dispatch(saveCreatedCity(country, state, city)),
  };
};

const EditJob = ({
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
  match,
  setJobId,
  requiredFieldsUpdated,
  quizError,
  jobPublished,
  jobStatus,
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
  deleteScreening,
  isDeletedScreenQuiz,
  saveCreatedState,
  createdState,
  saveCreatedCity,
  createdCity,
}) => {
  const [completedTabs, setCompletedTabs] = useState([
    'basic-info',
    'screening-question',
    'quiz',
  ]);
  const [currentTab, setCurrentTab] = useState('basic-info');
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const [fields, setFields] = useState({});
  const [showStatus, setShowStatus] = useState(undefined);
  const [alertMessage, setAlertMessage] = useState(undefined);
  const [submitType, setSubmitType] = useState('save');
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    document.title = `Easyjobs - Edit Job ‹ ${easyJobsJs.title} — Wordpress`;
    getJobMeta();
    setCurrentTab('basic-info');
    return () => {
      reset([
        'requiredFieldsUpdated',
        'quizSaved',
        'questionSaved',
        'jobPublished',
        'statusMessage',
        'jobCreated',
        'creatingId',
        'saveJobInfo',
        'quizError',
        'questions',
        'quiz',
        'isDeletedScreenQuiz',
        'saveJobInfoErrors',
        'createdState',
        'createdCity',
      ]);
    };
  }, []);

  useEffect(() => {
    basicInfo && setTitle(` - ${basicInfo.title}`);
  }, [basicInfo]);

  useEffect(() => {
    if (typeof quizError !== 'undefined') {
      if (typeof quizError === 'string') {
        showAlert(false, quizError, 3000);
      } else {
        showAlert(false, quizError?.marks_per_question, 3000);
      }
    }
  }, [quizError]);

  useEffect(() => {
    if (typeof quizError !== 'undefined' && quizSaved) {
      showAlert(true, 'Quiz saved successfully');
    }
  }, [quizSaved]);

  useEffect(() => {
    if (typeof requiredFieldsUpdated !== 'undefined') {
      let msg = '';
      if (requiredFieldsUpdated) {
        setShowFieldsModal(false);
        msg = 'Job apply rules updated successfully.';
      } else {
        msg = 'Failed to update job apply rules.';
      }
      showAlert(requiredFieldsUpdated, msg, 3000);
    }
  }, [requiredFieldsUpdated]);

  useEffect(() => {
    if (match) {
      match.params.id &&
        setJobId(match.params.id) &&
        getBasicInfo(match.params.id);

      match.params.tab && setCurrentTab(match.params.tab);
    }
  }, [match]);

  useEffect(() => {
    if (createData?.company_info?.is_pro && saveJobInfo) {
      setCompletedTabs([...completedTabs, 'basic-info']);
      setCurrentTab('screening-question');
    } else if (saveJobInfo) {
      setCompletedTabs([...completedTabs, 'basic-info']);
      setCurrentTab('quiz');
    }
  }, [saveJobInfo]);

  useEffect(() => {
    if (questionSaved) {
      setCompletedTabs([...completedTabs, 'screening-question']);
      setCurrentTab('quiz');
    }
  }, [questionSaved]);

  useEffect(() => {
    if (quizSaved) {
      setCompletedTabs([...completedTabs, 'quiz']);
    }
  }, [quizSaved]);

  useEffect(() => {
    showFieldsModal && jobId && getJobRequiredFields(jobId);
  }, [showFieldsModal]);

  useEffect(() => {
    requiredFields && setFields(requiredFields);
  }, [requiredFields]);

  useEffect(() => {
    if (jobPublished && jobId) {
      if (jobStatus && jobStatus.status === PUBLISH_JOB) {
        setCurrentTab('basic-info');
        setShowCongratulation(true);
      } else {
        showAlert(true, 'Job archived successfully', 2500);
      }
    }
  }, [jobPublished]);

  useEffect(() => {
    if (statusMessage) {
      statusMessage.type === 'success' && toast.success(statusMessage.message);
      statusMessage.type === 'error' && toast.error(statusMessage.message);
    }
  }, [statusMessage]);

  const { __ } = wp.i18n;

  const showAlert = (status, message, hideAfter = 3000) => {
    setAlertMessage(message);
    setShowStatus(status);
    setTimeout(() => setShowStatus(undefined), hideAfter);
  };

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
      if (typeof createData.editing.meta.apply_rules === 'undefined') {
        setSubmitType('publish');
        setShowFieldsModal(true);
        return;
      }
    }
    jobId && changeStatus(jobId, { status });
  };

  const handleFieldCheck = (e, index, name, key, field = 'selected') => {
    if (typeof index === 'undefined') {
      return;
    }
    if (!name) {
      return;
    }
    const fieldsWithKeys = { ...fields };
    const allFields = [...fieldsWithKeys[key]];

    const relevantFields = ['education_qualification', 'employment_history'];

    if (field === 'selected') {
      if (e.target.checked) {
        if (relevantFields.includes(allFields[index].id)) {
          allFields[index].required = [];
          allFields[index].selected = true;
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
          allFields[index].required = [];
          allFields[index].selected = false;
        } else {
          allFields[index].selected = allFields[index].selected.filter(
            (e) => e !== name,
          );
          allFields[index].required = allFields[index].required.filter(
            (e) => e !== name,
          );
        }
        allFields[index].selectAll = false;
      }
    } else {
      if (e.target.checked) {
        if (relevantFields.includes(allFields[index].id)) {
          allFields[index].selected = allFields[index].rules.map(
            (e) => e.field,
          );
          allFields[index].selectAll = true;
        } else {
          allFields[index].required.push(name);
        }
      } else {
        if (relevantFields.includes(allFields[index].id)) {
          allFields[index].selected = [];
        } else {
          allFields[index].required = allFields[index].required.filter(
            (e) => e !== name,
          );
        }
      }
    }
    fieldsWithKeys[key] = allFields;
    setFields(fieldsWithKeys);
  };

  const handleAllowNoJobExp = (e) => {
    const fieldsWithKeys = { ...fields };
    const allFields = [...fieldsWithKeys['apply_rules']];
    const updatedState = allFields.map((item, idx) => {
      if (idx === 2) {
        return {
          ...item,
          rules: item.rules.map((rule) =>
            rule.field === 'employment.*.allow_no_experience'
              ? { ...rule, visibility: !rule.visibility }
              : rule,
          ),
        };
      }
      return item;
    });

    fieldsWithKeys['apply_rules'] = updatedState;
    setFields(fieldsWithKeys);
  };

  const handleCustomFieldCheck = (e, name, key, field = 'selected') => {
    if (!name) {
      return;
    }
    const fieldsWithKeys = { ...fields };
    const allFields = { ...fieldsWithKeys[key] };

    if (field === 'selected') {
      if (e.target.checked) {
        allFields.selected.push(name);
      } else {
        allFields.selected = allFields.selected.filter((e) => e !== name);
        allFields.required = allFields.required.filter((e) => e !== name);
      }
    } else {
      if (e.target.checked) {
        allFields.required.push(name);
      } else {
        allFields.required = allFields.required.filter((e) => e !== name);
      }
    }

    fieldsWithKeys[key] = allFields;
    setFields(fieldsWithKeys);
  };

  const handleRequiredFieldSubmit = (e, publish = false) => {
    e.preventDefault();
    if (!fields?.apply_rules[0]?.selected?.includes('last_name')) {
      fields.apply_rules[0].selected.unshift('last_name');
    }
    if (!fields?.apply_rules[0]?.selected?.includes('first_name')) {
      fields.apply_rules[0].selected.unshift('first_name');
    }
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
    setSubmitType('save');
    setShowFieldsModal(true);
  };

  return (
    <section
      className={`Job-create-section section-gap ${
        isLoading ? 'ej-loading' : ''
      }`}
    >
      <div className="section-title-wrap">
        <div className="section-title mb-3">
          {__('Edit job', 'easyjobs')} {title}
        </div>
        <div className="ml-auto text-right">
          {createData &&
          createData.editing &&
          createData.editing.status !== PUBLISH_JOB ? (
            <button
              className="button success-button mb-2"
              onClick={(e) => handleStatusChange(e, PUBLISH_JOB)}
            >
              Publish
            </button>
          ) : (
            ''
          )}
          {createData &&
          createData.editing &&
          createData.editing.status === PUBLISH_JOB ? (
            <button
              className="button info-button mb-2"
              onClick={(e) => handleStatusChange(e, ARCHIVE_JOB)}
            >
              Archive
            </button>
          ) : (
            ''
          )}
          <button
            className={`button primary-button mb-2 ml-2 ${
              !completedTabs.includes('basic-info') ? 'disabled-button' : ''
            }`}
            onClick={handleFieldsModal}
          >
            Customize Fields
          </button>
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
          getJobCountries={getJobCountries}
          allCountries={countries}
          isLoading={isLoading}
          getJobTemplates={getJobTemplates}
          company={company}
          templates={templates}
          getCompanyMetaData={getCompanyMetaData}
          companyMetadata={companyMetadata}
          isCreateJob={false}
          saveCreatedState={saveCreatedState}
          createdState={createdState}
          saveCreatedCity={saveCreatedCity}
          createdCity={createdCity}
          reset={reset}
        />
      )}

      {createData?.company_info?.is_pro &&
        currentTab === 'screening-question' && (
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
            isCreateJob={false}
            deleteScreening={deleteScreening}
            isDeletedScreenQuiz={isDeletedScreenQuiz}
            reset={reset}
            quizSaved={quizSaved}
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
          showAlert={showAlert}
          isCreateJob={false}
          deleteScreening={deleteScreening}
          isDeletedScreenQuiz={isDeletedScreenQuiz}
        />
      )}
      {showFieldsModal && (
        <>
          <div className={`modal-backdrop fade show`}></div>
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
                        (Unmarked options will be invisible to the applicants.)
                      </label>
                    </div>

                    <div className="row row-cols-md-2">
                      <div className="col">
                        <div className="custom-field-card">
                          <div className="custom-field-card__head d-flex align-items-center justify-content-between">
                            <span>Basic Information</span>
                            <div className="d-flex align-items-center custom-field-header-col">
                              <div>
                                <span>Show</span>
                              </div>
                              <div>
                                <span>Required</span>
                              </div>
                            </div>
                          </div>
                          <div className="custom-field-card__body">
                            <ul>
                              {fields &&
                                fields?.apply_rules?.[0]?.rules?.map(
                                  (rule, ind) => (
                                    <li className="d-flex align-items-center justify-content-between">
                                      <span className="mr-2">{rule?.name}</span>
                                      <div className="d-flex align-items-center custom-field-header-col">
                                        <div>
                                          <label className="ej-switch">
                                            <input
                                              type="checkbox"
                                              value="first_name"
                                              disabled={
                                                rule.field === 'first_name' ||
                                                rule.field === 'last_name' ||
                                                rule.field === 'email'
                                              }
                                              checked={fields?.apply_rules?.[0]?.selected?.includes(
                                                rule.field,
                                              )}
                                              onChange={(e) =>
                                                handleFieldCheck(
                                                  e,
                                                  0,
                                                  rule.field,
                                                  'apply_rules',
                                                )
                                              }
                                            />
                                            <span className="switch__btn">
                                              <span className="on">on</span>
                                              <span className="off">off</span>
                                            </span>
                                          </label>
                                        </div>
                                        <div>
                                          <label className="ej-switch">
                                            <input
                                              type="checkbox"
                                              value="first_name"
                                              disabled={
                                                rule.field === 'email' ||
                                                rule.field === 'first_name' ||
                                                rule.field === 'last_name' ||
                                                !fields?.apply_rules?.[0]?.selected?.includes(
                                                  rule.field,
                                                )
                                              }
                                              checked={fields?.apply_rules?.[0]?.required?.includes(
                                                rule.field,
                                              )}
                                              onChange={(e) =>
                                                handleFieldCheck(
                                                  e,
                                                  0,
                                                  rule.field,
                                                  'apply_rules',
                                                  'required',
                                                )
                                              }
                                            />
                                            <span
                                              className={`switch__btn ${
                                                fields?.apply_rules?.[0]?.selected?.includes(
                                                  rule.field,
                                                )
                                                  ? ''
                                                  : 'disabled'
                                              }`}
                                            >
                                              <span className="on">Yes</span>
                                              <span className="off">No</span>
                                            </span>
                                          </label>
                                        </div>
                                      </div>
                                    </li>
                                  ),
                                )}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div>
                          <div className="custom-field-card">
                            <div className="custom-field-card__head d-flex align-items-center justify-content-between">
                              <span>Educational Qualification</span>
                              <div className="d-flex align-items-center custom-field-header-col">
                                <div>
                                  <span>Show</span>
                                </div>
                                <div>
                                  <span>Required</span>
                                </div>
                              </div>
                            </div>
                            <div className="custom-field-card__body">
                              <ul>
                                <li className="d-flex align-items-center justify-content-between">
                                  <span className="mr-2">
                                    Following fields are include:
                                  </span>
                                  <div className="d-flex align-items-center custom-field-header-col">
                                    <div>
                                      <label className="ej-switch">
                                        <input
                                          type="checkbox"
                                          checked={
                                            fields &&
                                            fields?.apply_rules?.[1]?.selected
                                          }
                                          onChange={(e) =>
                                            handleFieldCheck(
                                              e,
                                              1,
                                              'education',
                                              'apply_rules',
                                            )
                                          }
                                        />
                                        <span className="switch__btn">
                                          <span className="on">on</span>
                                          <span className="off">off</span>
                                        </span>
                                      </label>
                                    </div>
                                    <div>
                                      <label className="ej-switch">
                                        <input
                                          type="checkbox"
                                          checked={
                                            fields &&
                                            fields?.apply_rules?.[1]?.selected
                                          }
                                          onChange={(e) =>
                                            handleFieldCheck(
                                              e,
                                              1,
                                              'education',
                                              'apply_rules',
                                            )
                                          }
                                        />
                                        <span className="switch__btn">
                                          <span className="on">Yes</span>
                                          <span className="off">No</span>
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                </li>
                                <ul className="sub-list">
                                  {fields &&
                                    fields?.apply_rules?.[1]?.rules?.map(
                                      (rule, ind) => (
                                        <li>
                                          <span>{rule?.name}</span>
                                        </li>
                                      ),
                                    )}
                                </ul>
                              </ul>
                            </div>
                          </div>
                          <div className="custom-field-card">
                            <div className="custom-field-card__head d-flex align-items-center justify-content-between">
                              <span>Employment History</span>
                              <div className="d-flex align-items-center custom-field-header-col">
                                <div>
                                  <span>Show</span>
                                </div>
                                <div>
                                  <span>Required</span>
                                </div>
                              </div>
                            </div>
                            <div className="custom-field-card__body">
                              <ul>
                                <li className="d-flex align-items-center justify-content-between">
                                  <span className="mr-2">
                                    Following fields are include:
                                  </span>
                                  <div className="d-flex align-items-center custom-field-header-col">
                                    <div>
                                      <label className="ej-switch">
                                        <input
                                          type="checkbox"
                                          checked={
                                            fields &&
                                            fields?.apply_rules?.[2]?.selected
                                          }
                                          onChange={(e) =>
                                            handleFieldCheck(
                                              e,
                                              2,
                                              'employment',
                                              'apply_rules',
                                            )
                                          }
                                        />
                                        <span className="switch__btn">
                                          <span className="on">on</span>
                                          <span className="off">off</span>
                                        </span>
                                      </label>
                                    </div>
                                    <div>
                                      <label className="ej-switch">
                                        <input
                                          type="checkbox"
                                          checked={
                                            fields &&
                                            fields?.apply_rules?.[2]?.selected
                                          }
                                          onChange={(e) =>
                                            handleFieldCheck(
                                              e,
                                              2,
                                              'employment',
                                              'apply_rules',
                                            )
                                          }
                                        />
                                        <span className="switch__btn">
                                          <span className="on">Yes</span>
                                          <span className="off">No</span>
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                </li>
                                <ul className="sub-list">
                                  {fields &&
                                    fields?.apply_rules?.[2]?.rules?.map(
                                      (rule, ind) => {
                                        return ind === 4 ? (
                                          <div className="d-flex align-items-center justify-content-between">
                                            <span className="mr-2">
                                              {rule?.name}
                                            </span>
                                            <div className="d-flex align-items-center custom-field-header-col">
                                              <div className="no-experience">
                                                <label className="ej-switch">
                                                  <input
                                                    type="checkbox"
                                                    checked={
                                                      fields &&
                                                      fields?.apply_rules?.[2]
                                                        ?.selected
                                                    }
                                                    onChange={(e) =>
                                                      e.preventDefault()
                                                    }
                                                  />
                                                  <span className="switch__btn">
                                                    <span className="on">
                                                      on
                                                    </span>
                                                    <span className="off">
                                                      off
                                                    </span>
                                                  </span>
                                                </label>
                                              </div>
                                              <div>
                                                <label className="ej-switch">
                                                  <input
                                                    type="checkbox"
                                                    checked={
                                                      fields && rule?.visibility
                                                    }
                                                    onChange={(e) =>
                                                      handleAllowNoJobExp(e)
                                                    }
                                                  />
                                                  <span
                                                    className={`switch__btn`}
                                                  >
                                                    <span className="on">
                                                      On
                                                    </span>
                                                    <span className="off">
                                                      Off
                                                    </span>
                                                  </span>
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <li>
                                            <span>{rule?.name}</span>
                                          </li>
                                        );
                                      },
                                    )}
                                </ul>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="custom-field-card">
                          <div className="custom-field-card__head d-flex align-items-center justify-content-between">
                            <span>Others</span>
                            <div className="d-flex align-items-center custom-field-header-col">
                              <div>
                                <span>Show</span>
                              </div>
                              <div>
                                <span>Required</span>
                              </div>
                            </div>
                          </div>
                          <div className="custom-field-card__body">
                            <ul>
                              {fields &&
                                fields?.apply_rules?.[3]?.rules?.map(
                                  (rule, ind) => (
                                    <li className="d-flex align-items-center justify-content-between">
                                      <span className="mr-2">{rule?.name}</span>
                                      <div className="d-flex align-items-center custom-field-header-col">
                                        <div>
                                          <label className="ej-switch">
                                            <input
                                              type="checkbox"
                                              value="first_name"
                                              checked={fields?.apply_rules?.[3]?.selected?.includes(
                                                rule.field,
                                              )}
                                              onChange={(e) =>
                                                handleFieldCheck(
                                                  e,
                                                  3,
                                                  rule.field,
                                                  'apply_rules',
                                                )
                                              }
                                            />
                                            <span className="switch__btn">
                                              <span className="on">on</span>
                                              <span className="off">off</span>
                                            </span>
                                          </label>
                                        </div>
                                        <div>
                                          <label className="ej-switch">
                                            <input
                                              type="checkbox"
                                              value="first_name"
                                              disabled={
                                                !fields?.apply_rules?.[3]?.selected?.includes(
                                                  rule.field,
                                                )
                                              }
                                              checked={fields?.apply_rules?.[3]?.required?.includes(
                                                rule.field,
                                              )}
                                              onChange={(e) =>
                                                handleFieldCheck(
                                                  e,
                                                  3,
                                                  rule.field,
                                                  'apply_rules',
                                                  'required',
                                                )
                                              }
                                            />
                                            <span
                                              className={`switch__btn ${
                                                fields?.apply_rules?.[3]?.selected?.includes(
                                                  rule.field,
                                                )
                                                  ? ''
                                                  : 'disabled'
                                              }`}
                                            >
                                              <span className="on">Yes</span>
                                              <span className="off">No</span>
                                            </span>
                                          </label>
                                        </div>
                                      </div>
                                    </li>
                                  ),
                                )}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="custom-field-card">
                          <div className="custom-field-card__head d-flex align-items-center justify-content-between">
                            <span>Documents</span>
                            <div className="d-flex align-items-center custom-field-header-col">
                              <div>
                                <span>Show</span>
                              </div>
                              <div>
                                <span>Required</span>
                              </div>
                            </div>
                          </div>
                          <div className="custom-field-card__body">
                            <ul>
                              {fields &&
                                fields?.apply_rules?.[4]?.rules?.map(
                                  (rule, ind) => (
                                    <li className="d-flex align-items-center justify-content-between">
                                      <span className="mr-2">{rule?.name}</span>
                                      <div className="d-flex align-items-center custom-field-header-col">
                                        <div>
                                          <label className="ej-switch">
                                            <input
                                              type="checkbox"
                                              value="first_name"
                                              checked={fields?.apply_rules?.[4]?.selected?.includes(
                                                rule.field,
                                              )}
                                              onChange={(e) =>
                                                handleFieldCheck(
                                                  e,
                                                  4,
                                                  rule.field,
                                                  'apply_rules',
                                                )
                                              }
                                            />
                                            <span className="switch__btn">
                                              <span className="on">on</span>
                                              <span className="off">off</span>
                                            </span>
                                          </label>
                                        </div>
                                        <div>
                                          <label className="ej-switch">
                                            <input
                                              type="checkbox"
                                              value="first_name"
                                              disabled={
                                                !fields?.apply_rules?.[4]?.selected?.includes(
                                                  rule.field,
                                                )
                                              }
                                              checked={fields?.apply_rules?.[4]?.required?.includes(
                                                rule.field,
                                              )}
                                              onChange={(e) =>
                                                handleFieldCheck(
                                                  e,
                                                  4,
                                                  rule.field,
                                                  'apply_rules',
                                                  'required',
                                                )
                                              }
                                            />
                                            <span
                                              className={`switch__btn ${
                                                fields?.apply_rules?.[4]?.selected?.includes(
                                                  rule.field,
                                                )
                                                  ? ''
                                                  : 'disabled'
                                              }`}
                                            >
                                              <span className="on">Yes</span>
                                              <span className="off">No</span>
                                            </span>
                                          </label>
                                        </div>
                                      </div>
                                    </li>
                                  ),
                                )}
                            </ul>
                          </div>
                        </div>
                      </div>
                      {fields && fields?.custom_fields?.rules?.length > 0 && (
                        <div className="col">
                          <div className="custom-field-card">
                            <div className="custom-field-card__head d-flex align-items-center justify-content-between">
                              <span>Custom Fields</span>
                              <div className="d-flex align-items-center custom-field-header-col">
                                <div>
                                  <span>Show</span>
                                </div>
                                <div>
                                  <span>Required</span>
                                </div>
                              </div>
                            </div>
                            <div className="custom-field-card__body">
                              <ul>
                                {fields &&
                                  fields?.custom_fields?.rules?.map(
                                    (rule, ind) => (
                                      <li className="d-flex align-items-center justify-content-between">
                                        <span className="mr-2">
                                          {rule?.name}
                                        </span>
                                        <div className="d-flex align-items-center custom-field-header-col">
                                          <div>
                                            <label className="ej-switch">
                                              <input
                                                type="checkbox"
                                                value="first_name"
                                                checked={fields?.custom_fields?.selected?.includes(
                                                  rule.field,
                                                )}
                                                onChange={(e) =>
                                                  handleCustomFieldCheck(
                                                    e,
                                                    rule.field,
                                                    'custom_fields',
                                                  )
                                                }
                                              />
                                              <span className="switch__btn">
                                                <span className="on">on</span>
                                                <span className="off">off</span>
                                              </span>
                                            </label>
                                          </div>
                                          <div>
                                            <label className="ej-switch">
                                              <input
                                                type="checkbox"
                                                value="first_name"
                                                disabled={
                                                  !fields?.custom_fields?.selected?.includes(
                                                    rule.field,
                                                  )
                                                }
                                                checked={fields?.custom_fields?.required?.includes(
                                                  rule.field,
                                                )}
                                                onChange={(e) =>
                                                  handleCustomFieldCheck(
                                                    e,
                                                    rule.field,
                                                    'custom_fields',
                                                    'required',
                                                  )
                                                }
                                              />
                                              <span
                                                className={`switch__btn ${
                                                  fields?.custom_fields?.selected?.includes(
                                                    rule.field,
                                                  )
                                                    ? ''
                                                    : 'disabled'
                                                }`}
                                              >
                                                <span className="on">Yes</span>
                                                <span className="off">No</span>
                                              </span>
                                            </label>
                                          </div>
                                        </div>
                                      </li>
                                    ),
                                  )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
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
        </>
      )}
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
      {showCongratulation && (
        <>
          <div className={`modal-backdrop fade show`}></div>
          <div className={`modal fade congrates-modal show`}>
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header border-0">
                  <button
                    type="button"
                    className="close ml-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCongratulation(false);
                    }}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body text-center">
                  <h4>Congratulation, your job is published successfully!!</h4>
                  <img
                    src={`${easyJobsJs.plugin_url}admin/assets/img/congrates.png`}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditJob);
