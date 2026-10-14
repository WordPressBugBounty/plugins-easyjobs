import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { connect } from 'react-redux';
import LinkTag from '../../../util/Link';
import Jobs from './Jobs';
import {
  duplicateJob,
  deleteJob,
  getJobs,
  resetDuplicateJob,
  changeStatus,
  pinUnpinnedJob,
} from '../../../redux/actions/jobActions';
import { getMinimalInfo } from '../../../redux/actions/companyActions';
const mapStateToProps = (state) => {
  return {
    companyInfo: state.settings.companyInfo,
    publishedJobs: state.job.publishedJobs,
    archivedJobs: state.job.archivedJobs,
    draftJobs: state.job.draftJobs,
    allJobs: state.job.allJobs,
    internalJobs: state.job.internalJobs,
    loading: state.job.loading,
    duplicated: state.job.duplicated,
    jobDeleteLoading: state.job.jobDeleteLoading,
    jobDeleted: state.job.jobDeleted,
    statusChanged: state.job.statusChanged,
    pinUnpinJobData: state.job.pinUnpinJobData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCompanyInfo: () => dispatch(getMinimalInfo()),
    getJobs: (jobType, params) => dispatch(getJobs(jobType, params)),
    duplicateJob: (jobId) => dispatch(duplicateJob(jobId)),
    deleteJob: (params) => dispatch(deleteJob(params)),
    pinUnpinnedJob: (params) => dispatch(pinUnpinnedJob(params)),
    resetDuplicateJob: () => dispatch(resetDuplicateJob()),
    changeStatus: (jobId, status) => dispatch(changeStatus(jobId, status)),
  };
};

const STORAGE_KEY = 'jobs_view_mode';
const DEFAULT_LAYOUT = 'grid';

