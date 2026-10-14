import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { findDuplicate } from '../../../util/helper';
import ReactQuill from 'react-quill';

const QuizTab = ({
  getQuizMeta,
  quizMeta,
  saveQuiz,
  getQuiz,
  quiz,
  quizSaved,
  jobId,
  setShowFieldsModal,
  changeTab,
  setSubmitType,
  showAlert,
  isCreateJob,
  deleteScreening,
  isDeletedScreenQuiz,
}) => {
  const [quizSet, setQuizSet] = useState([]);
  const [formFields, setFormFields] = useState({
    exam_duration: '',
    marks_per_question: '',
    internal_note: '',
    questions: [],
  });
  const existingQuizRef = useRef('none');
  const [loading, setLoading] = useState(false);
  const [durationError, setDurationError] = useState('');
  const [marksError, setMarksError] = useState('');
  const [questionsError, setQuestionError] = useState([]);
  const [instruction, setInstruction] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [isQuizEdit, setIsQuizEdit] = useState(false);
  const [removeModalShowHide, setRemoveModalShowHide] = useState({
    display: 'none',
  });
  const [editModalShowHide, setEditModalShowHide] = useState({
    display: 'none',
  });

  useEffect(() => {
    getQuizMeta();
  }, []);

  useEffect(() => {
    quizMeta && setQuizSet(quizMeta.quiz_set);
  }, [quizMeta]);

  useEffect(() => {
    jobId && getQuiz(jobId);
  }, [jobId]);

  useEffect(() => {
    if (quizSaved) {
      setSubmitType('publish');
      setShowFieldsModal(true);
    }
  }, [quizSaved]);

  useEffect(() => {
    quiz &&
      quiz.questions.length &&
      !isCreateJob &&
      setFormFields({
        ...formFields,
        questions: quiz.questions,
        exam_duration: quiz.quiz_group.exam_duration,
        marks_per_question: quiz.quiz_group.marks_per_question,
        internal_note: quiz.quiz_group.internal_note
          ? quiz.quiz_group.internal_note
          : '',
      });
    quiz &&
      setInstruction(quiz?.quiz_group?.note ? quiz?.quiz_group?.note : '');
    quiz && quiz?.applicant_count === 0 && setIsQuizEdit(true);
  }, [quiz]);

  useEffect(() => {
    if (isDeletedScreenQuiz) {
      if (existingQuizRef?.current?.value) {
        existingQuizRef.current.value = 'none';
      }
      setFormFields({
        ...formFields,
        questions: [],
        exam_duration: '',
        marks_per_question: '',
        internal_note: '',
      });
      setInstruction('');
      if (quiz && quiz?.applicant_count === 0) {
        setIsQuizEdit(true);
      } else {
        setIsQuizEdit(false);
      }
    }
  }, [isDeletedScreenQuiz]);

  const setExistingQuestion = (e) => {
    setLoading(true);
    e.preventDefault();
    if (existingQuizRef.current.value !== 'none') {
      const [questionSet] = quizSet.filter(
        (questionSet) =>
          questionSet.id === parseInt(existingQuizRef.current.value),
      );
      if (questionSet) {
        setFormFields({ ...formFields, questions: questionSet.questions });
        setQuestionError([]);
      }
    }
    setTimeout(() => setLoading(false), 300);
  };

  const addQuestion = (e) => {
    e.preventDefault();
    if (findDuplicate(formFields.questions)) {
      toast.error("You can't duplicate question.");
      return;
    }
    setFormFields({
      ...formFields,
      questions: [
        ...formFields.questions,
        {
          id: null,
          title: '',
          type: {
            id: 2,
            name: 'Multiple Choice',
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
          answers: null,
        },
      ],
    });
  };

  const deleteQuestion = (e, questionIndex) => {
    e.preventDefault();
    setFormFields({
      ...formFields,
      questions: formFields.questions.filter(
        (question, i) => questionIndex !== i,
      ),
    });
    setQuestionError(questionsError.filter((each, i) => i !== questionIndex));
    toast.success('Question deleted', {
      autoClose: 2000,
    });
  };

  const handleQuestionInput = (e, questionIndex, name) => {
    const allQuestions = [...formFields.questions];
    allQuestions[questionIndex][name] = e.target.value;
    setFormFields({ ...formFields, questions: allQuestions });
  };

  const setOptionTitle = (e, questionIndex, optionIndex) => {
    const allQuestions = [...formFields.questions];
    allQuestions[questionIndex]['options'][optionIndex]['title'] =
      e.target.value;
    setFormFields({ ...formFields, questions: allQuestions });
  };

  const removeOption = (e, questionIndex, optionIndex) => {
    e.preventDefault();
    const allQuestions = [...formFields.questions];
    allQuestions[questionIndex]['options'] = allQuestions[questionIndex][
      'options'
    ].filter((option, i) => optionIndex !== i);
    if (parseInt(allQuestions[questionIndex]['answers']) === optionIndex) {
      allQuestions[questionIndex]['answers'] = '';
    }
    setFormFields({ ...formFields, questions: allQuestions });
  };

  const addOption = (e, questionIndex) => {
    e.preventDefault();
    const allQuestions = [...formFields.questions];
    allQuestions[questionIndex]['options'].push({
      id: allQuestions[questionIndex]['options'].length,
      title: '',
    });

    setFormFields({ ...formFields, questions: allQuestions });
  };

  const moveQuestionDown = (e, questionIndex) => {
    e.preventDefault();
    const allQuestions = [...formFields.questions];
    const currentQuestion = allQuestions[questionIndex];

    allQuestions[questionIndex] = allQuestions[parseInt(questionIndex) + 1];
    allQuestions[parseInt(questionIndex) + 1] = currentQuestion;

    setFormFields({ ...formFields, questions: allQuestions });
  };

  const moveQuestionUp = (e, questionIndex) => {
    e.preventDefault();
    const allQuestions = [...formFields.questions];
    const currentQuestion = allQuestions[questionIndex];

    allQuestions[questionIndex] = allQuestions[parseInt(questionIndex) - 1];
    allQuestions[parseInt(questionIndex) - 1] = currentQuestion;

    setFormFields({ ...formFields, questions: allQuestions });
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
          } else if (each.answers !== 0 && !each.answers) {
            if (!each.answers) {
              error.answers = 'Please select a correct answer.';
            }
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
    if (!formFields.exam_duration || !formFields.marks_per_question) {
      !formFields.exam_duration &&
        setDurationError('Please provide exam duration');
      !formFields.marks_per_question &&
        setMarksError('Please provide marks per question');
      //showAlert(false,'Please check inputs', 2000);
      toast.error('Please check inputs');
      return;
    } else {
      setDurationError('');
      setMarksError('');
    }
    if (findDuplicate(formFields.questions)) {
      toast.error("You can't duplicate question.");
    } else if (formFields.questions.length) {
      if (formFields?.internal_note?.length > 250) {
        setDescriptionError(
          'Please provide description within 250 characters.',
        );
        toast.error('Please check inputs');
        return;
      }
      if (validateQuestions(formFields.questions)) {
        jobId && saveQuiz(jobId, { ...formFields, note: instruction });
      } else {
        toast.error('Please check inputs');
      }
    } else {
      toast.error('Please add questions');
    }
  };

  const handleSkip = (e) => {
    e.preventDefault();
    setSubmitType('publish');
    setShowFieldsModal(true);
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

  const handleDeleteQuizInit = (e, id) => {
    e.preventDefault();
    setRemoveModalShowHide({ display: 'block' });
  };

  const handleCancleRemove = (e) => {
    e.preventDefault();
    setRemoveModalShowHide({ display: 'none' });
  };

  const handleDeleteQuiz = (e) => {
    e.preventDefault();
    deleteScreening(jobId, 'quiz');
    setRemoveModalShowHide({ display: 'none' });
  };

  const handleEditQuizInit = (e, id) => {
    e.preventDefault();
    setEditModalShowHide({ display: 'block' });
  };

  const handleCancleEdit = (e) => {
    e.preventDefault();
    setEditModalShowHide({ display: 'none' });
  };

  const handleEditQuiz = (e) => {
    e.preventDefault();
    setIsQuizEdit(true);
    setEditModalShowHide({ display: 'none' });
  };

  return (
    <div className="progress-tab quiz">
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <h1 className="mb-0">Quiz</h1>
          {((formFields && formFields?.questions?.length > 0) ||
            !isQuizEdit) && (
            <div className="allow-disabled-button">
              {!isQuizEdit && (
                <a
                  href="javascript:void(0);"
                  class={`info-button btn btn-sm ${
                    formFields?.questions?.length > 0 ? 'mr-2' : ''
                  }`}
                  onClick={handleEditQuizInit}
                >
                  <i class="eicon e-pencil"></i>
                  <span> Edit</span>
                </a>
              )}
              {formFields && formFields?.questions?.length > 0 && (
                <a
                  href="javascript:void(0);"
                  onClick={handleDeleteQuizInit}
                  className="danger-button btn btn-sm"
                >
                  <i className="eicon e-delete"></i>{' '}
                  <span data-v-7fbd6cfe="">Remove</span>
                </a>
              )}
            </div>
          )}
        </div>
        <div className="form-box">
          <div className="form-note">
            <span>NOTE: </span> If you want to take a quiz please insert the
            Quiz time, marks per question and Quiz name here. It will appear in
            the application process. (Example: 15 Minutes, 3 Marks per Question
            and Personality Test.)
          </div>
          {quiz && quiz?.applicant_count > 0 && (
            <div role="alert" class="alert fade show alert-warning text-center">
              {quiz?.applicant_count} applicant(s) have already applied for this
              job. If you edit question, old applicant's marks will not be
              changed. Only new applicants will get new questions.
            </div>
          )}
          {isQuizEdit && (
            <>
              <div className="section-title mt-5">
                Select an Existing Question Set
              </div>
              <div className="row form-group evaluation-form">
                {quizSet && (
                  <div className="col-md-4 mt-4 form-filter">
                    <label>Select Quiz Set</label>
                    <div className="select-option">
                      <select
                        defaultValue={'none'}
                        ref={existingQuizRef}
                        onChange={setExistingQuestion}
                      >
                        <option value="none" disabled>
                          Select A Set
                        </option>
                        {quizSet.map((each, i) => (
                          <option value={each.id} key={`quiz-set-${each.id}`}>
                            {each.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-md-4 mt-4">
                  <div className="form-group">
                    <label>Quiz Duration</label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          exam_duration: e.target.value,
                        })
                      }
                      value={formFields.exam_duration}
                      placeholder="Duration in minutes"
                    />
                    {durationError && (
                      <div className="error-message">{durationError}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4 mt-4">
                  <div className="form-group">
                    <label>Marks Per Question</label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          marks_per_question: e.target.value,
                        })
                      }
                      value={formFields.marks_per_question}
                      placeholder="Marks Per Question"
                    />
                    {marksError && (
                      <div className="error-message">{marksError}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-md-12">
                  <div className="form-group mb-0">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      cols="30"
                      rows="3"
                      className="form-control"
                      onChange={(e) => {
                        setDescriptionError('');
                        setFormFields({
                          ...formFields,
                          internal_note: e.target.value,
                        });
                      }}
                      value={formFields.internal_note}
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
              </div>
            </>
          )}
        </div>
        {isQuizEdit && (
          <div className="form-box mt-4">
            <div className="form-group row mb-0">
              <div className="col-md-12">
                <label className="label-color">Instruction (optional)</label>
                <ReactQuill
                  modules={modules}
                  formats={formats}
                  placeholder={'Instruction'}
                  onChange={(val) => setInstruction(val)}
                  value={instruction || ''}
                />
                <div className="form-note mt-1">
                  <span className="text-capitalize">note: </span>Candidate will
                  see this instruction before starting the quiz.
                </div>
              </div>
            </div>
          </div>
        )}

        {(formFields.questions.length && (
          <div
            className={`questions-wrapper ${(loading && 'ej-loading') || ''}`}
          >
            {formFields.questions.map((each, index) => {
              return (
                <div className="screening-question-card" key={`quiz-${index}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="screening-question-card__title">
                      Question: {index + 1}
                    </h3>
                    <div className="d-flex">
                      {index + 1 !== formFields.questions.length && (
                        <button
                          href="#"
                          className="control-button control-button--primary has_bg_color"
                          onClick={(e) => moveQuestionDown(e, index)}
                          disabled={!isQuizEdit}
                        >
                          <div className="control-button__icon">
                            <i className="easyjobs-icon easyjobs-arrow-down"></i>
                          </div>
                          <span>Move Down</span>
                        </button>
                      )}
                      {index !== 0 && (
                        <button
                          href="#"
                          className="control-button control-button--primary has_bg_color"
                          onClick={(e) => moveQuestionUp(e, index)}
                          disabled={!isQuizEdit}
                        >
                          <div className="control-button__icon">
                            <i className="easyjobs-icon easyjobs-arrow-up"></i>
                          </div>
                          <span>Move Up</span>
                        </button>
                      )}
                      <button
                        href="#"
                        className="erase-button"
                        onClick={(e) => deleteQuestion(e, index)}
                        disabled={!isQuizEdit}
                      >
                        <i className="easyjobs-icon easyjobs-delete"></i>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="form-box">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Type your Question*</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Type question"
                            onChange={(e) =>
                              handleQuestionInput(e, index, 'title')
                            }
                            value={each.title}
                            disabled={!isQuizEdit}
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
                    <div className="row">
                      {each.options.map((option, i) => (
                        <div className="col-md-3" key={`option-${i}`}>
                          <div className="form-group screening-question-answer">
                            <label>Option {i + 1}</label>
                            <div className="d-flex align-items-center">
                              <label className="radio">
                                <input
                                  type="radio"
                                  name={`option${index}`}
                                  onChange={(e) =>
                                    handleQuestionInput(e, index, 'answers')
                                  }
                                  value={option.id}
                                  checked={
                                    parseInt(each.answers) ===
                                    parseInt(option.id)
                                  }
                                  disabled={!isQuizEdit}
                                />
                                <span></span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Option"
                                onChange={(e) => setOptionTitle(e, index, i)}
                                value={option.title}
                                disabled={!isQuizEdit}
                              />
                              <button
                                href="#"
                                className="remove-button"
                                onClick={(e) => removeOption(e, index, i)}
                                disabled={!isQuizEdit}
                              >
                                <i className="easyjobs-icon easyjobs-close"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {questionsError[index] &&
                        (questionsError[index].options ||
                          questionsError[index].answers ||
                          questionsError[index].optionError) && (
                          <div className="col-12 error-div">
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
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group mt-30">
                          <button
                            className="button info-button"
                            onClick={(e) => addOption(e, index)}
                            disabled={!isQuizEdit}
                          >
                            Add Option
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )) ||
          ''}
        {isQuizEdit && (
          <div className="mt-30">
            <button
              className="button info-button button-icon text-capitalize"
              onClick={addQuestion}
            >
              <span className="icon">
                <i className="eicon e-plus"></i>
              </span>
              <span className="text-capitalize">
                {formFields.questions.length < 1
                  ? 'add question'
                  : 'add more question'}
              </span>
            </button>
          </div>
        )}
        <div className="section-gap d-flex justify-content-between">
          <button
            href="#"
            className="button semi-button-info"
            onClick={(e) => changeTab(e, 'screening-question')}
          >
            Back
          </button>
          <div>
            <a
              href="#"
              className="button semi-button-warning text-capitalize mr-4"
              onClick={(e) => handleSkip(e)}
            >
              Skip & Next
            </a>
            <button
              className="button info-button"
              type="submit"
              disabled={!isQuizEdit}
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
                    onClick={handleDeleteQuiz}
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
                    onClick={handleEditQuiz}
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

export default QuizTab;
