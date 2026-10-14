import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import LinkTag from '../../util/Link';
import { connect } from 'react-redux';
import Candidates from './Candidates';
import { candidateSortOptions, allFilters, stages } from '../../util/helper';
import { useLocation } from 'react-router-dom';
import { streamFile } from '../../util/streamFile';

import {
  getAllJobCandidates,
  setCandidatesRating,
  getPendingCandidates,
  deletePendingCandidate,
  sendInvitation,
  getInvitedCandidates,
  getFilteredCandidates,
  deleteInviteCandidate,
} from '../../redux/actions/jobCadidatesActions';

const mapStateToProps = (state) => {
  return {
    allJobCandidates: state.jobCandidates.allJobCandidates,
    candidatesJob: state.jobCandidates.candidatesJob,
    loading: state.jobCandidates.loading,
    ratingLoading: state.jobCandidates.ratingLoading,
    pendingCandidates: state.jobCandidates.pendingCandidates,
    invitedCandidates: state.jobCandidates.invitedCandidates,
    filteredCandidates: state.jobCandidates.filteredCandidates,
    ratingData: state.jobCandidates.ratingData,
    sendInvitationLoading: state.jobCandidates.sendInvitationLoading,
    deleteInvitationLoading: state.jobCandidates.deleteInvitationLoading,
    deletePendingLoading: state.jobCandidates.deletePendingLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllJobCandidates: (params) => dispatch(getAllJobCandidates(params)),
    setCandidatesRating: (params) => dispatch(setCandidatesRating(params)),
    getPendingCandidates: (params) => dispatch(getPendingCandidates(params)),
    deletePendingCandidate: (params) =>
      dispatch(deletePendingCandidate(params)),
    sendInvitation: (params) => dispatch(sendInvitation(params)),
    getInvitedCandidates: (params) => dispatch(getInvitedCandidates(params)),
    getFilteredCandidates: (params) => dispatch(getFilteredCandidates(params)),
    deleteInviteCandidate: (params) => dispatch(deleteInviteCandidate(params)),
  };
};