const AllJobs = ({
  companyInfo,
  getCompanyInfo,
  loading,
  getJobs,
  publishedJobs,
  draftJobs,
  archivedJobs,
  allJobs,
  internalJobs,
  duplicateJob,
  deleteJob,
  jobDeleteLoading,
  duplicated,
  resetDuplicateJob,
  match,
  jobDeleted,
  statusChanged,
  changeStatus,
  pinUnpinnedJob,
  pinUnpinJobData,
}) => {
  const tabs = [
    {
      label: __('All Jobs', 'easyjobs'),
      id: 'all-jobs',
    },
    {
      label: __('Internal Jobs', 'easyjobs'),
      id: 'internal-jobs',
    },
    {
      label: __('Published Jobs', 'easyjobs'),
      id: 'published-jobs',
    },
    {
      label: __('Draft jobs', 'easyjobs'),
      id: 'draft-jobs',
    },
    {
      label: __('Archived jobs', 'easyjobs'),
      id: 'archived-jobs',
    },
  ];

  const [selectedTab, setSelectedTab] = useState('');
  const [filter, setFilter] = useState(['active', 'expired']);
  const [jobId, setJobId] = useState(0);
  const [jobSearchText, setJobSearchText] = useState('');
  const [timeoutId, setTimeoutId] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobDeleteModalShowHide, setJobDeleteModalShowHide] = useState({
    display: 'none',
  });
  const [makeJobExpireShowHide, setMakeJobExpireShowHide] = useState({
    display: 'none',
  });
  const [jobExpireExtendShowHide, setJobExpireExtendShowHide] = useState({
    display: 'none',
  });
  const [layout, setLayout] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved === 'list' || saved === 'grid' ? saved : DEFAULT_LAYOUT;
  });

  // Persist layout to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, layout);
  }, [layout]);

  useEffect(() => {
    if (!timeoutId) {
      setTimeoutId(true);
      return () => {};
    }

    clearTimeout(timeoutId);
    const Id = setTimeout(() => {
      setSearchText(jobSearchText);
    }, 500);
    setTimeoutId(Id);
  }, [jobSearchText]);

  useEffect(() => {
    // Only fetch when missing; companyInfo is already loaded by the header on
    // app mount and doesn't change between in-session navigations. Refetching
    // here nulls it out in the reducer and makes the header workspace flicker.
    if (!companyInfo) getCompanyInfo();
    document.title = `Easyjobs - Jobs ‹ ${easyJobsJs.title} — Wordpress`;
    if (match && match.params && match.params.tab) {
      const filtered = tabs.filter((t) => t.id === match.params.tab);
      filtered && filtered.length
        ? setSelectedTab(filtered[0])
        : setSelectedTab(tabs[0]);
    } else {
      setSelectedTab(tabs[0]);
    }
  }, []);

  const changeTab = (e, tab) => {
    e.preventDefault();
    setSelectedTab(tab);
    setCurrentPage(1);
    setFilter(['active', 'expired']);
  };

  const filterChange = (e) => {
    if (e.target.checked) {
      if (!filter.includes(e.target.value)) {
        setFilter([...filter, e.target.value]);
      }
    } else {
      setFilter(filter.filter((item) => item !== e.target.value));
    }
  };

  const handleCancleJobDelete = (e) => {
    e.preventDefault();
    setJobDeleteModalShowHide({ display: 'none' });
  };

  const handleInitJobDelete = (e, jobId) => {
    e.preventDefault();
    setJobDeleteModalShowHide({ display: 'block' });
    setJobId(jobId);
  };

  const handleRemoveJob = (e, jobId) => {
    e.preventDefault();
    setJobDeleteModalShowHide({ display: 'none' });
    deleteJob({ job_id: jobId });
  };

  const handleCancleMakeExpire = (e) => {
    e.preventDefault();
    setMakeJobExpireShowHide({ display: 'none' });
  };

  const handleInitJobExpire = (e, jobId) => {
    e.preventDefault();
    setMakeJobExpireShowHide({ display: 'block' });
    setJobId(jobId);
  };

  const handleExpireJob = (e, jobId) => {
    e.preventDefault();
    setMakeJobExpireShowHide({ display: 'none' });
    changeStatus(jobId, {
      status: 2,
      change_expire_date: true,
      expire_date_status: 2,
    });
  };

  const handleCancleExtendExpire = (e) => {
    e.preventDefault();
    setJobExpireExtendShowHide({ display: 'none' });
  };

  const handleInitExtendExpire = (e, jobId) => {
    e.preventDefault();
    setJobExpireExtendShowHide({ display: 'block' });
    setJobId(jobId);
  };

  const handleExtendJob = (e, jobId) => {
    e.preventDefault();
    setJobExpireExtendShowHide({ display: 'none' });
    changeStatus(jobId, {
      status: 2,
      change_expire_date: true,
      expire_date_status: 1,
    });
  };

  const handleJobSearch = (e) => {
    setJobSearchText(e.target.value);
  };

  return (
    <>
      <section
        className={`published-jobs section-gap ${
          jobDeleteLoading ? 'ej-loading' : ''
        }`}
      >
        <div className="form-filter align-items-center">
          <div className="dropdown pipeline-action ej-job-type-select">
            <button
              className="button white-button dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {selectedTab ? selectedTab.label : tabs[0].label}
            </button>
            <ul
              className="dropdown-menu dropdown-menu-left nav-tab"
              role="tablist"
            >
              {tabs.map((tab, i) => (
                <a
                  className="dropdown-item"
                  href="#"
                  key={i}
                  onClick={(e) => changeTab(e, tab)}
                >
                  {tab.label}
                </a>
              ))}
            </ul>
          </div>
          <div className="search-bar">
            <input
              type="text"
              className="easyjobs-job-search"
              placeholder="Search Job Name . . ."
              value={jobSearchText}
              onChange={handleJobSearch}
            />
          </div>
          {selectedTab && selectedTab.id === 'published-jobs' ? (
            <div className="ej-active-filter show-filter">
              <label className="checkbox">
                <input
                  type="checkbox"
                  value="active"
                  name="ej-active-jobs"
                  checked={filter.includes('active')}
                  onChange={filterChange}
                />
                <span>{__('Active', 'easyjobs')}</span>
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  value="expired"
                  name="ej-expired-jobs"
                  checked={filter.includes('expired')}
                  onChange={filterChange}
                />
                <span>{__('Expired', 'easyjobs')}</span>
              </label>
            </div>
          ) : (
            ''
          )}

          <LinkTag
            to={'easyjobs-create'}
            className="button primary-button text-uppercase ml-auto"
          >
            {__('Create A new Job', 'easyjobs')}
          </LinkTag>
        </div>
        <div className={loading ? 'ej-loading' : ''} id="published-jobs">
          <div className="section-title-wrap all-jobs">
            <h2 className="section-title">{selectedTab.label}</h2>
            <div class="view-toggle-wrapper">
              <button
                class={`btn btn-grid ${layout === 'grid' ? 'active' : ''}`}
                onClick={() => setLayout('grid')}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.86338 0H1.36584C0.612719 0 0 0.612719 0 1.36584V5.86338C0 6.6165 0.612719 7.22922 1.36584 7.22922H5.86338C6.6165 7.22922 7.22922 6.6165 7.22922 5.86338V1.36584C7.22922 0.612719 6.6165 0 5.86338 0Z"
                    fill="#597DFC"
                  />
                  <path
                    d="M14.6349 0H10.1373C9.3842 0 8.77148 0.612719 8.77148 1.36584V5.86338C8.77148 6.6165 9.3842 7.22922 10.1373 7.22922H14.6349C15.388 7.22922 16.0007 6.6165 16.0007 5.86338V1.36584C16.0007 0.612719 15.388 0 14.6349 0Z"
                    fill="#597DFC"
                  />
                  <path
                    d="M5.86338 8.76953H1.36584C0.612719 8.76953 0 9.38225 0 10.1354V14.6329C0 15.386 0.612719 15.9987 1.36584 15.9987H5.86338C6.6165 15.9987 7.22922 15.386 7.22922 14.6329V10.1354C7.22922 9.38225 6.6165 8.76953 5.86338 8.76953Z"
                    fill="#597DFC"
                  />
                  <path
                    d="M14.6349 8.76953H10.1373C9.3842 8.76953 8.77148 9.38225 8.77148 10.1354V14.6329C8.77148 15.386 9.3842 15.9987 10.1373 15.9987H14.6349C15.388 15.9987 16.0007 15.386 16.0007 14.6329V10.1354C16.0007 9.38225 15.388 8.76953 14.6349 8.76953Z"
                    fill="#597DFC"
                  />
                </svg>
              </button>
              <button
                class={`btn btn-list ${layout === 'list' ? 'active' : ''}`}
                onClick={() => setLayout('list')}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_7794_16886)">
                    <path
                      d="M16.8761 2.8125H4.50546C3.88437 2.8125 3.38086 3.31601 3.38086 3.9371C3.38086 4.5582 3.88437 5.06171 4.50546 5.06171H16.8761C17.4972 5.06171 18.0007 4.5582 18.0007 3.9371C18.0007 3.31601 17.4972 2.8125 16.8761 2.8125Z"
                      fill="#98A2B3"
                    />
                    <path
                      d="M2.25551 3.93628C2.25424 3.6385 2.13493 3.35338 1.92375 3.14343C1.48512 2.7074 0.776689 2.7074 0.338058 3.14343C0.126843 3.35338 0.00752958 3.6385 0.00629954 3.93628C-0.00209985 4.00913 -0.00209985 4.08272 0.00629954 4.15557C0.0190216 4.22885 0.0397565 4.30051 0.0681528 4.36925C0.0983414 4.43585 0.134083 4.49981 0.17499 4.56043C0.215371 4.62348 0.262499 4.68192 0.315566 4.73474C0.366735 4.7857 0.423282 4.83097 0.484257 4.8697C0.543474 4.91282 0.607682 4.9487 0.675439 4.97653C0.74998 5.01519 0.82944 5.04359 0.911606 5.06088C0.98446 5.06903 1.05805 5.06903 1.1309 5.06088C1.42787 5.06113 1.71289 4.94389 1.92375 4.73474C1.97682 4.68192 2.02395 4.62348 2.06433 4.56043C2.10523 4.49981 2.14097 4.43585 2.17116 4.36925C2.20705 4.30135 2.23534 4.22969 2.25551 4.15557C2.26391 4.08272 2.26391 4.00913 2.25551 3.93628Z"
                      fill="#98A2B3"
                    />
                    <path
                      d="M2.25702 8.99878C2.26539 8.92592 2.26539 8.85233 2.25702 8.77948C2.23759 8.7069 2.20926 8.63704 2.17268 8.57143C2.14372 8.50244 2.10791 8.43651 2.06584 8.37462C2.02686 8.31227 1.97956 8.25552 1.92526 8.20593C1.48663 7.7699 0.778202 7.7699 0.339571 8.20593C0.128356 8.41588 0.00904254 8.701 0.0078125 8.99878C0.00999142 9.14698 0.0385634 9.29356 0.0921578 9.43175C0.120343 9.49828 0.154222 9.56224 0.193372 9.62293C0.236142 9.68405 0.285133 9.74059 0.339571 9.79162C0.389264 9.84581 0.445987 9.89312 0.508262 9.9322C0.567479 9.97535 0.631652 10.0112 0.699444 10.039C0.76801 10.0679 0.839739 10.0887 0.913119 10.1009C0.985059 10.117 1.05869 10.1246 1.13242 10.1234C1.20527 10.1318 1.27886 10.1318 1.35172 10.1234C1.42327 10.1111 1.49313 10.0903 1.55977 10.0615C1.62939 10.0339 1.69546 9.99802 1.75657 9.95469C1.81885 9.91561 1.87557 9.86831 1.92526 9.81411C1.97946 9.76442 2.02676 9.7077 2.06584 9.64542C2.10907 9.58624 2.14495 9.52207 2.17268 9.45424C2.21109 9.37959 2.23945 9.30017 2.25702 9.21807C2.26567 9.14522 2.26567 9.07163 2.25702 8.99878Z"
                      fill="#98A2B3"
                    />
                    <path
                      d="M2.25709 14.0574C2.26542 13.9845 2.26542 13.9109 2.25709 13.8381C2.23766 13.7637 2.20933 13.692 2.17275 13.6244C2.14256 13.5578 2.10682 13.4938 2.06591 13.4332C2.02683 13.3709 1.97952 13.3142 1.92533 13.2645C1.4867 12.8285 0.778271 12.8285 0.33964 13.2645C0.285448 13.3142 0.238144 13.3709 0.199064 13.4332C0.158157 13.4938 0.122415 13.5578 0.0922268 13.6244C0.0630574 13.6929 0.0422873 13.7646 0.0303735 13.8381C0.0145236 13.9101 0.00700284 13.9836 0.00788144 14.0574C0.00914662 14.3551 0.12846 14.6403 0.33964 14.8502C0.389333 14.9044 0.446056 14.9517 0.508331 14.9908C0.567548 15.0339 0.631721 15.0698 0.699513 15.0976C0.768079 15.1265 0.839808 15.1473 0.913188 15.1595C0.985128 15.1756 1.05875 15.1832 1.13249 15.182C1.20534 15.1904 1.27893 15.1904 1.35178 15.182C1.42334 15.1697 1.4932 15.1489 1.55984 15.1201C1.62946 15.0925 1.69553 15.0566 1.75664 15.0133C1.81892 14.9742 1.87564 14.9269 1.92533 14.8727C1.97952 14.823 2.02683 14.7663 2.06591 14.704C2.10917 14.6449 2.14505 14.5807 2.17275 14.5128C2.21112 14.4382 2.23948 14.3588 2.25709 14.2767C2.26574 14.2038 2.26574 14.1302 2.25709 14.0574Z"
                      fill="#98A2B3"
                    />
                    <path
                      d="M16.8742 7.87109H4.50351C3.88241 7.87109 3.37891 8.3746 3.37891 8.9957C3.37891 9.6168 3.88241 10.1203 4.50351 10.1203H16.8742C17.4953 10.1203 17.9988 9.6168 17.9988 8.9957C17.9988 8.3746 17.4953 7.87109 16.8742 7.87109Z"
                      fill="#98A2B3"
                    />
                    <path
                      d="M16.8761 12.9336H4.50546C3.88437 12.9336 3.38086 13.4371 3.38086 14.0582C3.38086 14.6793 3.88437 15.1828 4.50546 15.1828H16.8761C17.4972 15.1828 18.0007 14.6793 18.0007 14.0582C18.0007 13.4371 17.4972 12.9336 16.8761 12.9336Z"
                      fill="#98A2B3"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_7794_16886">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>
          <Jobs
            publishedJobs={publishedJobs}
            draftJobs={draftJobs}
            archivedJobs={archivedJobs}
            allJobs={allJobs}
            internalJobs={internalJobs}
            getJobs={getJobs}
            loading={loading}
            currentTab={selectedTab}
            filters={filter}
            duplicateJob={duplicateJob}
            deleteJob={deleteJob}
            duplicated={duplicated}
            resetDuplicateJob={resetDuplicateJob}
            handleInitJobDelete={handleInitJobDelete}
            handleInitJobExpire={handleInitJobExpire}
            handleInitExtendExpire={handleInitExtendExpire}
            searchText={searchText}
            jobDeleted={jobDeleted}
            statusChanged={statusChanged}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pinUnpinnedJob={pinUnpinnedJob}
            pinUnpinJobData={pinUnpinJobData}
            companyInfo={companyInfo}
            layout={layout}
          />
        </div>
      </section>
      <div
        className="dg-wrapper ej-candidate-confirmation"
        id="ej-candidate-confirmation"
        style={jobDeleteModalShowHide}
      >
        <div className="dg-backdrop"></div>
        <div className="dg-container">
          <div className="dg-content-cont dg-content-cont--floating">
            <div className="dg-main-content">
              <div className="dg-view-wrapper">
                <div className="dg-content-body dg-content-body--has-title">
                  <h6 className="dg-title">Confirmation</h6>
                  <div className="dg-content">
                    Are you sure, you want to remove this job?
                  </div>
                </div>
                <div className="dg-content-footer">
                  <button
                    className="dg-btn dg-btn--cancel remove-rating-cancel"
                    onClick={handleCancleJobDelete}
                  >
                    <span>No</span>
                  </button>
                  <button className="dg-btn dg-btn--ok dg-pull-right ej-candidate-action-confirm">
                    <span
                      className="dg-btn-content"
                      onClick={(e) => handleRemoveJob(e, jobId)}
                    >
                      Yes
                    </span>
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
        style={makeJobExpireShowHide}
      >
        <div className="dg-backdrop"></div>
        <div className="dg-container">
          <div className="dg-content-cont dg-content-cont--floating">
            <div className="dg-main-content">
              <div className="dg-view-wrapper">
                <div className="dg-content-body dg-content-body--has-title">
                  <h6 className="dg-title">Confirmation</h6>
                  <div className="dg-content">
                    Are you sure, you want to expire the job?
                  </div>
                </div>
                <div className="dg-content-footer">
                  <button
                    className="dg-btn dg-btn--cancel remove-rating-cancel"
                    onClick={handleCancleMakeExpire}
                  >
                    <span>No</span>
                  </button>
                  <button className="dg-btn dg-btn--ok dg-pull-right ej-candidate-action-confirm">
                    <span
                      className="dg-btn-content"
                      onClick={(e) => handleExpireJob(e, jobId)}
                    >
                      Yes
                    </span>
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
        style={jobExpireExtendShowHide}
      >
        <div className="dg-backdrop"></div>
        <div className="dg-container">
          <div className="dg-content-cont dg-content-cont--floating">
            <div className="dg-main-content">
              <div className="dg-view-wrapper">
                <div className="dg-content-body dg-content-body--has-title">
                  <h6 className="dg-title">Confirmation</h6>
                  <div className="dg-content">
                    Are you sure, you want to re-publish and set expire date to
                    30 days ahead from now?
                  </div>
                </div>
                <div className="dg-content-footer">
                  <button
                    className="dg-btn dg-btn--cancel remove-rating-cancel"
                    onClick={handleCancleExtendExpire}
                  >
                    <span>No</span>
                  </button>
                  <button className="dg-btn dg-btn--ok dg-pull-right ej-candidate-action-confirm">
                    <span
                      className="dg-btn-content"
                      onClick={(e) => handleExtendJob(e, jobId)}
                    >
                      Yes
                    </span>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllJobs);
