import ReactQuill from 'react-quill';
import React, { useState, useEffect } from 'react';
import LinkTag from '../../../util/Link';
import { connect } from 'react-redux';
import {
  saveAssessment,
  getAssessment,
  resetEdit,
  resetErrors,
} from '../../../redux/actions/evaluationActions';
import { getQuizMeta } from '../../../redux/actions/jobActions';
import Quiz from './Quiz';
import { useHistory } from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    saveLoading: state.evaluation.saveLoading,
    editLoading: state.evaluation.editLoading,
    created: state.evaluation.created,
    saveErrors: state.evaluation.saveErrors,
    assessment: state.evaluation.questionSet,
    quizMeta: state.job.quizMeta,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveAssessment: (params) => dispatch(saveAssessment(params)),
    getAssessment: (id) => dispatch(getAssessment(id)),
    resetEdit: () => dispatch(resetEdit()),
    resetErrors: () => dispatch(resetErrors()),
    getQuizMeta: () => dispatch(getQuizMeta()),
  };
};

const EditAssessment = ({
  match,
  saveAssessment,
  getAssessment,
  assessment,
  saveLoading,
  editLoading,
  getQuizMeta,
  quizMeta,
  created,
  saveErrors,
  resetEdit,
  resetErrors,
}) => {
  const [questionSet, setQuestionSet] = useState('none');
  const [assessmentTitle, setAssessmentTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [marks, setMarks] = useState('');
  const [description, setDescription] = useState('');
  const [instruction, setInstruction] = useState('');
  const [instructionError, setInstructionError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [durationError, setDurationError] = useState('');
  const [marksError, setMarksError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [assessmentId, setAssessmentId] = useState(null);

  useEffect(() => {
    if (match) {
      match.params.id && setAssessmentId(match.params.id);
      getAssessment(match.params.id);
    }
  }, [match]);

  useEffect(() => {
    getQuizMeta();

    return () => {
      resetErrors();
    };
  }, []);

  useEffect(() => {
    if (saveErrors) {
      setTitleError(saveErrors);
    }
  }, [saveErrors]);

  useEffect(() => {
    assessment?.assessment_name &&
      setAssessmentTitle(assessment?.assessment_name);
    assessment?.exam_duration && setDuration(assessment?.exam_duration);
    assessment?.marks_per_question && setMarks(assessment?.marks_per_question);
    assessment?.internal_note && setDescription(assessment?.internal_note);
    assessment?.note && setInstruction(assessment?.note?.replace(/\\/g, ''));
    assessment?.questions && setQuestions(assessment?.questions);
  }, [assessment]);

  const history = useHistory();
  useEffect(() => {
    if (created) {
      history.push(history.location.pathname + '?page=easyjobs-assessments');
    }
    return () => {
      resetEdit();
    };
  }, [created]);

  const handleInput = (e, name) => {
    if (name === 'question_set') {
      setQuestionSet(e.target.value);
      if (e.target.value !== 'none') {
        const [questionSet] = quizMeta?.quiz_set?.filter(
          (questionSet) => questionSet.id === parseInt(e.target.value),
        );
        if (questionSet) {
          setQuestions(questionSet?.questions);
        }
      }
    } else if (name === 'assessment_name') {
      setAssessmentTitle(e.target.value);
      setTitleError('');
    } else if (name === 'exam_duration') {
      setDuration(e.target.value);
      setDurationError('');
    } else if (name === 'marks_per_question') {
      setMarks(e.target.value);
      setMarksError('');
    } else if (name === 'internal_note') {
      setDescription(e.target.value);
      setDescriptionError('');
    } else if (name === 'note') {
      setInstruction(e.replace(/\\/g, ''));
      setInstructionError('');
    }
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
  return (
    <div className="question-section section-gap-30">
      <div className="back-button">
        <LinkTag
          to={'easyjobs-assessments'}
          className="back-button__icon router-link-active"
        >
          <i className="eicon e-back"></i>
        </LinkTag>
        <div className="back-button__text text-capitalize">
          Back To Assessments
        </div>
      </div>

      <div className="section-title mb-4 text-capitalize">Edit Assessment</div>

      <form
        className={`evaluation-form ${
          saveLoading || editLoading ? 'ej-loading' : ''
        }`}
      >
        <div className="form-box form-filter">
          <div class="form-note">
            <span class="text-capitalize">note: </span>If you want to take a
            quiz please insert the Quiz time, marks per question and Quiz name
            here. It will appear in the application process. (Example: 15
            Minutes, 3 Marks per Question and Personality Test.)
          </div>
          <div className="form-group row">
            <div className="col-md-4 mt-4">
              <label class="text-capitalize">
                Select an existing question set.*
              </label>
              <div className="select-option">
                <select
                  className="ej-candidate-job-select"
                  value={questionSet}
                  onChange={(e) => handleInput(e, 'question_set')}
                >
                  <option value={'none'}>Select a set</option>
                  {quizMeta?.quiz_set?.map((each, i) => (
                    <option value={each.id} key={`quiz-set-${each.id}`}>
                      {each.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div class="col-md-8 mt-4">
              <label for="assessment_name" class="text-capitalize">
                Assessment name*
              </label>
              <input
                type="text"
                id="assessment_name"
                maxlength="100"
                placeholder="Assessment name"
                required="required"
                className="form-control"
                value={assessmentTitle}
                onChange={(e) => handleInput(e, 'assessment_name')}
              />
              {titleError && <div className="error-message">{titleError}</div>}
            </div>
          </div>
          <div class="row form-group">
            <div class="col-md-4 mt-4">
              <label for="exam_duration" class="text-capitalize">
                assessment duration*
              </label>
              <input
                type="number"
                id="exam_duration"
                placeholder="Duration in minutes"
                min="1"
                max="9999"
                class="form-control"
                value={duration}
                onChange={(e) => handleInput(e, 'exam_duration')}
              />
              {durationError && (
                <div className="error-message">{durationError}</div>
              )}
            </div>
            <div class="col-md-4 mt-4">
              <label for="marks_per_question">Marks Per Question*</label>
              <input
                type="number"
                id="marks_per_question"
                placeholder="Mark per question"
                min="1"
                max="9999"
                class="form-control"
                value={marks}
                onChange={(e) => handleInput(e, 'marks_per_question')}
              />
              {marksError && <div className="error-message">{marksError}</div>}
            </div>
          </div>
          <div className="form-group row mb-0">
            <div className="col-md-12">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                cols="30"
                rows="3"
                className="form-control"
                value={description}
                onChange={(e) => handleInput(e, 'internal_note')}
              ></textarea>
              <div className="form-note mt-1">
                <span className="text-capitalize">note: </span>Only team members
                can see notes.
              </div>
              {descriptionError && (
                <div className="error-message">{descriptionError}</div>
              )}
            </div>
          </div>
        </div>

        <div className="form-box mt-2 ">
          <div className="form-group">
            <label className="label-color">Instruction (optional)</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              placeholder={'Instruction'}
              onChange={(value) => handleInput(value, 'note')}
              value={instruction}
            />
          </div>
          <div className="form-note mt-1">
            <span className="text-capitalize">note: </span>Candidate will see
            this instruction before starting the quiz/assessment.
          </div>
          {instructionError && (
            <div className="error-message">{instructionError}</div>
          )}
        </div>

        <Quiz
          assessmentTitle={assessmentTitle}
          duration={duration}
          marks={marks}
          description={description}
          instruction={instruction}
          setInstructionError={setInstructionError}
          setTitleError={setTitleError}
          setDurationError={setDurationError}
          setMarksError={setMarksError}
          setDescriptionError={setDescriptionError}
          questions={questions}
          saveAssessment={saveAssessment}
          assessmentId={assessmentId}
          saveErrors={saveErrors}
        />
      </form>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAssessment);
