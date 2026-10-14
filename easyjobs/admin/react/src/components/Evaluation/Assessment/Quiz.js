import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { findDuplicate } from '../../../util/helper';
import QuizQuestions from '../../Common/QuizQuestions';

const Quiz = ({
  assessmentTitle,
  duration,
  marks,
  description,
  instruction,
  setInstructionError,
  setTitleError,
  setDurationError,
  setMarksError,
  setDescriptionError,
  questions,
  saveAssessment,
  questionSetId,
  assessmentId,
  saveErrors,
}) => {
  const [formFields, setFormFields] = useState({
    questions: [],
  });
  const [questionsError, setQuestionError] = useState([]);

  useEffect(() => {
    if (questions?.length) {
      setFormFields({ ...formFields, questions: questions });
    }
    setQuestionError([]);
  }, [questions]);

  useEffect(() => {
    if (
      saveErrors &&
      saveErrors !==
        'Cannot update assessment. Candidate(s) already attended this assessment.'
    ) {
      toast.error('Please check inputs');
      setQuestionError(saveErrors);
    }
  }, [saveErrors]);

  const checkRequiredFields = () => {
    if (assessmentTitle === '') {
      setTitleError('Please enter assessment name within 100 characters.');
    } else {
      setTitleError('');
    }
    if (duration === '') {
      setDurationError('Assessment duration is required.');
    } else if (isNaN(duration)) {
      setDurationError('The exam duration must be a number.');
    } else {
      setDurationError('');
    }
    if (marks === '') {
      setMarksError('Please input marks per question.');
    } else if (isNaN(marks)) {
      setMarksError('The exam marks must be a number.');
    } else {
      setMarksError('');
    }
    if (description?.length > 250) {
      setDescriptionError('Please provide description within 250 characters.');
    } else {
      setDescriptionError('');
    }
    if (instruction?.length > 5000) {
      setInstructionError('Please provide instruction within 5000 characters.');
    } else {
      setInstructionError('');
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
      id: assessmentId,
      set_type: 3,
      assessment_name: assessmentTitle,
      exam_duration: duration,
      marks_per_question: marks,
      internal_note: description,
      note: instruction,
      questions: formFields.questions,
    };
    if (
      assessmentTitle === '' ||
      duration === '' ||
      isNaN(duration) ||
      marks === '' ||
      isNaN(marks) ||
      description?.length > 250 ||
      instruction?.length > 5000
    ) {
      toast.error('Please check inputs');
    } else if (findDuplicate(formFields.questions)) {
      toast.error("You can't duplicate question.");
    } else if (formFields.questions.length) {
      if (validateQuestions(formFields.questions)) {
        saveAssessment(set);
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
          {assessmentId ? 'Update' : 'Save'}
        </button>
      </div>
    </>
  );
};

export default Quiz;
