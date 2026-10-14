import React from 'react';
import { toast } from 'react-toastify';
import { findDuplicate } from '../../util/helper';

const QuizQuestions = ({
  formFields,
  setFormFields,
  setQuestionError,
  questionsError,
}) => {
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
          type: { id: 2, name: 'Multiple Choice' },
          isValid: false,
          isMultiple: true,
          errors: [],
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
  return (
    <>
      {(formFields?.questions.length && (
        <div className={`questions-wrapper`}>
          {formFields?.questions.map((each, index) => {
            return (
              <div className="screening-question-card" key={`quiz-${index}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="screening-question-card__title">
                    Question: {index + 1}
                  </h3>
                  <div className="d-flex">
                    {index + 1 !== formFields?.questions.length && (
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
                                  parseInt(each.answers) === parseInt(option.id)
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
                    {questionsError[index] &&
                      (questionsError[index].optionError ||
                        questionsError[index].answers ||
                        questionsError[index].options) && (
                        <div className="col-12 error-div">
                          {questionsError[index].optionError && (
                            <div className="error-message">
                              {questionsError[index].optionError}
                            </div>
                          )}
                          {questionsError[index].answers && (
                            <div className="error-message">
                              {questionsError[index].answers}
                            </div>
                          )}
                          {questionsError[index].options && (
                            <div className="error-message">
                              {questionsError[index].options}
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group mt-30">
                        <button
                          className="button primary-button"
                          onClick={(e) => addOption(e, index)}
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

      <div className="mt-30">
        <button
          className="button primary-button button-icon text-capitalize"
          onClick={addQuestion}
        >
          <span className="icon">
            <i className="eicon e-plus"></i>
          </span>
          <span className="text-capitalize">
            {formFields?.questions.length < 1
              ? 'add question'
              : 'add more question'}
          </span>
        </button>
      </div>
    </>
  );
};

export default QuizQuestions;
