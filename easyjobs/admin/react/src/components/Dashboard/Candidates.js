import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from 'react';
import LinkTag from '../../util/Link';
import { timeAgo } from '../../util/helper';
import Select from 'react-select';
import Icon from '../../util/Icon';
import CandidateAvatar from '../../util/CandidateAvatar';

// Promo/event cards show a white line-icon on a colored gradient disc.
// Keyed by the event title the API returns, with an index fallback so the
// icons stay correct even if a title changes.
var EVENT_ICONS = {
  'Need more candidate?': {
    icon: 'i-user-plus',
    grad: 'linear-gradient(135deg, #FF8F8F 0%, #F95C5C 100%)',
  },
  'Share Jobs': {
    icon: 'i-share',
    grad: 'linear-gradient(135deg, #FF73D7 0%, #F23CBE 100%)',
  },
  'Read Blog': {
    icon: 'i-book',
    grad: 'linear-gradient(135deg, #FFC06A 0%, #F5972B 100%)',
  },
};
var EVENT_ICONS_BY_INDEX = [
  EVENT_ICONS['Need more candidate?'],
  EVENT_ICONS['Share Jobs'],
  EVENT_ICONS['Read Blog'],
];

// ─── Individual applicant card ────────────────────────────────────────────────
var ApplicantCard = function (props) {
  var candidate = props.candidate;
  var rating = candidate.rating || 0;

  var appliedTime = timeAgo(candidate.applied_at || candidate.created_at);
  var pipelineLabel =
    candidate.pipeline && candidate.pipeline.label
      ? candidate.pipeline.label
      : 'Applied';

  return (
    <div className="ej-appc">
      <div className="ej-appc-top">
        <span className="ej-appc-tag">{pipelineLabel}</span>
        {/* Display-only rating — shows the number, no interaction */}
        <span
          className={'ej-appc-fav' + (rating > 0 ? ' on' : '')}
          aria-label="Rating"
        >
          <Icon id="i-star" size={12} />
          <span className="ej-appc-fav-n">{rating}</span>
        </span>
      </div>

      <CandidateAvatar
        name={candidate.name || ''}
        src={candidate.profile_image}
        size={54}
        className="ej-appc-av"
      />

      <div className="ej-appc-nm">{candidate.name}</div>
      <div className="ej-appc-role" title={candidate.job_title}>
        {candidate.job_title}
      </div>

      {candidate?.applied && (
        <div className="ej-appc-time">
          <Icon id="i-clock" size={11} />
          Applied {candidate?.applied}
        </div>
      )}

      <LinkTag
        to={'easyjobs-candidates&id=' + candidate.id + '&tab=application'}
        className="ej-appc-cta"
      >
        {__('View Details', 'easyjobs')}
      </LinkTag>
    </div>
  );
};

