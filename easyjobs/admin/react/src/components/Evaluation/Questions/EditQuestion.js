import ReactQuill from 'react-quill';
import React, { useState, useEffect } from 'react';
import LinkTag from '../../../util/Link';
import { connect } from 'react-redux';
import {
  getQuestionSet,
  saveQuestion,
  resetEdit,
  resetErrors,
} from '../../../redux/actions/evaluationActions';
import Quiz from './Types/Quiz';
import Screening from './Types/Screening';
import { useHistory } from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    questionSet: state.evaluation.questionSet,
    saveLoading: state.evaluation.saveLoading,
    editLoading: state.evaluation.editLoading,
    created: state.evaluation.created,
    saveErrors: state.evaluation.saveErrors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getQuestionSet: (id) => dispatch(getQuestionSet(id)),
    saveQuestion: (params) => dispatch(saveQuestion(params)),
    resetEdit: () => dispatch(resetEdit()),
    resetErrors: () => dispatch(resetErrors()),
  };
};

const EditQuestion = ({
  match,
  questionSet,
  getQuestionSet,
  saveLoading,
  editLoading,
  saveQuestion,
  created,
  resetEdit,
  saveErrors,
  resetErrors,
}) => {
  const [questionSetId, setQuestionSetId] = useState(undefined);
  const [questionTitle, setQuestionTitle] = useState('');
  const [type, setType] = useState(1);
  const [description, setDescription] = useState('');
  const [instruction, setInstruction] = useState('');
  const [titleError, setTitleError] = useState('');
  const [typeError, setTypeError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [questionsOfASet, setQuestionsOfASet] = useState([]);

  useEffect(() => {
    if (match) {
      match.params.id && setQuestionSetId(match.params.id);
      getQuestionSet(match.params.id);
    }
  }, [match]);

  useEffect(() => {
    return () => {
      resetErrors();
    };
  }, []);

  useEffect(() => {
    if (saveErrors?.set_name?.length) {
      setTitleError(saveErrors.set_name[0]);
    }
  }, [saveErrors]);

  useEffect(() => {
    questionSet?.set_name && setQuestionTitle(questionSet?.set_name);
    questionSet?.set_type && setType(questionSet?.set_type?.id);
    questionSet?.internal_note && setDescription(questionSet?.internal_note);
    questionSet?.note && setInstruction(questionSet?.note);
    questionSet?.questions && setQuestionsOfASet(questionSet?.questions);
  }, [questionSet]);

  const history = useHistory();
  useEffect(() => {
    if (created) {
      history.push(history.location.pathname + '?page=easyjobs-questions');
    }
    return () => {
      resetEdit();
    };
  }, [created]);

  const setTypes = [
    { id: 1, name: 'Screening' },
    { id: 2, name: 'Quiz' },
  ];

  const handleInput = (e, name) => {
    if (name === 'set_name') {
      setQuestionTitle(e.target.value);
      setTitleError('');
    } else if (name === 'set_type') {
      setType(e.target.value);
      setTypeError('');
    } else if (name === 'internal_note') {
      setDescription(e.target.value);
      setDescriptionError('');
    } else if (name === 'note') {
      setInstruction(e);
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
          to={'easyjobs-questions'}
          className="back-button__icon router-link-active"
        >
          <i className="eicon e-back"></i>
        </LinkTag>
        <div className="back-button__text text-capitalize">
          Back To All Question Set
        </div>
      </div>

      <div className="section-title mb-4 text-capitalize">
        Edit Question Set
      </div>

      <form
        className={`evaluation-form ${
          saveLoading || editLoading ? 'ej-loading' : ''
        }`}
      >
        <div className="form-box form-filter">
          <div className="form-group row">
            <div className="col-md-9">
              <label className="text-capitalize">Set Name*</label>
              <input
                type="text"
                id="set_name"
                maxLength="250"
                placeholder="Question Set Name"
                required="required"
                autoFocus="autofocus"
                className="form-control"
                value={questionTitle}
                onChange={(e) => handleInput(e, 'set_name')}
              />
              {titleError && <div className="error-message">{titleError}</div>}
            </div>
            <div className="col-md-3">
              <div className="form-group mb-0">
                <label className="text-capitalize">Set Type*</label>
                <div className="select-option">
                  <select
                    className="ej-candidate-job-select"
                    onChange={(e) => handleInput(e, 'set_type')}
                    value={type}
                  >
                    {setTypes.map((t, index) => (
                      <option value={t.id} key={`type-${t.id}`}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {typeError && <div className="error-message">{typeError}</div>}
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
        </div>

        {type == 2 && (
          <Quiz
            questionTitle={questionTitle}
            type={type}
            description={description}
            instruction={instruction}
            setTitleError={setTitleError}
            setTypeError={setTypeError}
            setDescriptionError={setDescriptionError}
            saveQuestion={saveQuestion}
            questionsOfASet={questionsOfASet}
            questionSetId={questionSetId}
            saveErrors={saveErrors}
          />
        )}
        {type == 1 && (
          <Screening
            questionTitle={questionTitle}
            type={type}
            description={description}
            instruction={instruction}
            setTitleError={setTitleError}
            setTypeError={setTypeError}
            setDescriptionError={setDescriptionError}
            saveQuestion={saveQuestion}
            questionsOfASet={questionsOfASet}
            questionSetId={questionSetId}
            saveErrors={saveErrors}
          />
        )}
      </form>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditQuestion);
