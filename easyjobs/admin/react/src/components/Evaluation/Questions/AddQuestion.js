import ReactQuill from 'react-quill';
import React, { useState, useEffect } from 'react';
import LinkTag from '../../../util/Link';
import { connect } from 'react-redux';
import {
  saveQuestion,
  resetEdit,
  resetErrors,
} from '../../../redux/actions/evaluationActions';
import Quiz from './Types/Quiz';
import Screening from './Types/Screening';
import { useHistory } from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    saveLoading: state.evaluation.saveLoading,
    created: state.evaluation.created,
    saveErrors: state.evaluation.saveErrors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveQuestion: (params) => dispatch(saveQuestion(params)),
    resetEdit: () => dispatch(resetEdit()),
    resetErrors: () => dispatch(resetErrors()),
  };
};

const AddQuestion = ({
  saveQuestion,
  saveLoading,
  created,
  saveErrors,
  resetEdit,
  resetErrors,
}) => {
  const [questionTitle, setQuestionTitle] = useState('');
  const [type, setType] = useState(1);
  const [description, setDescription] = useState('');
  const [instruction, setInstruction] = useState('');
  const [titleError, setTitleError] = useState('');
  const [typeError, setTypeError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

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
      resetErrors();
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

      <div className="section-title mb-4 text-capitalize">Add Question Set</div>

      <form className={`evaluation-form ${saveLoading ? 'ej-loading' : ''}`}>
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
                    defaultValue={type}
                  >
                    {setTypes.map((type, index) => (
                      <option value={type.id} key={`type-${type.id}`}>
                        {type.name}
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
            saveErrors={saveErrors}
          />
        )}
      </form>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AddQuestion);
