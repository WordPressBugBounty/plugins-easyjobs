import { __ } from '@wordpress/i18n';
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getCandidateDetails,
  changePipeline,
  setCandidatesRating,
  removeCandidate,
  removeNote,
  addNoteAndManagers,
  getCandidatesId,
  resetCandidatesId,
} from '../../../redux/actions/candidateActions';
import LinkTag from '../../../util/Link';

import { streamFile } from '../../../util/streamFile';
import { Icon, IconSprite } from './icons';
import HeaderCard from './HeaderCard';
import CandidateSkeleton from './CandidateSkeleton';
import AssignAssessmentModal from './AssignAssessmentModal';
import DetailsCard from './DetailsCard';
import SalaryCard from './SalaryCard';
import MorePositionsCard from './MorePositionsCard';
import NotesCard from './NotesCard';
import Application from './Tabs/Application';
import Resume from './Tabs/Resume';
import Evaluation from './Tabs/Evaluation';
import Conversation from './Tabs/Conversation';
import Attachment from './Tabs/Attachment';

const FILTER_STORAGE_KEY = 'easyjobs_candidate_filters';

const mapStateToProps = (state) => ({
  candidateDetails: state.candidate.candidateDetails,
  pipelineLoading: state.candidate.pipelineLoading,
  ratingLoading: state.candidate.ratingLoading,
  removeLoading: state.candidate.removeLoading,
  noteLoading: state.candidate.noteLoading,
  addNoteLoading: state.candidate.addNoteLoading,
  loading: state.candidate.loading,
  candidatesId: state.candidate.candidatesId,
});

const mapDispatchToProps = (dispatch) => ({
  getCandidateDetails: (p) => dispatch(getCandidateDetails(p)),
  changePipeline: (p) => dispatch(changePipeline(p)),
  setCandidatesRating: (p) => dispatch(setCandidatesRating(p)),
  removeCandidate: (p) => dispatch(removeCandidate(p)),
  removeNote: (p) => dispatch(removeNote(p)),
  addNoteAndManagers: (p) => dispatch(addNoteAndManagers(p)),
  getCandidatesId: (id) => dispatch(getCandidatesId(id)),
  reset: () => dispatch(resetCandidatesId()),
});