const JobCandidates = ({
  allJobCandidates,
  candidatesJob,
  getAllJobCandidates,
  loading,
  setCandidatesRating,
  ratingLoading,
  getPendingCandidates,
  pendingCandidates,
  deletePendingCandidate,
  sendInvitation,
  getInvitedCandidates,
  invitedCandidates,
  getFilteredCandidates,
  filteredCandidates,
  deleteInviteCandidate,
  sendInvitationLoading,
  deleteInvitationLoading,
  deletePendingLoading,
  ratingData,
}) => {
  const [filterDatas, setFilterDatas] = useState([]);
  const [stageFilterDatas, setStageFilterDatas] = useState('');
  const [sortFilterData, setSortFilterData] = useState('');
  const [searchFilterData, setSearchFilterData] = useState('');

  const allFiltersData = allFilters();
  const allStageFilters = stages();

  const [checkedState, setCheckedState] = useState(
    new Array(allFiltersData.length).fill(false),
  );

  const [checkedStage, setCheckedStage] = useState(
    new Array(candidatesJob?.pipeline?.length).fill(false),
  );

  useEffect(() => {
    if (candidatesJob) {
      setCheckedStage(new Array(candidatesJob?.pipeline?.length).fill(false));
    }
  }, [candidatesJob]);

  const handleStageFilterCheck = (e, position) => {
    const updatedCheckedState = checkedStage.map((item, index) =>
      index === position ? !item : item,
    );
    setCheckedStage(updatedCheckedState);

    const stageFilter = [];
    const allFilterData = updatedCheckedState.map((item, index) => {
      if (item === true) {
        return stageFilter.push(candidatesJob?.pipeline[index].id);
      }
    });
    const stageFilterString = stageFilter.join();
    setStageFilterDatas(stageFilterString);
  };

  const handleFilterChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item,
    );
    setCheckedState(updatedCheckedState);

    const filter = [];
    const allFilterData = updatedCheckedState.map((item, index) => {
      if (item === true) {
        return filter.push(allFiltersData[index].value);
      }
    });
    setFilterDatas(filter);
  };

  const filterBySorting = (e) => {
    if (e.target.value === 'select') {
      setSortFilterData('');
    } else {
      setSortFilterData(e.target.value);
    }
  };

  const handleSearchFilter = (e) => {
    setSearchFilterData(e.target.value);
  };

  const [timeoutId, setTimeoutId] = useState(false);
  useEffect(() => {
    if (!timeoutId) {
      setTimeoutId(true);
      return () => {};
    }

    clearTimeout(timeoutId);
    const Id = setTimeout(() => {
      getFilteredCandidates({
        job_id: ej_job_id,
        parameters: {
          filter: filterDatas,
          pipeline: stageFilterDatas,
          sortBy: sortFilterData,
          search: searchFilterData,
        },
      });
    }, 500);
    setTimeoutId(Id);
  }, [searchFilterData]);

  useEffect(() => {
    getFilteredCandidates({
      job_id: ej_job_id,
      parameters: {
        filter: filterDatas,
        pipeline: stageFilterDatas,
        sortBy: sortFilterData,
        search: searchFilterData,
      },
    });
  }, [filterDatas, stageFilterDatas, sortFilterData]);

  const { search } = useLocation();
  const ej_job_id = new URLSearchParams(search).get('id');

  const [emailValue, setEmailValue] = useState('');
  const [emailValidation, setEmailValidation] = useState(true);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmailValue(value);
    setEmailValidation(!isValidEmail(value));
  };

  const isValidEmail = (email) => {
    const reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    var data = {
      email: emailValue,
    };
    sendInvitation({
      id: ej_job_id,
      type: 'invite_candidate',
      data: data,
    });
    setEmailValue('');
    setEmailValidation(true);
    // getInvitedCandidates({ job_id: ej_job_id });
  };

  const haldlePendingCandidates = () => {
    getPendingCandidates({ job_id: ej_job_id });
  };

  const haldleInvitedCandidates = () => {
    getInvitedCandidates({ job_id: ej_job_id });
  };

  const handlePendingCandidateDelete = (candidateId) => {
    deletePendingCandidate({ job_id: ej_job_id, candidate: candidateId });
  };

  const handleInviteCandidateDelete = (candidateEmail) => {
    deleteInviteCandidate({
      id: ej_job_id,
      type: 'delete_invitation',
      data: {
        email: candidateEmail,
      },
    });
    // getInvitedCandidates({ job_id: ej_job_id });
  };

  const [exporting, setExporting] = useState(false);

  // The PHP proxy fetches the export file server-side, so the browser never
  // leaves wp-admin (or sees the API token) and failures show as a toast.
  const handleCandidateExport = async (e, candidates) => {
    e.preventDefault();
    if (exporting) {
      return;
    }
    if (!candidates?.length) {
      swal({
        title: 'No candidates to export',
        text: 'Click ok to continue',
        icon: 'error',
        buttons: [false, 'Ok'],
        timer: 1500,
      });
      return;
    }
    setExporting(true);
    await streamFile(
      'easyjobs_export_job_candidates',
      {
        job_id: ej_job_id,
        keywords: JSON.stringify({
          filter: filterDatas,
          pipeline: stageFilterDatas,
          sortBy: sortFilterData,
          search: searchFilterData,
        }),
      },
      {
        download: true,
        errorMessage: __('Unable to export candidates', 'easyjobs'),
      },
    );
    setExporting(false);
  };

  const handleInvitationClick = (
    candidateEmail,
    candidateType,
    candidateId,
    jobId,
  ) => {
    if (candidateType === 'invited') {
      var data = {
          email: candidateEmail,
        },
        candidateType = 'invite_candidate';
    } else {
      var data = {
          candidates: candidateId,
        },
        candidateType = 'pending_candidate';
    }
    sendInvitation({
      id: jobId,
      type: candidateType,
      data: data,
    });
  };

  const handleRatingOnClick = (rate, id) => {
    setCandidatesRating({
      job_id: ej_job_id,
      id: id,
      type: 'rate_candidate',
      data: {
        rating: rate,
      },
    });
    // getAllJobCandidates({ job_id: ej_job_id });
  };
  useEffect(() => {
    getAllJobCandidates({ job_id: ej_job_id });
  }, []);

  return (
    <>
      <section className="candidates-section section-gap">
        <div className="d-flex flex-wrap align-items-start justify-content-between">
          <div className="back-button mt-0">
            <LinkTag to={'easyjobs-jobs'} className="back-button__icon">
              <i className="easyjobs-icon easyjobs-back"></i>
            </LinkTag>
            <div className="back-button__text d-none d-md-block">
              {__('Back To Jobs', 'easyjobs')}
            </div>
          </div>
          <div className="dropdown ej-job-candidates-action ml-auto mr-3">
            <button
              className="button info-button dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {__('More', 'easyjobs')}
            </button>
            <div
              className="dropdown-menu dropdown-menu-right"
              aria-labelledby="dropdownMenuButton"
            >
              <a
                className="dropdown-item"
                href="#"
                data-toggle="modal"
                data-target="#ej-invite-candidate-modal"
                onClick={haldleInvitedCandidates}
              >
                {__('Invite candidates', 'easyjobs')}
              </a>
              <LinkTag
                className="dropdown-item"
                to={`easyjobs-pipeline&id=${ej_job_id}`}
              >
                {__('Pipeline', 'easyjobs')}
              </LinkTag>
              <a
                className="dropdown-item ej-export-candidates"
                href="#"
                onClick={(e) => handleCandidateExport(e, allJobCandidates)}
                aria-disabled={exporting}
              >
                {exporting
                  ? __('Exporting...', 'easyjobs')
                  : __('Export', 'easyjobs')}
              </a>
              <a
                className="dropdown-item"
                href="#"
                data-toggle="modal"
                data-target="#ej-pending-candidate-modal"
                onClick={haldlePendingCandidates}
              >
                {__('Pending candidates', 'easyjobs')}
              </a>
            </div>
          </div>
        </div>
        <div className="section-title-wrap">
          <div className="mt-1">
            <div className="section-title">{candidatesJob?.title}</div>
            <p className="section-label">{candidatesJob?.created_at}</p>
          </div>
          <div className="d-flex ej-candidate-search-filter align-items-center">
            <div className="ej-job-candidate-filter">
              <div className="select-option">
                <select onChange={filterBySorting}>
                  <option value="select" selected>
                    {__('Sort candidates', 'easyjobs')}
                  </option>
                  {candidateSortOptions().map((option) => (
                    <option value={option.value}>{option.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <form
              action=""
              className="form-filter mb-0 mt-1 ej-candidate-search"
            >
              <div className="search-bar mr-0">
                <input
                  type="text"
                  className="easyjobs-search-candidates"
                  placeholder="Search Candidates Name . . ."
                  value={searchFilterData}
                  onChange={handleSearchFilter}
                />
              </div>
            </form>
          </div>
        </div>
        <div className={'candidates-box'}>
          <div className="candidates-filter-box easyjobs-filter">
            <div className="filter-card">
              <div className="filter-card__heading gutter-10">
                <div className="section-title">{__('Filter', 'easyjobs')}</div>
              </div>
              <div className="filter-card__body gutter-10">
                <ul>
                  {allFiltersData.map(({ name, value }, index) => {
                    return (
                      <li>
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            id={`candidate_filter_${index + 1}`}
                            name="candidate_filter"
                            className="filter"
                            value={value}
                            checked={checkedState[index]}
                            onChange={() => handleFilterChange(index)}
                          />
                          <span>{__(name, 'easyjobs')}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            {candidatesJob?.pipeline && (
              <div className="filter-card">
                <div className="filter-card__heading gutter-10">
                  <div className="section-title">
                    {__('Filter By Stage', 'easyjobs')}
                  </div>
                </div>
                <div className="filter-card__body gutter-10">
                  <ul>
                    {candidatesJob?.pipeline?.map(({ label, id }, index) => {
                      return (
                        <li>
                          <label className="checkbox">
                            <input
                              type="checkbox"
                              value={id}
                              id={`candidate_stage_filter_${id}`}
                              name="candidate_filter_stage"
                              className="stage-filter"
                              onChange={(e) => handleStageFilterCheck(e, index)}
                              checked={checkedStage[index]}
                            />
                            <span>{__(label, 'easyjobs')}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <Candidates
            pipelines={candidatesJob?.pipeline}
            handleRatingOnClick={handleRatingOnClick}
            allJobCandidates={allJobCandidates}
            loading={loading}
            ratingLoading={ratingLoading}
          />
        </div>
      </section>
      <div
        id="ej-invite-candidate-modal"
        className="modal fade ej-modal ej-invite-candidate-modal"
      >
        <div
          role="document"
          className="modal-dialog modal-lg modal-dialog-centered"
        >
          <div
            className={`modal-content ${
              sendInvitationLoading || deleteInvitationLoading
                ? 'ej-loading'
                : ''
            }`}
          >
            <div className="modal-header">
              <h4 className="modal-title text-uppercase">Invite candidates</h4>
              <button
                type="button"
                data-dismiss="modal"
                aria-label="Close"
                className="close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body invite__candidate">
              <form
                className="ej-invite-candidate"
                data-nonce="<?php echo esc_html( wp_create_nonce( 'easyjobs_invite_candidate' ) ); ?>"
                data-job-id={ej_job_id}
                onSubmit={handleEmailSubmit}
              >
                <label>Email*</label>
                <div className="input-group mb-3 mt-1">
                  <input
                    type="email"
                    name="email"
                    required="required"
                    placeholder="user@easy.jobs"
                    className="form-control user-email"
                    value={emailValue}
                    onChange={handleEmailChange}
                  />
                  <button
                    type="submit"
                    className="button info-button text-capitalize"
                    disabled={emailValidation}
                  >
                    invite
                  </button>
                </div>
                <div className="error-message mb-3"></div>
              </form>
              <div className="data-table user-table invite__candidate--table">
                <div
                  className={
                    invitedCandidates?.length > 0 ? 'table-wrap' : 'table-wrap'
                  }
                >
                  <div className="table table-modal">
                    {invitedCandidates?.length > 0 ? (
                      <>
                        <div className="table__row table__head">
                          <div className="table-cell">
                            {__('Name', 'easyjobs')}
                          </div>
                          <div className="table-cell">
                            {__('Email', 'easyjobs')}
                          </div>
                          <div className="table-cell" style={{ width: 110 }}>
                            <span className="d-flex justify-content-end">
                              {__('Actions', 'easyjobs')}
                            </span>
                          </div>
                        </div>
                        {invitedCandidates.map((candidate) => (
                          <div className="table__row">
                            <div className="table-cell">{candidate?.name}</div>
                            <div className="table-cell">
                              <span className="text-break">
                                {candidate?.email}
                              </span>
                            </div>
                            <div className="table-cell" style={{ width: 100 }}>
                              <div className="d-flex justify-content-end">
                                <a
                                  className="control-button control-button--warning resend-invitation"
                                  href="#"
                                  onClick={() =>
                                    handleInvitationClick(
                                      candidate.email,
                                      'invited',
                                      candidate.id,
                                      ej_job_id,
                                    )
                                  }
                                >
                                  <div className="control-button__icon">
                                    <i className="easyjobs-icon easyjobs-send"></i>
                                  </div>
                                </a>
                                <a
                                  className="control-button control-button--danger ej-delete-pending-invitation"
                                  href="#"
                                  onClick={() =>
                                    handleInviteCandidateDelete(candidate.email)
                                  }
                                >
                                  <div className="control-button__icon">
                                    <i className="easyjobs-icon easyjobs-delete"></i>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <h6 class="empty-message m-0 pl-0 py-3">
                        No invitation found.
                      </h6>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-between"></div>
          </div>
        </div>
      </div>
      <div
        id="ej-pending-candidate-modal"
        className="modal fade ej-modal ej-pending-candidate-modal"
      >
        <div
          role="document"
          className="modal-dialog modal-lg modal-dialog-centered"
        >
          <div
            className={`modal-content ${
              sendInvitationLoading || deletePendingLoading ? 'ej-loading' : ''
            }`}
          >
            <div className="modal-header">
              <h4 className="modal-title text-uppercase">
                {__('Pending candidates', 'easyjobs')}
              </h4>
              <button
                type="button"
                data-dismiss="modal"
                aria-label="Close"
                className="close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body invite__candidate">
              <div className="data-table user-table invite__candidate--table">
                <div
                  className={
                    pendingCandidates?.length > 0 ? 'table-wrap' : 'table-wrap'
                  }
                >
                  <div className="table table-modal">
                    {pendingCandidates?.length > 0 ? (
                      <>
                        <div className="table__row table__head">
                          <div className="table-cell">
                            {__('Name', 'easyjobs')}
                          </div>
                          <div className="table-cell">
                            {__('Email', 'easyjobs')}
                          </div>
                          <div className="table-cell">
                            {__('Updated on', 'easyjobs')}
                          </div>
                          <div className="table-cell" style={{ width: 110 }}>
                            <span className="d-flex justify-content-end">
                              {__('Actions', 'easyjobs')}
                            </span>
                          </div>
                        </div>
                        {pendingCandidates.map((candidate) => (
                          <div
                            className="table__row"
                            data-candidate-email={candidate.email}
                            data-candidate-type="pending"
                            data-candidate-id={candidate.id}
                          >
                            <div className="table-cell">{candidate.name}</div>
                            <div className="table-cell">
                              <span className="text-break">
                                {candidate.email}
                              </span>
                            </div>
                            <div className="table-cell">
                              <span className="text-break">
                                {candidate.last_update}
                              </span>
                            </div>
                            <div className="table-cell" style={{ width: 100 }}>
                              <div className="d-flex justify-content-end">
                                <a
                                  className="control-button control-button--warning resend-invitation"
                                  href="#"
                                  onClick={() =>
                                    handleInvitationClick(
                                      candidate.email,
                                      'pending',
                                      candidate.id,
                                      ej_job_id,
                                    )
                                  }
                                >
                                  <div className="control-button__icon">
                                    <i className="easyjobs-icon easyjobs-send"></i>
                                  </div>
                                </a>
                                <a
                                  className="control-button control-button--danger ej-delete-pending-invitation"
                                  href="#"
                                  onClick={() =>
                                    handlePendingCandidateDelete(candidate.id)
                                  }
                                >
                                  <div className="control-button__icon">
                                    <i className="easyjobs-icon easyjobs-delete"></i>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <h6 class="empty-message m-0 pl-0 py-3">
                        No Pending candidates found.
                      </h6>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-between"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(JobCandidates);
