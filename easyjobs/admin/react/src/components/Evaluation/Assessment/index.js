import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { connect } from 'react-redux';
import {
  getAllQuestion,
  deleteQuestion,
} from '../../../redux/actions/evaluationActions';
import LinkTag from '../../../util/Link';

const mapStateToProps = (state) => {
  return {
    allAssessment: state.evaluation.allQuestion,
    loading: state.evaluation.loading,
    deleteLoading: state.evaluation.deleteLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllAssessment: (params) => dispatch(getAllQuestion(params)),
    deleteAssessment: (params) => dispatch(deleteQuestion(params)),
  };
};

const Assessment = ({
  getAllAssessment,
  allAssessment,
  deleteAssessment,
  loading,
  deleteLoading,
}) => {
  const [sortBy, setSortBy] = useState();
  const [searchText, setSearchText] = useState('');
  const [timeoutId, setTimeoutId] = useState(true);
  const [removeModalShowHide, setRemoveModalShowHide] = useState({
    display: 'none',
  });
  const [assessmentIdToDelete, setAssessmentIdToDelete] = useState();

  useEffect(() => {
    document.title = `Easyjobs - Assessments ‹ ${easyJobsJs.title} — WordPress`;
    getAllAssessment({ type: 'assessments' });
  }, []);

  const handleDeleteAssessmentInit = (e, id) => {
    e.preventDefault();
    setAssessmentIdToDelete(id);
    setRemoveModalShowHide({ display: 'block' });
  };

  const handleCancleRemove = (e) => {
    e.preventDefault();
    setRemoveModalShowHide({ display: 'none' });
  };

  const handleRemoveAssessment = (e) => {
    e.preventDefault();
    setRemoveModalShowHide({ display: 'none' });
    deleteAssessment({ id: assessmentIdToDelete, type: 'delete_assessment' });
  };

  const filterBySort = (e) => {
    if (e.target.value === 'select') {
      setSortBy(undefined);
    } else {
      setSortBy(e.target.value);
    }
    getAllAssessment({
      name: searchText,
      sort_by: e.target.value,
      type: 'assessments',
    });
  };

  const filterBySearch = (e) => {
    setSearchText(e.target.value);
    if (!timeoutId) {
      setTimeoutId(true);
      return () => {};
    }

    clearTimeout(timeoutId);
    const Id = setTimeout(() => {
      getAllAssessment({
        name: e.target.value,
        sort_by: sortBy,
        type: 'assessments',
      });
    }, 500);
    setTimeoutId(Id);
  };

  return (
    <>
      <section className={`user-list section-gap`}>
        <div className="section-title-wrap flex-wrap gap-10 align-items-center question-filter-wrap">
          <div className="d-flex justify-content-between">
            <h2 className="section-title mr-2">All Assessments</h2>
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
                  <option value="question">Question Count</option>
                  <option value="created">Created On</option>
                  <option value="updated">Updated On</option>
                </select>
              </div>
            </div>
          </div>
          <LinkTag
            to={'easyjobs-create-assessment'}
            className="button primary-button button-icon"
          >
            <span className="icon">
              <i className="eicon e-plus"></i>
            </span>{' '}
            <span className="text-capitalize">Create Assessment</span>
          </LinkTag>
        </div>
        <div
          className={`row has-col-gap ${
            loading || deleteLoading ? 'ej-loading' : ''
          }`}
        >
          {allAssessment ? (
            allAssessment?.map((question) => {
              return (
                <div className="col-xl-3 col-lg-4 col-sm-6 mb-4">
                  <div className={'question-card assessment-card'}>
                    <ul className="card-ul-top">
                      <li>
                        Group Name:{' '}
                        <LinkTag
                          to={`easyjobs-assessment-edit&id=${question.id}`}
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

                    <div className="d-flex mt-auto flex-wrap buttons">
                      <LinkTag
                        to={`easyjobs-assessment-edit&id=${question.id}`}
                      >
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
                          handleDeleteAssessmentInit(e, question?.id)
                        }
                        className="control-button control-button--danger has_bg_color"
                      >
                        <div className="control-button__icon">
                          <i className="eicon e-delete"></i>
                        </div>
                        <span>Delete</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : loading ? (
            <h4 className="empty-message" style={{ width: '100%' }}>
              {__('Loading Assessments...', 'easyjobs')}
            </h4>
          ) : (
            <h4 className="empty-message" style={{ width: '100%' }}>
              {__('No Assessment found.', 'easyjobs')}
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
                    Are you sure, you want to remove this Assessment?
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
                    onClick={(e) => handleRemoveAssessment(e)}
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

export default connect(mapStateToProps, mapDispatchToProps)(Assessment);