const Details = ({
  match,
  candidateDetails,
  loading,
  pipelineLoading,
  ratingLoading,
  removeLoading,
  noteLoading,
  addNoteLoading,
  candidatesId,
  getCandidateDetails,
  changePipeline,
  setCandidatesRating,
  removeCandidate,
  removeNote,
  addNoteAndManagers,
  getCandidatesId,
  reset,
}) => {
  const history = useHistory();

  const [candidateId, setCandidateId] = useState();
  const [tab, setTab] = useState('application');
  const [currentId, setCurrentId] = useState();
  const [total, setTotal] = useState(0);
  const [currentJobId, setCurrentJobId] = useState(undefined);

  const [removeModal, setRemoveModal] = useState({ display: 'none' });
  const [noteModal, setNoteModal] = useState({ display: 'none' });
  const [noteId, setNoteId] = useState(0);
  const [assignOpen, setAssignOpen] = useState(false);

  // ── Pager slide transition (mirrors the app's "slide-fade" mode="out-in") ──
  // The app awaits the new candidate's data first, keeping the OLD one fully on
  // screen, then runs the transition: old slides out + fades, then new slides in.
  const [displayed, setDisplayed] = useState(undefined); // candidate object on screen
  const [pagerNav, setPagerNav] = useState(false); // suppresses the loading state
  const [anim, setAnim] = useState('idle'); // 'idle' | 'leave' | 'enter'
  const nextDataRef = useRef(null); // new data waiting behind the slide-out

  useEffect(() => {
    if (!candidateDetails || candidateDetails === 'unable') return;
    if (!pagerNav) {
      // Initial load / non-pager refresh — swap in place, no transition.
      setDisplayed(candidateDetails);
      return;
    }
    // Pager: the new data has arrived. Keep the OLD candidate on screen and
    // start sliding it out — the new one swaps in once the leave completes.
    nextDataRef.current = candidateDetails;
    setAnim('leave');
  }, [candidateDetails]);

  const onSlideEnd = (e) => {
    if (e.target !== e.currentTarget) return; // ignore bubbled child animations
    if (anim === 'leave') {
      if (nextDataRef.current) {
        setDisplayed(nextDataRef.current);
        nextDataRef.current = null;
      }
      setAnim('enter');
    } else if (anim === 'enter') {
      setAnim('idle');
      setPagerNav(false);
    }
  };

  const getStoredFilters = () => {
    try {
      return localStorage.getItem(FILTER_STORAGE_KEY) || '';
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    if (candidateId) {
      history.push(
        history.location.pathname +
          `?page=easyjobs-candidates&id=${candidateId}&tab=${tab}`,
      );
    }
  }, [candidateId, tab]);

  useEffect(() => () => reset(), []);

  // Fetch ONLY when the candidate id changes (initial load + prev/next nav).
  // Depending on the whole `match` object would re-fetch on every URL change —
  // including tab switches — making the entire page reload. The app only swaps
  // the active tab's content, so we mirror that here.
  useEffect(() => {
    const id = match?.params?.id;
    if (id) {
      getCandidateDetails({ id });
      setCandidateId(id);
      // Seed the tab from the URL once per candidate (deep-link support).
      if (match.params.tab) setTab(match.params.tab);
    }
  }, [match?.params?.id]);

  useEffect(() => {
    if (candidateDetails && candidateDetails !== 'unable') {
      const jobId = candidateDetails?.candidate?.job_id;
      if (jobId !== currentJobId) {
        setCurrentJobId(jobId);
        getCandidatesId(jobId);
      }
    }
    if (candidateDetails === 'unable') {
      history.push(history.location.pathname + `?page=easyjobs-candidates`);
    }
  }, [candidateDetails]);

  useEffect(() => {
    if (candidatesId?.length) {
      const index = candidatesId.indexOf(parseInt(candidateId));
      setTotal(candidatesId.length);
      setCurrentId(index + 1);
    }
  }, [candidatesId]);

  useEffect(() => {
    if (candidatesId?.length && currentId)
      setCandidateId(candidatesId[currentId - 1]);
  }, [currentId]);

  // Pager navigation always lands on the Application tab (mirrors the app) and
  // keeps the current candidate fully on screen while the next one loads — the
  // slide-out/slide-in only runs once the new data arrives.
  const startPagerNav = (delta) => {
    setTab('application');
    setPagerNav(true);
    nextDataRef.current = null;
    setCurrentId((id) => id + delta);
  };
  const prev = () => startPagerNav(-1);
  const next = () => startPagerNav(1);

  const onPipelineChange = (stageId) =>
    changePipeline({
      pipeline_id: stageId,
      applicants_id: [candidateDetails?.candidate?.id],
      job_id: candidateDetails?.candidate?.job_id,
    });

  const onRate = (rate) =>
    setCandidatesRating({
      job_id: candidateDetails?.candidate?.job_id,
      id: candidateDetails?.candidate?.id,
      type: 'rate_candidate',
      data: { rating: rate },
    });

  const onRemoveInit = (e) => {
    e.preventDefault();
    setRemoveModal({ display: 'flex' });
  };
  const onRemoveConfirm = () => {
    setRemoveModal({ display: 'none' });
    removeCandidate({
      job: candidateDetails?.candidate?.job_id,
      candidates: [candidateDetails?.candidate?.id],
    });
    setTimeout(
      () => history.push('/wp-admin/admin.php?page=easyjobs-candidates'),
      1300,
    );
  };

  const onRemoveNoteInit = (e, id) => {
    e.preventDefault();
    setNoteId(id);
    setNoteModal({ display: 'flex' });
  };
  const onRemoveNoteConfirm = () => {
    setNoteModal({ display: 'none' });
    removeNote({
      note_id: noteId,
      candidate_id: candidateDetails?.candidate?.id,
    });
  };

  const onDownloadResume = () => {
    const id = candidateDetails?.candidate?.id;
    const url = candidateDetails?.candidate?.user?.resume_url;
    if (!url) {
      toast.info(__('No resume to download.', 'easyjobs'), { autoClose: 1200 });
      return;
    }
    const fileName =
      decodeURIComponent(url.split('/').pop().split('?')[0]) || 'resume.pdf';
    if (id) {
      // Stream through our same-origin proxy with Content-Disposition: attachment
      // so it truly downloads (hiding the nonce), mirroring the Resume tab.
      streamFile(
        'easyjobs_stream_resume',
        { id, download: 1 },
        { download: true, filename: fileName },
      );
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Always render the `displayed` candidate (managed by the slide controller),
  // so the page never flashes a loading state mid-transition.
  const view = displayed && displayed !== 'unable' ? displayed : null;
  const ready = !!view;

  const renderPanel = () => {
    switch (tab) {
      case 'resume':
        return <Resume candidateDetails={view} />;
      case 'evaluation':
        return <Evaluation candidateDetails={view} />;
      case 'conversation':
        return <Conversation candidateDetails={view} />;
      case 'attachment':
        return <Attachment candidateDetails={view} />;
      case 'application':
      default:
        return <Application candidateDetails={view} />;
    }
  };

  return (
    <div
      data-testid="ej-candidate-details"
      className={`ejc-app ${
        (loading && !pagerNav) ||
        ratingLoading ||
        removeLoading ||
        pipelineLoading
          ? 'ej-loading'
          : ''
      }`}
    >
      <IconSprite />
      <div className="ejc-content">
        {/* top bar */}
        <div className="top-bar">
          <div className="back-link">
            <LinkTag
              to={`easyjobs-candidates${getStoredFilters()}`}
              className="back-link__icon"
              aria-label={__('Back', 'easyjobs')}
            >
              <i className="easyjobs-icon easyjobs-back"></i>
            </LinkTag>
            <span className="back-link__text">{__('Back', 'easyjobs')}</span>
          </div>
          <div className="pager">
            <button
              className="pg-btn"
              disabled={currentId === 1}
              onClick={prev}
              aria-label="Previous"
            >
              <Icon name="chev-l" />
            </button>
            <span className="pos">
              <b>{currentId || 0}</b>
              <span className="pos__total">/{total}</span>
            </span>
            <button
              className="pg-btn"
              disabled={currentId === candidatesId?.length}
              onClick={next}
              aria-label="Next"
            >
              <Icon name="chev-r" />
            </button>
          </div>
        </div>

        {ready ? (
          <div
            className={`ejc-layout ${
              anim === 'leave'
                ? 'ejc-leave'
                : anim === 'enter'
                ? 'ejc-enter'
                : ''
            }`}
            onAnimationEnd={onSlideEnd}
          >
            <div className="ejc-col-left">
              <HeaderCard
                candidateDetails={view}
                activeTab={tab}
                onChangeTab={setTab}
                onPipelineChange={onPipelineChange}
                onRate={onRate}
                onRemove={onRemoveInit}
                onDownloadResume={onDownloadResume}
                onAssignAssessment={() => setAssignOpen(true)}
              />
              {renderPanel()}
            </div>

            <aside className="ejc-col-right">
              <DetailsCard candidateDetails={view} />
              <SalaryCard candidateDetails={view} />
              <MorePositionsCard candidateDetails={view} />
              <NotesCard
                candidateDetails={view}
                ejCandidateId={view?.candidate?.id}
                addNoteAndManagers={addNoteAndManagers}
                addNoteLoading={addNoteLoading}
                noteLoading={noteLoading}
                onRemoveNote={onRemoveNoteInit}
              />
            </aside>
          </div>
        ) : (
          <CandidateSkeleton />
        )}
      </div>

      {/* Confirmation modals (use the plugin's global dialog styles) */}
      <div className="dg-wrapper ej-candidate-confirmation" style={removeModal}>
        <div className="dg-backdrop"></div>
        <div className="dg-container">
          <div className="dg-content-cont dg-content-cont--floating">
            <div className="dg-main-content">
              <div className="dg-view-wrapper">
                <div className="dg-content-body dg-content-body--has-title">
                  <h6 className="dg-title">{__('Confirmation', 'easyjobs')}</h6>
                  <div className="dg-content">
                    {__(
                      'Are you sure you want to remove this candidate?',
                      'easyjobs',
                    )}
                  </div>
                </div>
                <div className="dg-content-footer">
                  <button
                    className="dg-btn dg-btn--cancel"
                    onClick={() => setRemoveModal({ display: 'none' })}
                  >
                    <span>{__('No', 'easyjobs')}</span>
                  </button>
                  <button
                    className="dg-btn dg-btn--ok dg-pull-right"
                    onClick={onRemoveConfirm}
                  >
                    <span className="dg-btn-content">
                      {__('Yes', 'easyjobs')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dg-wrapper ej-candidate-confirmation" style={noteModal}>
        <div className="dg-backdrop"></div>
        <div className="dg-container">
          <div className="dg-content-cont dg-content-cont--floating">
            <div className="dg-main-content">
              <div className="dg-view-wrapper">
                <div className="dg-content-body dg-content-body--has-title">
                  <h6 className="dg-title">{__('Confirmation', 'easyjobs')}</h6>
                  <div className="dg-content">
                    {__(
                      'Are you sure you want to remove this note?',
                      'easyjobs',
                    )}
                  </div>
                </div>
                <div className="dg-content-footer">
                  <button
                    className="dg-btn dg-btn--cancel"
                    onClick={() => setNoteModal({ display: 'none' })}
                  >
                    <span>{__('No', 'easyjobs')}</span>
                  </button>
                  <button
                    className="dg-btn dg-btn--ok dg-pull-right"
                    onClick={onRemoveNoteConfirm}
                  >
                    <span className="dg-btn-content">
                      {__('Yes', 'easyjobs')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {assignOpen && view ? (
        <AssignAssessmentModal
          candidateId={view?.candidate?.id}
          candidateGid={view?.candidate?.generated_id}
          jobId={view?.candidate?.job_id}
          onClose={() => setAssignOpen(false)}
          onDone={() => {
            setAssignOpen(false);
            if (view?.candidate?.id)
              getCandidateDetails({ id: view.candidate.id });
          }}
        />
      ) : null}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
