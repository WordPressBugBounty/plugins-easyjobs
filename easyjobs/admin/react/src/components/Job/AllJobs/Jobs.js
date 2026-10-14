import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import Status from './Status';
import Controls from './Controls';
import ShareModal from './ShareModal';
import Pager from '../../../util/Pager';
import LinkTag from '../../../util/Link';
import { useHistory } from 'react-router-dom';

const Jobs = ({
  loading,
  getJobs,
  publishedJobs,
  archivedJobs,
  draftJobs,
  allJobs,
  internalJobs,
  currentTab,
  filters,
  duplicateJob,
  duplicated,
  resetDuplicateJob,
  deleteJob,
  handleInitJobDelete,
  handleInitJobExpire,
  handleInitExtendExpire,
  searchText,
  jobDeleted,
  statusChanged,
  currentPage,
  setCurrentPage,
  pinUnpinnedJob,
  pinUnpinJobData,
  companyInfo,
  layout,
}) => {
  const history = useHistory();
  const [jobs, setJobs] = useState(allJobs);
  const [shareModalJob, setShareModalJob] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    if (allJobs && currentTab.id === 'all-jobs') {
      setJobs(allJobs);
    }
    if (internalJobs && currentTab.id === 'internal-jobs') {
      setJobs(internalJobs);
    }
    if (publishedJobs && currentTab.id === 'published-jobs') {
      setJobs(publishedJobs);
    }
    if (archivedJobs && currentTab.id === 'archived-jobs') {
      setJobs(archivedJobs);
    }
    if (draftJobs && currentTab.id === 'draft-jobs') {
      setJobs(draftJobs);
    }
  }, [publishedJobs, archivedJobs, draftJobs, allJobs, internalJobs]);

  useEffect(() => {
    if (currentTab) {
      switch (currentTab.id) {
        case 'draft-jobs':
          if (!draftJobs || !draftJobs.length) {
            getJobs('draft', { search: searchText });
          } else {
            setJobs(draftJobs);
          }
          break;
        case 'all-jobs':
          if (!allJobs || !allJobs.length) {
            getJobs('all', { rows: 10, search: searchText });
          } else {
            setJobs(allJobs);
          }
          break;
        case 'archived-jobs':
          if (!archivedJobs || !archivedJobs.length) {
            getJobs('archived', { rows: 10, search: searchText });
          } else {
            setJobs(archivedJobs);
          }
          break;
        case 'internal-jobs':
          if (!internalJobs || !internalJobs.length) {
            getJobs('internal', { rows: 10, search: searchText });
          } else {
            setJobs(internalJobs);
          }
          break;
        default:
          if (!publishedJobs || !publishedJobs.length) {
            getJobs('published', { rows: 10, search: searchText });
          } else {
            setJobs(publishedJobs);
          }
      }
    }
  }, [currentTab, searchText]);

  useEffect(() => {
    if (currentTab.id === 'published-jobs') {
      if (filters.includes('active') && filters.includes('expired')) {
        getJobs('published', { page: 1 });
      } else {
        if (!filters.length) {
          setJobs([]);
        }
        if (filters.includes('active')) {
          getJobs('published', { page: 1, status: 'active' });
        }
        if (filters.includes('expired')) {
          getJobs('published', { page: 1, status: 'expired' });
        }
      }
    }
  }, [filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (currentTab) {
      switch (currentTab.id) {
        case 'draft-jobs':
          getJobs('draft', { page, search: searchText });
          break;
        case 'all-jobs':
          getJobs('all', { page, search: searchText, rows: 10 });
          break;
        case 'internal-jobs':
          getJobs('internal', { page, search: searchText, rows: 10 });
          break;
        case 'archived-jobs':
          getJobs('archived', { page, search: searchText, rows: 10 });
          break;
        default:
          if (filters.includes('active') && filters.includes('expired')) {
            getJobs('published', { search: '', page, rows: 10 });
          } else {
            if (!filters.length) {
              setJobs([]);
            }
            if (filters.includes('active')) {
              getJobs('published', {
                search: '',
                page,
                status: 'active',
                rows: 10,
              });
            }
            if (filters.includes('expired')) {
              getJobs('published', {
                search: '',
                page,
                status: 'expired',
                rows: 10,
              });
            }
          }
      }
    }
  };

  useEffect(() => {
    if (currentTab && (jobDeleted || statusChanged)) {
      switch (currentTab.id) {
        case 'draft-jobs':
          if (!draftJobs || !draftJobs.length) {
            getJobs('draft', { page: currentPage, search: searchText });
          } else {
            setJobs(draftJobs);
          }
          break;
        case 'all-jobs':
          if (!allJobs || !allJobs.length) {
            getJobs('all', {
              rows: 10,
              page: currentPage,
              search: searchText,
            });
          } else {
            setJobs(allJobs);
          }
          break;
        case 'internal-jobs':
          if (!internalJobs || !internalJobs.length) {
            getJobs('internal', {
              rows: 10,
              page: currentPage,
              search: searchText,
            });
          } else {
            setJobs(internalJobs);
          }
          break;
        case 'archived-jobs':
          if (!archivedJobs || !archivedJobs.length) {
            getJobs('archived', {
              rows: 10,
              page: currentPage,
              search: searchText,
            });
          } else {
            setJobs(archivedJobs);
          }
          break;
        default:
          if (!publishedJobs || !publishedJobs.length) {
            getJobs('published', {
              rows: 10,
              page: currentPage,
              search: searchText,
            });
          } else {
            setJobs(publishedJobs);
          }
      }
    }
  }, [jobDeleted, statusChanged]);

  useEffect(() => {
    if (duplicated && duplicated.id) {
      history.push(
        history.location.pathname + '?page=easyjobs-edit&id=' + duplicated.id,
      );
    }
    return () => {
      resetDuplicateJob();
    };
  }, [duplicated]);

  useEffect(() => {
    if (jobs && pinUnpinJobData) {
      const updatedJobs = jobs?.data?.map((job) => {
        if (job.id === pinUnpinJobData.id) {
          return { ...job, is_pinned: pinUnpinJobData.is_pinned };
        }
        return job;
      });
      setJobs({ ...jobs, data: updatedJobs });
    }
  }, [pinUnpinJobData]);

  const handlePinUnpin = (e, job) => {
    e.preventDefault();
    pinUnpinnedJob({ jobId: job.id, is_pinned: !job.is_pinned });
  };

  const openShareModal = (e, job) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShareModalJob(job);
  };

  const closeShareModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShareModalJob(null);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!openMenuId) {
        return;
      }
      const target = event.target;
      if (!target || !target.closest) {
        return;
      }
      if (!target.closest('[data-job-menu]')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [openMenuId]);

  const toggleJobMenu = (jobId) => {
    setOpenMenuId((prev) => (prev === jobId ? null : jobId));
  };

  const closeJobMenu = () => {
    setOpenMenuId(null);
  };

  const isExpiredJob = (job) => {
    const expiredFlag = job?.is_expired;
    if (expiredFlag === true || expiredFlag === 1 || expiredFlag === '1') {
      return true;
    }
    // if (job?.status === 2) {
    //   return true;
    // }
    return false;
  };

  const getJobMenuVariant = (job) => {
    if (job?.status === 1) {
      return 'draft';
    }
    if (job?.status === 3) {
      return 'archived';
    }
    if (job?.is_expired) {
      return 'expired';
    }
    if (!job?.is_expired) {
      return 'active';
    }
    if (isExpiredJob(job)) {
      return 'expired';
    }
    if (job?.is_internal) {
      return 'internal';
    }
    return 'active';
  };

  const jobMenuConfig = {
    active: ['view', 'edit', 'expire', 'duplicate', 'delete'],
    internal: ['view', 'edit', 'expire', 'duplicate', 'delete'],
    expired: ['view', 'edit', 'extend', 'duplicate', 'delete'],
    archived: ['edit', 'duplicate', 'delete'],
    draft: ['edit', 'duplicate', 'delete'],
  };

  const handleMenuAction = (event, action, jobId) => {
    if (event) {
      // event.preventDefault();
      // event.stopPropagation();
    }

    if (typeof action === 'function') {
      action(event, jobId);
    }
    closeJobMenu();
  };

  const canShareJob = (job) =>
    !isExpiredJob(job) && (job?.job_link || job?.social_links);

  const renderJobMenuItem = (item, job) => {
    switch (item) {
      case 'view':
        if (!job?.view_url) {
          return null;
        }
        return (
          <a
            key={`${job.id}-view`}
            href={job.view_url}
            className="dropdown--item"
            target="_blank"
            rel="noreferrer"
            onClick={closeJobMenu}
          >
            {__('View', 'easyjobs')}
          </a>
        );
      case 'edit':
        return (
          <LinkTag
            key={`${job.id}-edit`}
            to={`easyjobs-edit&id=${job.id}`}
            className="dropdown--item"
            onClick={closeJobMenu}
          >
            {__('Edit', 'easyjobs')}
          </LinkTag>
        );
      case 'share':
        if (!canShareJob(job)) {
          return null;
        }
        return (
          <button
            key={`${job.id}-share`}
            type="button"
            className="dropdown--item"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openShareModal(e, job);
              closeJobMenu();
            }}
          >
            {__('Share', 'easyjobs')}
          </button>
        );
      case 'expire':
        return (
          <button
            key={`${job.id}-expire`}
            type="button"
            className="dropdown--item"
            onClick={(e) => handleMenuAction(e, handleInitJobExpire, job.id)}
          >
            {__('Mark as Expired', 'easyjobs')}
          </button>
        );
      case 'extend':
        return (
          <button
            key={`${job.id}-extend`}
            type="button"
            className="dropdown--item"
            onClick={(e) => handleMenuAction(e, handleInitExtendExpire, job.id)}
          >
            {__('Extend Expiry', 'easyjobs')}
          </button>
        );
      case 'duplicate':
        return (
          <button
            key={`${job.id}-duplicate`}
            type="button"
            className="dropdown--item"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              duplicateJob(job.id);
              closeJobMenu();
            }}
          >
            {__('Duplicate', 'easyjobs')}
          </button>
        );
      case 'delete':
        return (
          <button
            key={`${job.id}-delete`}
            type="button"
            className="dropdown--item delete"
            onClick={(e) => handleMenuAction(e, handleInitJobDelete, job.id)}
          >
            {__('Delete', 'easyjobs')}
          </button>
        );
      default:
        return null;
    }
  };

  const getMenuItemsWithShare = (items, job, includeShare) => {
    if (!includeShare || !canShareJob(job)) {
      return items;
    }
    if (items.includes('share')) {
      return items;
    }
    const nextItems = [...items];
    const editIndex = nextItems.indexOf('edit');
    if (editIndex === -1) {
      nextItems.push('share');
    } else {
      nextItems.splice(editIndex + 1, 0, 'share');
    }
    return nextItems;
  };

  const JobActionMenu = ({
    job,
    wrapperClassName = 'job--control-more',
    includeShare = false,
  }) => {
    const menuVariant = getJobMenuVariant(job);
    const baseItems = jobMenuConfig[menuVariant] || [];
    const items = getMenuItemsWithShare(baseItems, job, includeShare);

    if (!items.length) {
      return null;
    }

    return (
      <div className={wrapperClassName} data-job-menu>
        <button
          type="button"
          className="menu--btn"
          aria-haspopup="true"
          aria-expanded={openMenuId === job.id}
          onClick={(e) => {
            e.preventDefault();
            toggleJobMenu(job.id);
          }}
        >
          <i className="eicon e-more-horiz"></i>
        </button>
        <div
          className={`dropdown--menu ${openMenuId === job.id ? 'show' : ''}`}
        >
          {items.map((item) => renderJobMenuItem(item, job))}
        </div>
      </div>
    );
  };

  const renderShareButton = (job, className = 'share-btn') => {
    if (!canShareJob(job)) {
      return null;
    }

    return (
      <button
        type="button"
        className={className}
        onClick={(e) => openShareModal(e, job)}
        aria-label={__('Share job', 'easyjobs')}
      >
        <i className="eicon e-share"></i>
      </button>
    );
  };

  return (
    <>
      {jobs?.data?.length ? (
        <>
          {/* <div className="rows rows-cols-1 rows-cols-lg-2 ej-jobs">
            {jobs.data.map((job, i) => (
              <div className="col" key={i}>
                <div className="job-card">
                  <div
                    className="card-thumbnail"
                    style={{ backgroundImage: `url(${job.banner_image})` }}
                  >
                    <Status job={job}/>
                    <button className="job__pinned" onClick={(e) => handlePinUnpin(e, job)}>
                      <span className={`follow__state follow__state--following ${job?.is_pinned ? 'active' : ''}`}>
                        <i className="eicon e-star"></i> { job.is_pinned ? ('Pinned') : ('Pin') }
                      </span>
                      <span className={`follow__state follow__state--unfollow ${!job?.is_pinned ? 'active' : ''}`}>
                        <i className="eicon e-star"></i> { !job.is_pinned ? ('Unpinned') : ('Unpin') }
                      </span>
                    </button>
                    <Controls
                      job={job}
                      currentTab={currentTab}
                      duplicateJob={duplicateJob}
                      duplicated={duplicated}
                      resetDuplicateJob={resetDuplicateJob}
                      deleteJob={deleteJob}
                      handleInitJobDelete={handleInitJobDelete}
                      handleInitJobExpire={handleInitJobExpire}
                      handleInitExtendExpire={handleInitExtendExpire}
                      companyInfo={companyInfo}
                    />
                  </div>
                  <div className="card-content">
                    <div className="card-content__left">
                      <h3 className="card-title">{job.title}</h3>
                      <h4 className="card-sub-title">{job.category.name}</h4>
                      <div className="card-info-group">
                        <p className="card-info">
                          {`${__('Post Date: ', 'easyjobs')} ${job.created_at}`}
                        </p>
                        <p className="card-info">
                          {`${__('Expiry Date: ', 'easyjobs')} ${job.expire_at}`}
                        </p>
                      </div>
                    </div>
                    <div className="card-content__right">
                      <p>
                        {job.applicant_count + ` ` + __('Applied', 'easyjobs')}
                      </p>
                      {job.applicants?.length ? (
                        <div className="applicants__img">
                          {job.applicants.map((applicant, i) => (
                            <img src={applicant.image} key={i} />
                          ))}
                          <p className="Applicants">{job.applicant_count}</p>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          {/* New Grid view UI/UX */}
          {layout === 'grid' && (
            <>
              <div className="all-jobs-wrapper grid-view">
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 job--container">
                  {jobs?.data?.map((job, i) => (
                    <div className="col" key={job.id || i}>
                      <div className="job--card">
                        <div className="job-header thumbnail--wrapper">
                          <img src={job.banner_image} />
                          <div className="header-actions">
                            {/* <button className="action-btn active">
                                  <span>Following</span>
                                  <i className="eicon e-star"></i>
                                </button> */}
                            <button
                              className={`action-btn ${
                                job?.is_pinned ? 'active' : ''
                              }`}
                              onClick={(e) => handlePinUnpin(e, job)}
                            >
                              <span>{job.is_pinned ? 'Unpin' : 'Pin'}</span>
                              <svg
                                width="11"
                                height="10"
                                viewBox="0 0 11 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9.97012 4.48908C9.81571 4.69828 9.58829 4.8418 9.333 4.89113C9.0777 4.94047 8.81319 4.89203 8.59195 4.75542C8.4704 4.67499 8.4704 4.67677 8.33633 4.81262C7.68031 5.47757 7.49977 5.65632 6.95279 6.19794L6.7079 6.44283C6.66907 6.4785 6.66242 6.47723 6.69182 6.51791C7.38895 7.56719 6.94564 8.74337 6.29678 9.49413C5.96703 9.84859 5.62449 9.85433 5.27789 9.53527C4.67523 8.93069 4.23073 8.49974 3.57618 7.82638C3.51374 7.77197 3.54058 7.7619 3.45641 7.82638C2.94161 8.24823 2.42561 8.6677 1.90842 9.08479C1.5974 9.33683 1.28518 9.58947 0.971766 9.8427C0.875445 9.93543 0.749458 9.99114 0.61605 10C0.563972 9.99899 0.512624 9.98755 0.465037 9.96637C0.417451 9.94518 0.37459 9.91468 0.338985 9.87666C0.0887332 9.63177 0.274635 9.37616 0.355073 9.26712C0.998105 8.386 1.62514 7.50824 2.28202 6.62874C2.32958 6.56235 2.32184 6.57887 2.26414 6.51792C1.67092 5.92983 1.2595 5.51737 0.726876 4.98244C0.349585 4.6084 0.371263 4.23045 0.773352 3.88133C1.52768 3.22353 2.82006 2.88032 3.72454 3.53992C3.73169 3.54528 3.73705 3.54885 3.74242 3.55243C4.52149 2.76527 4.85444 2.43275 5.53529 1.75776C5.37169 1.53316 5.2986 1.25521 5.33054 0.979184C5.36249 0.703154 5.49713 0.449251 5.7077 0.267947C5.91828 0.0866438 6.18937 -0.00878304 6.46708 0.000636418C6.74479 0.0100559 7.00879 0.123632 7.2066 0.318787C8.3256 1.42706 8.80465 1.9079 9.91113 3.02332C10.1007 3.21696 10.2117 3.47406 10.2226 3.74485C10.2335 4.01563 10.1435 4.28083 9.97012 4.48908Z"
                                  fill="#597DFC"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="job--content">
                          <div className="job--content-header">
                            <div className="job-title">
                              <h4>
                                <LinkTag to={`easyjobs-pipeline&id=${job.id}`}>
                                  {job.title}
                                </LinkTag>
                              </h4>
                              <Status job={job} />
                            </div>
                            <JobActionMenu
                              job={job}
                              wrapperClassName="job--control-more"
                            />
                          </div>
                          <div className="job-details">
                            <div>
                              <div className="detail-item">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clip-path="url(#clip0_7854_16516)">
                                    <path
                                      d="M4.52964 3.92762V2.69233C4.52964 2.3647 4.65979 2.0505 4.89145 1.81884C5.12311 1.58718 5.43732 1.45703 5.76494 1.45703H8.23552C8.56314 1.45703 8.87735 1.58718 9.10901 1.81884C9.34067 2.0505 9.47082 2.3647 9.47082 2.69233V3.92762M7.00023 7.01585V7.02203M1.44141 7.6335C3.16562 8.50234 5.06948 8.95491 7.00023 8.95491C8.93098 8.95491 10.8348 8.50234 12.5591 7.6335M1.44141 5.16291C1.44141 4.83529 1.57155 4.52109 1.80322 4.28943C2.03488 4.05777 2.34908 3.92762 2.6767 3.92762H11.3238C11.6514 3.92762 11.9656 4.05777 12.1972 4.28943C12.4289 4.52109 12.5591 4.83529 12.5591 5.16291V10.7217C12.5591 11.0494 12.4289 11.3636 12.1972 11.5952C11.9656 11.8269 11.6514 11.957 11.3238 11.957H2.6767C2.34908 11.957 2.03488 11.8269 1.80322 11.5952C1.57155 11.3636 1.44141 11.0494 1.44141 10.7217V5.16291Z"
                                      stroke="#667085"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_7854_16516">
                                      <rect
                                        width="14"
                                        height="14"
                                        fill="white"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                                <div className="job-meta">
                                  <span>{job.category.name}</span>
                                </div>
                              </div>
                              <div className="detail-item">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clip-path="url(#clip0_7854_16521)">
                                    <path
                                      d="M1.16797 7.0026C1.16797 4.80272 1.16797 3.70277 1.85139 3.01935C2.5348 2.33594 3.63475 2.33594 5.83464 2.33594H8.16797C10.3679 2.33594 11.4678 2.33594 12.1512 3.01935C12.8346 3.70277 12.8346 4.80272 12.8346 7.0026V8.16927C12.8346 10.3692 12.8346 11.4691 12.1512 12.1525C11.4678 12.8359 10.3679 12.8359 8.16797 12.8359H5.83463C3.63475 12.8359 2.5348 12.8359 1.85139 12.1525C1.16797 11.4691 1.16797 10.3692 1.16797 8.16927V7.0026Z"
                                      stroke="#667085"
                                    />
                                    <path
                                      d="M4.08203 2.33594V1.46094"
                                      stroke="#667085"
                                      stroke-linecap="round"
                                    />
                                    <path
                                      d="M9.91797 2.33594V1.46094"
                                      stroke="#667085"
                                      stroke-linecap="round"
                                    />
                                    <circle
                                      cx="9.625"
                                      cy="9.625"
                                      r="0.875"
                                      stroke="#667085"
                                    />
                                    <path
                                      d="M1.45703 5.25H12.5404"
                                      stroke="#667085"
                                      stroke-linecap="round"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_7854_16521">
                                      <rect
                                        width="14"
                                        height="14"
                                        rx="2.91667"
                                        fill="white"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                                <div className="job-meta">
                                  <span>
                                    {job.created_at} - {job.expire_at}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="avatar--group">
                              {job?.applicants?.map((applicant, i) => (
                                <img
                                  src={applicant.image}
                                  key={i}
                                  className="avatar"
                                  alt="applicantName"
                                />
                              ))}
                              {job?.applicant_count > 4 && (
                                <div className="avatar-count">
                                  +{job.applicant_count - 4}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="job-card-footer">
                          {renderShareButton(job)}
                          <div className="candidates-pipeline">
                            <LinkTag
                              to={`easyjobs-job-candidates&id=${job.id}`}
                              className="candidates-btn"
                            >
                              Candidates
                            </LinkTag>
                            <LinkTag
                              to={`easyjobs-pipeline&id=${job.id}`}
                              className="pipeline-btn"
                            >
                              Pipeline
                            </LinkTag>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* New List view UI/UX */}
          {layout === 'list' && (
            <div className="all-jobs-wrapper list-view">
              {jobs?.data?.map((job, i) => (
                <div className="job--container" key={job.id || i}>
                  <div className="job--card">
                    <div className="job--content">
                      <div className="job-title-section">
                        <div className="job-title">
                          <h4>
                            <LinkTag to={`easyjobs-pipeline&id=${job.id}`}>
                              {job.title}
                            </LinkTag>
                          </h4>
                          <Status job={job} />
                        </div>
                      </div>

                      <div className="collaborators-section">
                        <div className="detail-item">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_9094_17651)">
                              <path
                                d="M5.1759 4.48759V3.07583C5.1759 2.7014 5.32463 2.34232 5.58939 2.07756C5.85415 1.8128 6.21324 1.66406 6.58766 1.66406H9.41119C9.78561 1.66406 10.1447 1.8128 10.4095 2.07756C10.6742 2.34232 10.823 2.7014 10.823 3.07583V4.48759M7.99943 8.017V8.02406M1.64648 8.72289C3.61701 9.71584 5.79286 10.2331 7.99943 10.2331C10.206 10.2331 12.3818 9.71584 14.3524 8.72289M1.64648 5.89936C1.64648 5.52493 1.79522 5.16585 2.05998 4.90109C2.32474 4.63633 2.68383 4.48759 3.05825 4.48759H12.9406C13.315 4.48759 13.6741 4.63633 13.9389 4.90109C14.2036 5.16585 14.3524 5.52493 14.3524 5.89936V12.2523C14.3524 12.6267 14.2036 12.9858 13.9389 13.2506C13.6741 13.5153 13.315 13.6641 12.9406 13.6641H3.05825C2.68383 13.6641 2.32474 13.5153 2.05998 13.2506C1.79522 12.9858 1.64648 12.6267 1.64648 12.2523V5.89936Z"
                                stroke="#667085"
                                stroke-width="1.14286"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_9094_17651">
                                <rect width="16" height="16" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <div className="job-meta">
                            <span>{job?.category?.name || '-'}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.33398 8.0013C1.33398 5.48714 1.33398 4.23007 2.11503 3.44902C2.89608 2.66797 4.15316 2.66797 6.66732 2.66797H9.33398C11.8481 2.66797 13.1052 2.66797 13.8863 3.44902C14.6673 4.23007 14.6673 5.48714 14.6673 8.0013V9.33464C14.6673 11.8488 14.6673 13.1059 13.8863 13.8869C13.1052 14.668 11.8481 14.668 9.33398 14.668H6.66732C4.15316 14.668 2.89608 14.668 2.11503 13.8869C1.33398 13.1059 1.33398 11.8488 1.33398 9.33464V8.0013Z"
                              stroke="#667085"
                              stroke-width="1.14286"
                            />
                            <path
                              d="M4.66602 2.66797V1.66797"
                              stroke="#667085"
                              stroke-width="1.14286"
                              stroke-linecap="round"
                            />
                            <path
                              d="M11.334 2.66797V1.66797"
                              stroke="#667085"
                              stroke-width="1.14286"
                              stroke-linecap="round"
                            />
                            <circle
                              cx="11"
                              cy="11"
                              r="1"
                              stroke="#667085"
                              stroke-width="1.14286"
                            />
                            <path
                              d="M1.66602 6H14.3327"
                              stroke="#667085"
                              stroke-width="1.14286"
                              stroke-linecap="round"
                            />
                          </svg>
                          <div className="job-meta">
                            <span>
                              {job.created_at} - {job.expire_at}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="applied-section">
                        <div className="section-label">Applied:</div>
                        {job.applicants?.length ? (
                          <div className="avatar--group">
                            {job?.applicants?.map((applicant, index) => (
                              <img
                                key={index}
                                src={applicant.image}
                                alt={applicant.name || 'applicant'}
                                className="avatar"
                              />
                            ))}
                            <div className="avatar-count">
                              +{job.applicant_count}
                            </div>
                          </div>
                        ) : (
                          <div className="no-applicants">
                            {__('No applicants yet', 'easyjobs')}
                          </div>
                        )}
                      </div>

                      <div className="control--section">
                        <LinkTag
                          to={`easyjobs-pipeline&id=${job.id}`}
                          className="pipeline-btn"
                        >
                          Pipeline
                        </LinkTag>
                        <JobActionMenu
                          job={job}
                          wrapperClassName="dropdown-wrapper"
                          includeShare
                        />
                      </div>
                    </div>

                    <div className="job-card-footer">
                      <div className="status-section">
                        {/* <button className="status-btn active">
                              <i className="eicon e-star"></i>
                              <span>Following</span>
                            </button> */}
                        <button
                          className={`status-btn ${
                            job?.is_pinned ? 'active' : ''
                          }`}
                          onClick={(e) => handlePinUnpin(e, job)}
                        >
                          <svg
                            width="11"
                            height="12"
                            viewBox="0 0 11 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.609134 11C0.742887 10.9907 0.869204 10.935 0.966352 10.8426C1.27853 10.5888 1.59089 10.3357 1.90342 10.0832C2.43801 9.65264 2.98261 9.20588 3.51407 8.77615C4.18813 9.44139 4.65656 9.92872 5.27368 10.534C5.62664 10.8566 5.95715 10.8479 6.29262 10.4928C6.94072 9.74246 7.38455 8.56664 6.6872 7.51731C6.65538 7.47536 6.66586 7.47773 6.70257 7.44092C7.3375 6.80958 7.60896 6.54527 8.33191 5.8114C8.46653 5.67426 8.46653 5.67347 8.58665 5.75335C8.80787 5.89038 9.07262 5.939 9.3281 5.88952C9.58358 5.84004 9.81102 5.6961 9.9651 5.48639C10.1389 5.27846 10.2292 5.0134 10.2186 4.74262C10.208 4.47185 10.0973 4.21465 9.90783 4.02091C8.80071 2.90471 8.32073 2.42483 7.20245 1.31561C7.00427 1.12182 6.74061 1.0094 6.46357 1.00056C6.18653 0.991727 5.91624 1.08711 5.70612 1.26788C5.49599 1.44865 5.3613 1.70165 5.32866 1.97691C5.29601 2.25216 5.36779 2.52965 5.5298 2.75456L5.20506 3.07799C4.65368 3.62702 4.41623 3.86333 3.73652 4.55081C2.83361 3.87482 1.52678 4.21692 0.766621 4.87871C0.364349 5.22954 0.344085 5.60552 0.720875 5.98138C1.25891 6.51767 1.65748 6.92546 2.25786 7.51522C2.31362 7.57286 2.3253 7.56324 2.27601 7.62652C1.62022 8.5074 0.992902 9.38591 0.348285 10.2663C0.269018 10.3757 0.0832467 10.6318 0.332398 10.8751C0.367875 10.9133 0.410631 10.944 0.458155 10.9655C0.505678 10.9869 0.55701 10.9987 0.609134 11ZM1.46536 6.22119L0.973693 5.72856C0.883017 5.6571 0.824019 5.5529 0.809396 5.43839C0.833314 5.32028 0.902338 5.21615 1.0018 5.14812C1.64941 4.58647 2.74367 4.2738 3.50431 4.82345C3.53639 4.85613 3.57498 4.88172 3.61758 4.89856C3.66017 4.9154 3.70582 4.92311 3.75158 4.9212C3.79734 4.91929 3.8422 4.9078 3.88324 4.88748C3.92428 4.86715 3.96061 4.83844 3.98986 4.8032C4.66957 4.11572 4.90667 3.87976 5.45735 3.33143L5.78019 3.00991C5.81505 2.98334 5.84397 2.94977 5.8651 2.91137C5.88623 2.87296 5.8991 2.83056 5.90288 2.78689C5.90666 2.74322 5.90127 2.69924 5.88706 2.65777C5.87285 2.6163 5.85012 2.57826 5.82034 2.54609C5.70921 2.39385 5.65953 2.20532 5.68119 2.01808C5.70286 1.83084 5.79429 1.65863 5.93726 1.53579C6.08022 1.41295 6.26423 1.3485 6.4526 1.35527C6.64097 1.36204 6.81987 1.43955 6.95364 1.57234C8.0681 2.67791 8.54772 3.15735 9.6524 4.27111C9.78161 4.4024 9.85666 4.57753 9.86262 4.76164C9.86857 4.94576 9.80499 5.12537 9.68453 5.26474C9.58504 5.40498 9.43601 5.50223 9.26757 5.53681C9.09913 5.57139 8.92385 5.54074 8.77714 5.45104C8.41975 5.21175 8.22123 5.41367 8.07701 5.56068C7.4228 6.22311 7.24243 6.40198 6.69665 6.94323C6.50204 7.16913 6.13536 7.33181 6.389 7.71468C6.976 8.5978 6.58438 9.60802 6.0227 10.2583C5.99692 10.3001 5.96131 10.335 5.91896 10.3599C5.8766 10.3847 5.82881 10.3988 5.77974 10.401C5.73067 10.4031 5.68183 10.3932 5.63747 10.3721C5.59311 10.3511 5.55459 10.3194 5.52527 10.28C4.29077 9.05085 2.70934 7.45501 1.46536 6.22119ZM0.637243 10.4769C1.28208 9.59426 1.91747 8.71005 2.57072 7.82732L3.26386 8.51882C2.42223 9.20272 1.5808 9.88518 0.739562 10.5662C0.609345 10.6721 0.609912 10.6477 0.565314 10.5999C0.582849 10.5555 0.607109 10.514 0.637243 10.4769Z"
                              fill="#667085"
                              stroke="#667085"
                              stroke-width="0.4"
                            />
                          </svg>
                          <span>{job?.is_pinned ? 'Pinned' : 'Pin'}</span>
                        </button>
                      </div>

                      <LinkTag
                        to={`easyjobs-job-candidates&id=${job.id}`}
                        className="candidates-btn"
                      >
                        Candidates
                      </LinkTag>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <ShareModal
            job={shareModalJob}
            isOpen={!!shareModalJob}
            onClose={closeShareModal}
          />
        </>
      ) : loading ? (
        <h4 className="empty-message">{__('Loading jobs...', 'easyjobs')}</h4>
      ) : (
        <h4 className="empty-message">{__('No jobs found.', 'easyjobs')}</h4>
      )}

      <div className="section-gap">
        <Pager
          pageSize={jobs?.per_page}
          current={jobs?.current_page}
          total={jobs?.total}
          onChange={handlePageChange}
          showInfo={false}
        />
      </div>
    </>
  );
};

export default Jobs;