// ─── "More applicants" card ───────────────────────────────────────────────────
var MoreCard = function (props) {
  var restCandidates = props.restCandidates;
  var total = props.total;
  return (
    <div className="ej-appc ej-appc-more">
      <div className="ej-appc-stack">
        {restCandidates.slice(0, 4).map(function (c, i) {
          return (
            <CandidateAvatar
              key={c.id || i}
              name={c.name || ''}
              src={c.profile_image}
              size={34}
              className="ej-appc-stack-sm"
            />
          );
        })}
      </div>
      <div className="ej-appc-nm tnum">{total - 1}+ more</div>
      <div className="ej-appc-role">applicants in your pipeline</div>
      <LinkTag
        to="easyjobs-candidates"
        className="ej-appc-cta ej-appc-cta--dark"
      >
        See all <Icon id="i-arr" size={12} />
      </LinkTag>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
var Candidates = function (props) {
  var candidatesInfo = props.candidatesInfo;
  var getActiveJobs = props.getActiveJobs;
  var activeJobs = props.activeJobs;
  var getInvitedCandidates = props.getInvitedCandidates;
  var invitedCandidates = props.invitedCandidates;
  var invitedCandidatesLoading = props.invitedCandidatesLoading;
  var sendInvitation = props.sendInvitation;
  var deleteInviteCandidate = props.deleteInviteCandidate;

  var _candidates = useState([]);
  var candidates = _candidates[0];
  var setCandidates = _candidates[1];

  var _restCandidates = useState([]);
  var restCandidates = _restCandidates[0];
  var setRestCandidates = _restCandidates[1];

  var _events = useState([]);
  var events = _events[0];
  var setEvents = _events[1];

  var _selectedJob = useState({});
  var selectedJob = _selectedJob[0];
  var setSelectedJob = _selectedJob[1];

  var _activeJobOptions = useState([]);
  var activeJobOptions = _activeJobOptions[0];
  var setActiveJobOption = _activeJobOptions[1];

  var _candidateEmail = useState('');
  var candidateEmail = _candidateEmail[0];
  var setCandidateEmail = _candidateEmail[1];

  var _formDataError = useState({ jobError: '', emailError: '' });
  var formDataError = _formDataError[0];
  var setFormDataError = _formDataError[1];

  var _isValidEmail = useState(false);
  var isValidEmail = _isValidEmail[0];
  var setIsValidEmail = _isValidEmail[1];

  useEffect(
    function () {
      if (candidatesInfo) {
        if (candidatesInfo.total_applicants < 6) {
          if (candidatesInfo.details) setCandidates(candidatesInfo.details);
        } else {
          if (candidatesInfo.details) {
            setCandidates(candidatesInfo.details.slice(0, 4));
            setRestCandidates(candidatesInfo.details.slice(4));
          }
        }
        if (candidatesInfo.events) setEvents(candidatesInfo.events);
      } else {
        // Redux cleared candidatesInfo (navigation away/back) — reset local state to avoid stale data
        setCandidates([]);
        setRestCandidates([]);
        setEvents([]);
      }
    },
    [candidatesInfo],
  );

  useEffect(
    function () {
      if (activeJobs) {
        setActiveJobOption(
          activeJobs.map(function (each) {
            return { label: each.name, value: each.id, data: each };
          }),
        );
      }
    },
    [activeJobs],
  );

  var checkValidEmail = function (email) {
    var reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  };

  var handleActiveJobSelect = function (select) {
    setSelectedJob(select);
    getInvitedCandidates({ job_id: select && select.value });
    setFormDataError(Object.assign({}, formDataError, { jobError: '' }));
  };

  var handleInviteCandidateInit = function (e) {
    e.preventDefault();
    getActiveJobs();
  };

  var validateForm = function () {
    if (!selectedJob || !selectedJob.value) {
      setFormDataError(
        Object.assign({}, formDataError, { jobError: 'Please select a job.' }),
      );
      return false;
    }
    if (!checkValidEmail(candidateEmail)) {
      setFormDataError(
        Object.assign({}, formDataError, {
          emailError: 'Please type a valid email address.',
        }),
      );
      return false;
    }
    return true;
  };

  var handleInviteSubmit = function (e) {
    e.preventDefault();
    if (validateForm()) {
      sendInvitation({
        id: selectedJob.value,
        type: 'invite_candidate',
        data: { email: candidateEmail },
      });
      setCandidateEmail('');
      setIsValidEmail(false);
    }
  };

  var handleEmailChange = function (e) {
    setCandidateEmail(e.target.value);
    setIsValidEmail(checkValidEmail(e.target.value));
    setFormDataError(Object.assign({}, formDataError, { emailError: '' }));
  };

  var handleInviteCandidateDelete = function (email) {
    deleteInviteCandidate({
      id: selectedJob.value,
      type: 'delete_invitation',
      data: { email: email },
    });
  };

  var handleInvitationClick = function (
    candidateEmail,
    candidateType,
    candidateId,
    jobId,
  ) {
    var data = { email: candidateEmail };
    var type = candidateType === 'invited' ? 'invite_candidate' : candidateType;
    sendInvitation({ id: jobId, type: type, data: data });
  };

  return (
    <>
      <section className="ej-section">
        <div className="ej-sec-head">
          <div>
            <h2>{__('Recent Applicants', 'easyjobs')}</h2>
            {candidates.length > 0 && (
              <div className="sub">{__('Last 5 applicants', 'easyjobs')}</div>
            )}
          </div>
          {candidates.length > 0 && (
            <LinkTag to="easyjobs-candidates" className="ej-see-link">
              {__('See all applicants', 'easyjobs')}{' '}
              <Icon id="i-arr" size={13} />
            </LinkTag>
          )}
        </div>

        <div className="ej-applicants">
          {candidates.map(function (candidate) {
            return <ApplicantCard key={candidate.id} candidate={candidate} />;
          })}

          {candidatesInfo && restCandidates.length > 0 && (
            <MoreCard
              restCandidates={restCandidates}
              total={candidatesInfo.total_applicants}
            />
          )}

          {events.map(function (event, ind) {
            var ev = EVENT_ICONS[event.title] ||
              EVENT_ICONS_BY_INDEX[ind] || { icon: 'i-users', grad: '#C9CED8' };
            return (
              <div
                key={ind}
                className={'ej-appc ej-appc-event ' + (event.class || '')}
              >
                <div className="ej-appc-top">
                  <span
                    className="ej-appc-tag"
                    style={{
                      background: 'transparent',
                      color: 'var(--ej-muted)',
                    }}
                  >
                    {event.title}
                  </span>
                </div>
                <div
                  className="ej-appc-av ej-appc-event-icon"
                  style={{ background: ev.grad }}
                >
                  <Icon id={ev.icon} size={26} />
                </div>
                <div className="ej-appc-nm" style={{ fontSize: 13 }}>
                  {event.title}
                </div>
                <div className="ej-appc-role" style={{ whiteSpace: 'normal' }}>
                  {event.short_description}
                </div>

                {event.title === 'Need more candidate?' && (
                  <a
                    data-toggle="modal"
                    data-target="#ej-invite-candidate-modal"
                    className="ej-appc-cta"
                    href="#"
                    onClick={handleInviteCandidateInit}
                  >
                    {__('Invite Candidate', 'easyjobs')}
                  </a>
                )}
                {event.title === 'Share Jobs' && (
                  <LinkTag to="easyjobs-jobs" className="ej-appc-cta">
                    {__('Share Jobs', 'easyjobs')}
                  </LinkTag>
                )}
                {event.title === 'Read Blog' && (
                  <a
                    href="https://easy.jobs/blog/recruitment-strategies-right-candidate/"
                    className="ej-appc-cta"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {__('Read Blog', 'easyjobs')}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Invite modal — unchanged */}
      <div
        id="ej-invite-candidate-modal"
        className="modal fade ej-modal ej-invite-candidate-modal dashboard"
      >
        <div
          role="document"
          className="modal-dialog modal-lg modal-dialog-centered"
        >
          <div
            className={
              'modal-content ' + (invitedCandidatesLoading ? 'ej-loading' : '')
            }
          >
            <div className="modal-header">
              <h4 className="modal-title text-uppercase">
                Invite New candidate
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
              <form
                className="ej-invite-candidate"
                onSubmit={handleInviteSubmit}
              >
                <div className="form-group mb-2">
                  <label>Job*</label>
                  <div className="select-option">
                    <Select
                      classNamePrefix="react-select"
                      options={activeJobOptions}
                      isSearchable={true}
                      isClearable={true}
                      maxMenuHeight={120}
                      placeholder="Select job"
                      onChange={function (selected) {
                        handleActiveJobSelect(selected);
                      }}
                    />
                  </div>
                  {formDataError.jobError && (
                    <div className="error-message mb-3">
                      {formDataError.jobError}
                    </div>
                  )}
                </div>
                <div className="form-group mb-2">
                  <label>Email*</label>
                  <div className="input-group mb-3 mt-1">
                    <input
                      type="email"
                      name="email"
                      required="required"
                      placeholder="user@easy.jobs"
                      className="form-control user-email"
                      value={candidateEmail}
                      onChange={handleEmailChange}
                    />
                    <button
                      type="submit"
                      className="button info-button text-capitalize"
                      disabled={!isValidEmail}
                    >
                      invite
                    </button>
                  </div>
                </div>
                {formDataError.emailError && (
                  <div className="error-message mb-3">
                    {formDataError.emailError}
                  </div>
                )}
              </form>

              {selectedJob && selectedJob.value && (
                <div className="data-table user-table invite__candidate--table">
                  <div className="table-wrap">
                    <div className="table table-modal">
                      {invitedCandidates && invitedCandidates.length > 0 ? (
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
                          {invitedCandidates.map(function (candidate) {
                            return (
                              <div className="table__row" key={candidate.email}>
                                <div className="table-cell">
                                  {candidate.name}
                                </div>
                                <div className="table-cell">
                                  <span className="text-break">
                                    {candidate.email}
                                  </span>
                                </div>
                                <div
                                  className="table-cell"
                                  style={{ width: 100 }}
                                >
                                  <div className="d-flex justify-content-end">
                                    <a
                                      className="control-button control-button--warning resend-invitation"
                                      href="#"
                                      onClick={function () {
                                        handleInvitationClick(
                                          candidate.email,
                                          'invited',
                                          candidate.id,
                                          selectedJob.value,
                                        );
                                      }}
                                    >
                                      <div className="control-button__icon">
                                        <i className="easyjobs-icon easyjobs-send" />
                                      </div>
                                    </a>
                                    <a
                                      className="control-button control-button--danger ej-delete-pending-invitation"
                                      href="#"
                                      onClick={function () {
                                        handleInviteCandidateDelete(
                                          candidate.email,
                                        );
                                      }}
                                    >
                                      <div className="control-button__icon">
                                        <i className="easyjobs-icon easyjobs-delete" />
                                      </div>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <h6 className="empty-message m-0 pl-0 py-3">
                          No invitation found.
                        </h6>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Candidates;
