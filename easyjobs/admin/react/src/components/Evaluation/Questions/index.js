import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { connect } from 'react-redux';
import {
  getAllQuestion,
  deleteQuestion,
  duplicateQuestion,
  resetDuplicateSet,
} from '../../../redux/actions/evaluationActions';
import LinkTag from '../../../util/Link';
import { useHistory } from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    allQuestion: state.evaluation.allQuestion,
    loading: state.evaluation.loading,
    deleteLoading: state.evaluation.deleteLoading,
    duplicateLoading: state.evaluation.duplicateLoading,
    duplicated: state.evaluation.duplicated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllQuestion: (params) => dispatch(getAllQuestion(params)),
    deleteQuestion: (params) => dispatch(deleteQuestion(params)),
    duplicateQuestion: (id) => dispatch(duplicateQuestion(id)),
    resetDuplicateSet: () => dispatch(resetDuplicateSet()),
  };
};

const Question = ({
  getAllQuestion,
  allQuestion,
  deleteQuestion,
  loading,
  deleteLoading,
  duplicateQuestion,
  duplicateLoading,
  duplicated,
  resetDuplicateSet,
}) => {
  const [sortBy, setSortBy] = useState();
  const [searchText, setSearchText] = useState('');
  const [timeoutId, setTimeoutId] = useState(true);
  const [removeModalShowHide, setRemoveModalShowHide] = useState({
    display: 'none',
  });
  const [qIdToDelete, setQIdToDelete] = useState();
  const [duplicateModalShowHide, setDuplicateModalShowHide] = useState({
    display: 'none',
  });
  const [qIdToDuplicate, setQIdToDuplicate] = useState();

  useEffect(() => {
    document.title = `Easyjobs - Question Set ‹ ${easyJobsJs.title} — WordPress`;
    getAllQuestion({});
  }, []);

  const history = useHistory();
  useEffect(() => {
    if (duplicated && duplicated.id) {
      history.push(
        history.location.pathname +
          '?page=easyjobs-questions-edit&id=' +
          duplicated.id,
      );
    }
    return () => {
      resetDuplicateSet();
    };
  }, [duplicated]);

  const handleDuplicateQuestionInit = (e, id) => {
    e.preventDefault();
    setQIdToDuplicate(id);
    setDuplicateModalShowHide({ display: 'block' });
  };

  const handleCancleDuplicate = (e) => {
    e.preventDefault();
    setDuplicateModalShowHide({ display: 'none' });
  };

  const handleDuplicateQuestion = (e) => {
    e.preventDefault();
    setDuplicateModalShowHide({ display: 'none' });
    duplicateQuestion(qIdToDuplicate);
  };

  const handleDeleteQuestionInit = (e, id) => {
    e.preventDefault();
    setQIdToDelete(id);
    setRemoveModalShowHide({ display: 'block' });
  };

  const handleCancleRemove = (e) => {
    e.preventDefault();
    setRemoveModalShowHide({ display: 'none' });
  };

  const handleRemoveQuestion = (e) => {
    e.preventDefault();
    setRemoveModalShowHide({ display: 'none' });
    deleteQuestion({ id: qIdToDelete });
  };

  const filterBySort = (e) => {
    if (e.target.value === 'select') {
      setSortBy(undefined);
    } else {
      setSortBy(e.target.value);
    }
    getAllQuestion({ name: searchText, sort_by: e.target.value });
  };

  const filterBySearch = (e) => {
    setSearchText(e.target.value);
    if (!timeoutId) {
      setTimeoutId(true);
      return () => {};
    }

    clearTimeout(timeoutId);
    const Id = setTimeout(() => {
      getAllQuestion({
        name: e.target.value,
        sort_by: sortBy,
      });
    }, 500);
    setTimeoutId(Id);
  };

  return (
    <>
      <section className={`user-list section-gap`}>
        {/*<div className="section-title-wrap">*/}
        {/*  <h2 className="section-title">*/}
        {/*    {__('All Question Sets', 'easyjobs')}*/}
        {/*  </h2>*/}
        {/*</div>*/}
        <div className="section-title-wrap flex-wrap gap-10 align-items-center question-filter-wrap">
          <div className="d-flex justify-content-between">
            <h2 className="section-title mr-2">All Question Sets</h2>
          </div>
          <div className="form-filter mr-auto mb-0">
            <div className="form-group mb-0">
              <div className="search-bar">
                <input
                  type="text"
                  value={searchText}
                  onChange={filterBySearch}
                  placeholder="Search. . ."
                  id="filter_name"
                  autoFocus="autofocus"
                />
              </div>
            </div>
            <div className="form-group mb-0">
              <div className="select-option">
                <select
                  className="ej-candidate-job-select"
                  value={sortBy}
                  onChange={filterBySort}
                >
                  <option value="select">Sort By</option>
                  <option value="name">Question Name</option>
                  <option value="type">Question Type</option>
                  <option value="question">Question Count</option>
                  <option value="created">Created On</option>
                  <option value="updated">Updated On</option>
                </select>
              </div>
            </div>
          </div>
          <LinkTag
            to={'easyjobs-create-question'}
            className="button primary-button button-icon"
          >
            <span className="icon">
              <i className="eicon e-plus"></i>
            </span>{' '}
            <span className="text-capitalize">Add New Set</span>
          </LinkTag>
        </div>
        <div
          className={`row has-col-gap ${
            loading || deleteLoading || duplicateLoading ? 'ej-loading' : ''
          }`}
        >
          {allQuestion ? (
            allQuestion?.map((question) => {
              return (
                <div className="col-xl-3 col-lg-4 col-sm-6 mb-4">
                  <div className={'question-card'}>
                    <ul className="card-ul-top">
                      <li>
                        Group Name:{' '}
                        <LinkTag
                          to={`easyjobs-questions-edit&id=${question.id}`}
                        >
                          {question?.name}
                        </LinkTag>
                      </li>
                      <li>
                        Question Type: <span>{question?.exam_type?.name}</span>
                      </li>
                      <li>
                        Total Questions:{' '}
                        <span>{question?.total_questions}</span>
                      </li>
                    </ul>
                    <ul className="card-ul-bottom">
                      <li>
                        Created By: <span>{question?.created_by}</span>
                      </li>
                      <li>
                        Updated By: <span>{question?.updated_by}</span>
                      </li>
                      <li>
                        Updated On: <span>{question?.last_update}</span>
                      </li>
                    </ul>

                    <div className="d-flex mt-auto flex-wrap buttons questions">
                      <a
                        href="#"
                        className="control-button control-button--primary has_bg_color"
                        onClick={(e) =>
                          handleDuplicateQuestionInit(e, question?.id)
                        }
                      >
                        <div className="control-button__icon">
                          <i className="eicon e-duplicate"></i>
                        </div>
                        <span>Copy</span>
                      </a>
                      <LinkTag to={`easyjobs-questions-edit&id=${question.id}`}>
                        <div className="control-button control-button--primary has_bg_color">
                          <div className="control-button__icon">
                            <i className="eicon e-pencil"></i>
                          </div>
                          <span>Edit</span>
                        </div>
                      </LinkTag>
                      <a
                        href="#"
                        onClick={(e) =>
                          handleDeleteQuestionInit(e, question?.id)
                        }
                        className="control-button control-button--danger has_bg_color"
                      >
                        <div className="control-button__icon">
                          <i className="eicon e-delete"></i>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : loading ? (
            <h4 className="empty-message" style={{ width: '100%' }}>
              {__('Loading Questions...', 'easyjobs')}
            </h4>
          ) : (
            <h4 className="empty-message" style={{ width: '100%' }}>
              {__('No Questions found.', 'easyjobs')}
            </h4>
          )}
        </div>
      </section>
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
                    Are you sure, you want to remove this question set?
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
                    onClick={(e) => handleRemoveQuestion(e)}
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
        style={duplicateModalShowHide}
      >
        <div className="dg-backdrop"></div>
        <div className="dg-container">
          <div className="dg-content-cont dg-content-cont--floating">
            <div className="dg-main-content">
              <div className="dg-view-wrapper">
                <div className="dg-content-body dg-content-body--has-title">
                  <h6 className="dg-title">Confirmation</h6>
                  <div className="dg-content">
                    Are you sure you want to duplicate this question set?
                  </div>
                </div>
                <div className="dg-content-footer">
                  <button
                    className="dg-btn dg-btn--cancel remove-rating-cancel"
                    onClick={handleCancleDuplicate}
                  >
                    <span>No</span>
                  </button>
                  <button
                    className="dg-btn dg-btn--ok dg-pull-right ej-candidate-action-confirm"
                    onClick={handleDuplicateQuestion}
                  >
                    <span className="dg-btn-content">Yes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Question);
