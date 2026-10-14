import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import { findDuplicate } from '../../../util/helper';

const ScreeningQuestionTab = ({
  getScreeningQuestionMeta,
  screeningMeta,
  createData,
  saveQuestions,
  getQuestions,
  screeningQuestions,
  jobId,
  changeTab,
  isCreateJob,
  deleteScreening,
  isDeletedScreenQuiz,
  reset,
  quizSaved,
}) => {
  const [existingQuestionSet, setExistingQuestionSet] = useState([]);
  const [questionType, setQuestionType] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionsError, setQuestionError] = useState([]);
  const [description, setDescription] = useState('');
  const [instruction, setInstruction] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [isScreeningEdit, setIsScreeningEdit] = useState(false);
  const [removeModalShowHide, setRemoveModalShowHide] = useState({
    display: 'none',
  });
  const [editModalShowHide, setEditModalShowHide] = useState({
    display: 'none',
  });

  const existingQuestionRef = useRef(null);

  useEffect(() => {
    getScreeningQuestionMeta();
    reset(['quizSaved']);
  }, []);

  useEffect(() => {
    if (screeningMeta) {
      setExistingQuestionSet([...screeningMeta.question_set]);
      setQuestionType([...screeningMeta.question_types]);
    }
  }, [screeningMeta]);

  useEffect(() => {
    jobId && getQuestions(jobId);
  }, [jobId]);

  useEffect(() => {
    screeningQuestions &&
      screeningQuestions.questions.length &&
      !isCreateJob &&
      setQuestions(screeningQuestions.questions);
    screeningQuestions &&
      screeningQuestions.screening_group &&
      setDescription(
        screeningQuestions.screening_group.internal_note
          ? screeningQuestions.screening_group.internal_note
          : '',
      );
    screeningQuestions &&
      screeningQuestions.screening_group &&
      setInstruction(
        screeningQuestions.screening_group.note
          ? screeningQuestions.screening_group.note
          : '',
      );
    screeningQuestions &&
      screeningQuestions?.applicant_count === 0 &&
      setIsScreeningEdit(true);
  }, [screeningQuestions]);

  useEffect(() => {
    if (isDeletedScreenQuiz) {
      if (existingQuestionRef?.current?.value) {
        existingQuestionRef.current.value = 'none';
      }
      setQuestions([]);
      setDescription('');
      setInstruction('');
      if (screeningQuestions && screeningQuestions?.applicant_count === 0) {
        setIsScreeningEdit(true);
      } else {
        setIsScreeningEdit(false);
      }
    }
  }, [isDeletedScreenQuiz]);

  const handleInput = (e, index, name) => {
    const allQuestion = [...questions];
    if (name === 'type') {
      const [type] = questionType.filter(
        (type) => type.id === parseInt(e.target.value),
      );
      allQuestion[index][name] = type;
    } else if (name === 'required') {
      allQuestion[index][name] = e.target.checked ? 1 : 0;
    } else {
      allQuestion[index][name] = e.target.value;
    }
    setQuestionError([]);
    setQuestions(allQuestion);
  };

  const addOption = (e, questionIndex) => {
    e.preventDefault();
    const allQuestion = [...questions];
    allQuestion[questionIndex]['options'].push({
      id: allQuestion[questionIndex]['options'].length,
      title: '',
    });

    setQuestions(allQuestion);
  };

  const setCorrectAnswer = (e, questionIndex, optionIndex) => {
    const allQuestion = [...questions];
    if (e.target.checked) {
      allQuestion[questionIndex]['answers'].push(optionIndex.toString());
    } else {
      allQuestion[questionIndex]['answers'] = allQuestion[questionIndex][
        'answers'
      ].filter((answer) => parseInt(answer) !== optionIndex);
    }
    setQuestions(allQuestion);
  };

  const setOptionTitle = (e, questionIndex, optionIndex) => {
    const allQuestion = [...questions];
    allQuestion[questionIndex]['options'][optionIndex]['title'] =
      e.target.value;
    setQuestions(allQuestion);
  };

  const removeOption = (e, questionIndex, optionIndex) => {
    e.preventDefault();
    const allQuestion = [...questions];
    allQuestion[questionIndex]['options'] = allQuestion[questionIndex][
      'options'
    ].filter((option, i) => optionIndex !== i);
    if (
      allQuestion[questionIndex]['answers'].includes(optionIndex.toString())
    ) {
      allQuestion[questionIndex]['answers'] = allQuestion[questionIndex][
        'answers'
      ].filter((ans) => parseInt(ans) !== optionIndex);
    }
    setQuestions(allQuestion);
  };

  const addQuestion = (e) => {
    e.preventDefault();
    const allQuestions = [...questions];
    if (findDuplicate(allQuestions)) {
      toast.error("You can't duplicate question.");
      return;
    }
    if (allQuestions.length === 0) {
      setQuestions([
        ...allQuestions,
        {
          id: null,
          title: '',
          type: {
            id: 1,
            name: 'Text',
          },
          options: [
            {
              id: 0,
              title: '',
            },
            {
              id: 1,
              title: '',
            },
          ],
          answers: [],
          required: 0,
        },
      ]);
    } else {
      if (validateQuestions(allQuestions)) {
        setQuestions([
          ...allQuestions,
          {
            id: null,
            title: '',
            type: {
              id: 1,
              name: 'Text',
            },
            options: [
              {
                id: 0,
                title: '',
              },
              {
                id: 1,
                title: '',
              },
            ],
            answers: [],
            required: 0,
          },
        ]);
      }
    }
  };

  const handleNotes = (e, name) => {
    if (name === 'internal_note') {
      setDescription(e.target.value);
      setDescriptionError('');
    } else if (name === 'note') {
      setInstruction(e);
    }
  };

  const deleteQuestion = (e, questionIndex) => {
    e.preventDefault();
    setQuestions(questions.filter((question, i) => questionIndex !== i));
    setQuestionError(questionsError.filter((each, i) => i !== questionIndex));
    toast.success('Question deleted', {
      autoClose: 2000,
    });
  };

  const setExistingQuestion = (e) => {
    setLoading(true);
    e.preventDefault();
    if (existingQuestionRef.current.value !== 'none') {
      const [questionSet] = existingQuestionSet.filter(
        (questionSet) =>
          questionSet.id === parseInt(existingQuestionRef.current.value),
      );
      if (questionSet) {
        setQuestions(questionSet.questions);
      }
    }
    setQuestionError([]);
    setTimeout(() => setLoading(false), 300);
  };

  const moveQuestionDown = (e, questionIndex) => {
    e.preventDefault();
    const allQuestion = [...questions];
    const currentQuestion = allQuestion[questionIndex];
    const nextQuestion = allQuestion[parseInt(questionIndex) + 1];

    allQuestion[questionIndex] = nextQuestion;
    allQuestion[parseInt(questionIndex) + 1] = currentQuestion;

    setQuestions(allQuestion);
  };

  const moveQuestionUp = (e, questionIndex) => {
    e.preventDefault();
    const allQuestion = [...questions];
    const currentQuestion = allQuestion[questionIndex];
    const prevQuestion = allQuestion[parseInt(questionIndex) - 1];

    allQuestion[questionIndex] = prevQuestion;
    allQuestion[parseInt(questionIndex) - 1] = currentQuestion;

    setQuestions(allQuestion);
  };

  const validateQuestions = (questions) => {
    const errors = [];
    questions.map((each, index) => {
      const error = {};
      if (!each.title.trim().length) {
        error.title = 'Please provide question title';
      }
      if (each.title.length > 250) {
        error.title = 'The field must be less than 250 characters.';
      }
      if (parseInt(each.type.id) === 2) {
        if (!each.options.length) {
          error.options = "Options can't be empty.";
        } else {
          if (each.options.length < 2) {
            error.options = 'Please add more options for multiple choice.';
          } else if (findDuplicate(each.options)) {
            error.options = 'Multiple options cannot have same answer.';
          } else if (!each.answers.length) {
            error.answers = 'Please select a correct answer.';
          } else {
            each.options.map((option, i) => {
              if (!option.title.trim()) {
                if (!error.hasOwnProperty('optionError')) {
                  error.optionError = '';
                }
                error.optionError = 'Please provide option title';
              }
            });
          }
        }
      }
      if (Object.keys(error).length !== 0) {
        errors[index] = error;
      }
    });
    if (errors.length) {
      setQuestionError(errors);
      return false;
    }
    setQuestionError([]);
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (findDuplicate(questions)) {
      toast.error("You can't duplicate question.");
      return;
    } else if (questions.length) {
      if (description?.length > 250) {
        setDescriptionError(
          'Please provide description within 250 characters.',
        );
        toast.error('Please check inputs');
        return;
      }
      if (validateQuestions(questions)) {
        jobId && saveQuestions(jobId, questions, description, instruction);
      } else {
        // showAlert(false,'Please check inputs', 2000);
        toast.error('Please check inputs');
      }
      return;
    }
    toast.error('Please add questions');
  };

  const modules = {
    toolbar: [
      [
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        { header: 1 },
        { header: 2 },
      ],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }],
      [{ align: [] }],
      ['clean'],
    ],
  };

  const formats = [
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'header',
    'size',
    'list',
    'color',
    'align',
  ];

  const handleDeleteScreeningInit = (e, id) => {
    e.preventDefault();
    setRemoveModalShowHide({ display: 'block' });
  };

  const handleCancleRemove = (e) => {
    e.preventDefault();
    setRemoveModalShowHide({ display: 'none' });
  };

  const handleDeleteScreening = (e) => {
    e.preventDefault();
    deleteScreening(jobId, 'screening');
    setRemoveModalShowHide({ display: 'none' });
  };

  const handleEditScreeningInit = (e, id) => {
    e.preventDefault();
    setEditModalShowHide({ display: 'block' });
  };

  const handleCancleEdit = (e) => {
    e.preventDefault();
    setEditModalShowHide({ display: 'none' });
  };

  const handleEditScreening = (e) => {
    e.preventDefault();
    setIsScreeningEdit(true);
    setEditModalShowHide({ display: 'none' });
  };

  return (
    <div className="progress-tab screening-question">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <h1 className="mb-0">Screening Questions</h1>
          {((questions && questions?.length > 0) || !isScreeningEdit) && (
            <div className="allow-disabled-button">
              {!isScreeningEdit && (
                <a
                  href="javascript:void(0);"
                  className={`info-button btn btn-sm ${
                    questions?.length > 0 ? 'mr-2' : ''
                  }`}
                  onClick={handleEditScreeningInit}
                >
                  <i className="eicon e-pencil"></i>
                  <span> Edit</span>
                </a>
              )}
              {questions && questions?.length > 0 && (
                <a
                  href="javascript:void(0);"
                  onClick={handleDeleteScreeningInit}
                  className="danger-button btn btn-sm"
                >
                  <i className="eicon e-delete"></i>
                  <span> Remove</span>
                </a>
              )}
            </div>
          )}
        </div>
        <div className="form-box">
          <div className="form-note">
            <span>NOTE: </span>If you want to ask any additional questions,
            please write here. It will appear in the application process.
          </div>
          {screeningQuestions && screeningQuestions?.applicant_count > 0 && (
            <div
              role="alert"
              className="alert fade show alert-warning text-center"
            >
              {screeningQuestions?.applicant_count} applicant(s) have already
              applied for this job. If you edit question, old applicant's marks
              will not be changed. Only new applicants will get new questions.
            </div>
          )}
          {isScreeningEdit && (
            <>
              {existingQuestionSet && (
                <>
                  <div className="section-title mt-4">
                    Select an Existing Question Set
                  </div>
                  <div className="row mb-4 evaluation-form">
                    <div className="col-md-4 mt-4 form-filter form-group mb-0">
                      <div className="select-option">
                        <select
                          defaultValue={'none'}
                          ref={existingQuestionRef}
                          onChange={setExistingQuestion}
                        >
                          <option value="none" disabled>
                            Select A Set
                          </option>
                          {existingQuestionSet.map((question, i) => (
                            <option
                              value={question.id}
                              key={`ex-question-${question.id}`}
                            >
                              {question.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="form-group row mb-0">
                <div className="col-md-12">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    cols="30"
                    rows="3"
                    className="form-control"
                    value={description}
                    onChange={(e) => handleNotes(e, 'internal_note')}
                  ></textarea>
                  <div className="form-note mt-1">
                    <span className="text-capitalize">note: </span>Only team
                    members can see notes.
                  </div>
                  {descriptionError && (
                    <div className="error-message">{descriptionError}</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        {isScreeningEdit && (
          <div className="form-box mt-4">
            <div className="form-group row mb-0">
              <div className="col-md-12">
                <label className="label-color">Instruction (optional)</label>
                <ReactQuill
                  modules={modules}
                  formats={formats}
                  placeholder={'Instruction'}
                  onChange={(value) => handleNotes(value, 'note')}
                  value={instruction}
                />
                <div className="form-note mt-1">
                  <span className="text-capitalize">note: </span>Candidate will
                  see this instruction before starting the screening.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`questions-wrapper ${loading ? 'ej-loading' : ''}`}>
          {questions?.length > 0 &&
            questions?.map((each, index) => {
              return (
                <div
                  className="evaluation-form screening-question-card"
                  key={`question-${index}`}
                >
                  <div className="d-flex align-items-center flex-wrap">
                    <h3 className="screening-question-card__title">
                      Question: {index + 1}
                    </h3>
                    <div className="d-flex ml-auto justify-content-end my-2">
                      {each.type.id === 2 && (
                        <button
                          className="control-button control-button--info has_bg_color"
                          onClick={(e) => addOption(e, index)}
                          disabled={!isScreeningEdit}
                        >
                          <div className="control-button__icon">
                            <i className="easyjobs-icon easyjobs-plus"></i>
                          </div>
                          <span>Add Option</span>
                        </button>
                      )}
                      {index + 1 !== questions.length && (
                        <button
                          className="control-button control-button--info has_bg_color"
                          onClick={(e) => moveQuestionDown(e, index)}
                          disabled={!isScreeningEdit}
                        >
                          <div className="control-button__icon">
                            <i className="easyjobs-icon easyjobs-arrow-down"></i>
                          </div>
                          <span>Move Down</span>
                        </button>
                      )}
                      {index !== 0 && (
                        <button
                          className="control-button control-button--info has_bg_color"
                          onClick={(e) => moveQuestionUp(e, index)}
                          disabled={!isScreeningEdit}
                        >
                          <div className="control-button__icon">
                            <i className="easyjobs-icon easyjobs-arrow-up"></i>
                          </div>
                          <span>Move Up</span>
                        </button>
                      )}
                      <button
                        className="erase-button"
                        onClick={(e) => deleteQuestion(e, index)}
                        disabled={!isScreeningEdit}
                      >
                        <i className="easyjobs-icon easyjobs-delete"></i>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="form-box form-filter">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Question Type*</label>
                          <div className="select-option">
                            {questionType.length && (
                              <select
                                onChange={(e) => handleInput(e, index, 'type')}
                                disabled={!isScreeningEdit}
                                defaultValue={
                                  (questionType &&
                                    each?.type?.id &&
                                    each?.type?.id) ||
                                  ''
                                }
                              >
                                {questionType.map((type) => (
                                  <option
                                    value={type.id}
                                    key={`type-${type.id}`}
                                  >
                                    {type.name}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="form-group">
                          <div className="d-flex flex-wrap align-items-center justify-content-between">
                            <label>Type your Question*</label>
                            <label className="custom-check-box">
                              <input
                                type="checkbox"
                                disabled={!isScreeningEdit}
                                checked={each.required === 1}
                                onChange={(e) =>
                                  handleInput(e, index, 'required')
                                }
                              />{' '}
                              Required
                            </label>
                          </div>
                          <input
                            type="text"
                            disabled={!isScreeningEdit}
                            className="form-control"
                            placeholder="Screening Question"
                            value={each.title}
                            onChange={(e) => handleInput(e, index, 'title')}
                          />
                          {questionsError[index] &&
                            questionsError[index].title && (
                              <div className="error-message">
                                {questionsError[index].title}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                    {(each.type.id === 2 && each.options.length && (
                      <div className="row form__margin__control">
                        {each.options.map((option, i) => (
                          <div className="col-md-3" key={`option-${i}`}>
                            <div className="form-group screening-question-answer">
                              <label>{`Option ${i + 1}`}</label>
                              <div className="d-flex align-items-center">
                                <label className="checkbox">
                                  <input
                                    type="checkbox"
                                    disabled={!isScreeningEdit}
                                    onChange={(e) =>
                                      setCorrectAnswer(e, index, i)
                                    }
                                    checked={
                                      each.answers.includes(option.id) ||
                                      each.answers.includes(
                                        option.id.toString(),
                                      )
                                    }
                                  />
                                  <span></span>
                                </label>
                                <input
                                  type="text"
                                  disabled={!isScreeningEdit}
                                  className="form-control"
                                  placeholder="Option"
                                  onChange={(e) => setOptionTitle(e, index, i)}
                                  value={option.title}
                                />
                                <button
                                  className="remove-button"
                                  onClick={(e) => removeOption(e, index, i)}
                                  disabled={!isScreeningEdit}
                                >
                                  <i className="easyjobs-icon easyjobs-close"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )) ||
                      ''}
                    {questionsError[index] &&
                      (questionsError[index].options ||
                        questionsError[index].answers ||
                        questionsError[index].optionError) && (
                        <div className="error-div">
                          {questionsError[index].options && (
                            <div className="error-message">
                              {questionsError[index].options}
                            </div>
                          )}
                          {questionsError[index].answers && (
                            <div className="error-message">
                              {questionsError[index].answers}
                            </div>
                          )}
                          {questionsError[index].optionError && (
                            <div className="error-message">
                              {questionsError[index].optionError}
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
        </div>
        {isScreeningEdit && (
          <div className="mt-30">
            <button
              className="button info-button button-icon text-capitalize"
              onClick={addQuestion}
            >
              <span className="icon">
                <i className="eicon e-plus"></i>
              </span>
              <span className="text-capitalize">
                {questions?.length < 1 ? 'add question' : 'add more question'}
              </span>
            </button>
          </div>
        )}

        <div className="section-gap d-flex justify-content-between">
          <button
            className="button semi-button-info"
            onClick={(e) => changeTab(e, 'basic-info')}
          >
            Back
          </button>
          <div>
            <a
              href="#"
              className="button semi-button-warning text-capitalize mr-4"
              onClick={(e) => changeTab(e, 'quiz')}
            >
              Skip & Next
            </a>
            <button
              className="button info-button"
              type="submit"
              disabled={!isScreeningEdit}
            >
              Save & Continue
            </button>
          </div>
        </div>
      </form>
      <div
        className="dg-wrapper ej-candidate-confirmation"
        id="ej-candidate-confirmation"
        style={removeModalShowHide}
      >
        <div className="dg-backdrop"></div>
        <div className="dg-container">
          <div className="dg-content-cont dg-content-cont--floating">
            <div className="dg-main-content">
              <div className="dg-view-wrapper">
                <div className="dg-content-body dg-content-body--has-title">
                  <h6 className="dg-title">Confirmation</h6>
                  <div className="dg-content">
                    <p>
                      Only new applicants will not be able to answer questions.
                      Old applicant's marks will not be changed.
                    </p>
                    <br />
                    <p>Are you sure you want to delete questions?</p>
                  </div>
                </div>
                <div className="dg-content-footer">
                  <button
                    className="dg-btn dg-btn--cancel remove-rating-cancel"
                    onClick={handleCancleRemove}
                  >
                    <span>No</span>
                  </button>
                  <button
                    className="dg-btn dg-btn--ok dg-pull-right ej-candidate-action-confirm"
                    onClick={handleDeleteScreening}
                  >
                    <span className="dg-btn-content">Yes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="dg-wrapper ej-candidate-confirmation"
        id="ej-candidate-confirmation"
        style={editModalShowHide}
      >
        <div className="dg-backdrop"></div>
        <div className="dg-container">
          <div className="dg-content-cont dg-content-cont--floating">
            <div className="dg-main-content">
              <div className="dg-view-wrapper">
                <div className="dg-content-body dg-content-body--has-title">
                  <h6 className="dg-title">Confirmation</h6>
                  <div className="dg-content">
                    <p>
                      Only new applicants will get updated questions & marks
                      will be on new question set. Old applicant's marks will
                      not be changed.
                    </p>
                    <br />
                    <p>Are you sure you want to edit questions?</p>
                  </div>
                </div>
                <div className="dg-content-footer">
                  <button
                    className="dg-btn dg-btn--cancel remove-rating-cancel"
                    onClick={handleCancleEdit}
                  >
                    <span>No</span>
                  </button>
                  <button
                    className="dg-btn dg-btn--ok dg-pull-right ej-candidate-action-confirm"
                    onClick={handleEditScreening}
                  >
                    <span className="dg-btn-content">Yes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ScreeningQuestionTab;
