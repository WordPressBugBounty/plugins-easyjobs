import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { findDuplicate } from '../../../../util/helper';

const Screening = ({
  questionTitle,
  type,
  description,
  instruction,
  setTitleError,
  setTypeError,
  setDescriptionError,
  saveQuestion,
  questionsOfASet,
  questionSetId,
  saveErrors,
}) => {
  const [questions, setQuestions] = useState([]);
  const [questionsError, setQuestionError] = useState([]);

  useEffect(() => {
    if (questionsOfASet?.length) {
      setQuestions([...questionsOfASet]);
    }
  }, [questionsOfASet]);

  useEffect(() => {
    if (saveErrors) {
      toast.error('Please check inputs');
      setQuestionError(saveErrors);
    }
  }, [saveErrors]);

  const setTypes = [
    { id: 1, name: 'Screening' },
    { id: 2, name: 'Quiz' },
  ];

  const questionTypes = [
    { id: 1, name: 'Text' },
    { id: 2, name: 'Multiple Choice' },
  ];

  const checkRequiredFields = () => {
    if (questionTitle === '') {
      setTitleError('Please enter set name within 250 characters.');
    } else {
      setTitleError('');
    }
    if (type === 'select') {
      setTypeError('Set Type cannot be empty.');
    } else {
      setTypeError('');
    }
    if (description?.length > 250) {
      setDescriptionError('Please provide description within 250 characters.');
    } else {
      setDescriptionError('');
    }
  };

  const addQuestion = (e) => {
    e.preventDefault();
    const allQuestions = [...questions];
    if (findDuplicate(allQuestions)) {
      toast.error("You can't duplicate question.");
      return;
    }
    setQuestions([
      ...allQuestions,
      {
        id: null,
        title: '',
        isMultiple: false,
        isValid: false,
        errors: [],
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
      },
    ]);
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

  const deleteQuestion = (e, questionIndex) => {
    e.preventDefault();
    setQuestions(questions.filter((question, i) => questionIndex !== i));
    setQuestionError(questionsError.filter((each, i) => i !== questionIndex));
    toast.success('Question deleted', {
      autoClose: 2000,
    });
  };

  const handleInput = (e, index, name) => {
    const allQuestion = [...questions];
    if (name === 'type') {
      const [type] = questionTypes.filter(
        (type) => type.id === parseInt(e.target.value),
      );
      allQuestion[index][name] = type;
    } else {
      allQuestion[index][name] = e.target.value;
    }
    setQuestionError([]);
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
    checkRequiredFields();
    questions.map((each) => {
      if (each.type.id == 1) {
        if (!each.options.length) {
          each.options = [
            { id: 0, title: '' },
            { id: 1, title: '' },
          ];
        }
      } else {
        each.isMultiple = true;
      }
    });
    const set = {
      id: null,
      set_type: setTypes[type - 1],
      set_name: questionTitle,
      internal_note: description,
      note: instruction,
      questions: questions,
      qs_id: questionSetId,
    };
    if (questionTitle === '' || description?.length > 250) {
      toast.error('Please check inputs');
    } else if (findDuplicate(questions)) {
      toast.error("You can't duplicate question.");
    } else if (questions.length) {
      if (validateQuestions(questions) && questionTitle !== '') {
        saveQuestion(set);
      } else {
        toast.error('Please check inputs');
      }
    } else {
      toast.error('Please add questions');
    }
  };

  return (
    <>
      <div className={`evaluation-form questions-wrapper`}>
        {questions?.map((each, index) => {
          return (
            <div className="screening-question-card" key={`question-${index}`}>
              <div className="d-flex align-items-center flex-wrap">
                <h3 className="screening-question-card__title">
                  Question: {index + 1}
                </h3>
                <div className="d-flex ml-auto justify-content-end my-2">
                  {each?.type?.id === 2 && (
                    <a
                      href="#"
                      className="control-button control-button--primary has_bg_color"
                      onClick={(e) => addOption(e, index)}
                    >
                      <div className="control-button__icon">
                        <i className="easyjobs-icon easyjobs-plus"></i>
                      </div>
                      <span>Add Option</span>
                    </a>
                  )}
                  {index + 1 !== questions.length && (
                    <a
                      href="#"
                      className="control-button control-button--primary has_bg_color"
                      onClick={(e) => moveQuestionDown(e, index)}
                    >
                      <div className="control-button__icon">
                        <i className="easyjobs-icon easyjobs-arrow-down"></i>
                      </div>
                      <span>Move Down</span>
                    </a>
                  )}
                  {index !== 0 && (
                    <a
                      href="#"
                      className="control-button control-button--primary has_bg_color"
                      onClick={(e) => moveQuestionUp(e, index)}
                    >
                      <div className="control-button__icon">
                        <i className="easyjobs-icon easyjobs-arrow-up"></i>
                      </div>
                      <span>Move Up</span>
                    </a>
                  )}
                  <a
                    href="#"
                    className="erase-button"
                    onClick={(e) => deleteQuestion(e, index)}
                  >
                    <i className="easyjobs-icon easyjobs-delete"></i>
                    <span>Delete</span>
                  </a>
                </div>
              </div>
              <div className="form-box form-filter">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Question Type*</label>
                      <div className="select-option">
                        {questionTypes.length && (
                          <select
                            onChange={(e) => handleInput(e, index, 'type')}
                            defaultValue={
                              (questionTypes &&
                                each?.type?.id &&
                                each?.type?.id) ||
                              ''
                            }
                          >
                            {questionTypes.map((type) => (
                              <option value={type.id} key={`type-${type.id}`}>
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
                      <label>Type your Question*</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Screening Question"
                        value={each.title}
                        onChange={(e) => handleInput(e, index, 'title')}
                      />
                      {questionsError[index] && questionsError[index].title && (
                        <div className="error-message">
                          {questionsError[index].title}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {(each?.type?.id === 2 && each.options.length && (
                  <div className="row form__margin__control">
                    {each.options.map((option, i) => (
                      <div className="col-md-3" key={`option-${i}`}>
                        <div className="form-group screening-question-answer">
                          <label>{`Option ${i + 1}`}</label>
                          <div className="d-flex align-items-center">
                            <label className="checkbox">
                              <input
                                type="checkbox"
                                onChange={(e) => setCorrectAnswer(e, index, i)}
                                checked={
                                  each.answers.includes(option.id) ||
                                  each.answers.includes(option.id.toString())
                                }
                              />
                              <span></span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Option"
                              onChange={(e) => setOptionTitle(e, index, i)}
                              value={option.title}
                            />
                            <a
                              href="#"
                              className="remove-button"
                              onClick={(e) => removeOption(e, index, i)}
                            >
                              <i className="easyjobs-icon easyjobs-close"></i>
                            </a>
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

      <div className="mt-30">
        <button
          className="button primary-button button-icon text-capitalize"
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
      <div className="section-gap d-flex">
        <button
          type="submit"
          className="button primary-button ml-auto text-capitalize"
          onClick={handleSubmit}
        >
          {questionSetId ? 'Update Question Set' : 'Save Question Set'}
        </button>
      </div>
    </>
  );
};

export default Screening;
