import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { findDuplicate } from '../../../../util/helper';
import QuizQuestions from '../../../Common/QuizQuestions';

const Quiz = ({
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
  const [formFields, setFormFields] = useState({
    questions: [],
  });
  const [questionsError, setQuestionError] = useState([]);

  useEffect(() => {
    if (questionsOfASet?.length) {
      setFormFields({ ...formFields, questions: questionsOfASet });
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
    checkRequiredFields();
    const set = {
      id: null,
      set_type: setTypes[type - 1],
      set_name: questionTitle,
      internal_note: description,
      note: instruction,
      questions: formFields.questions,
      qs_id: questionSetId,
    };
    if (questionTitle === '' || description?.length > 250) {
      toast.error('Please check inputs');
    } else if (findDuplicate(formFields.questions)) {
      toast.error("You can't duplicate question.");
    } else if (formFields.questions.length) {
      if (
        validateQuestions(formFields.questions) &&
        questionTitle !== '' &&
        type !== 'select'
      ) {
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
      <QuizQuestions
        formFields={formFields}
        setFormFields={setFormFields}
        setQuestionError={setQuestionError}
        questionsError={questionsError}
      />

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

export default Quiz;
