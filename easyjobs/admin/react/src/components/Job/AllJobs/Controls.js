import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from 'react';
import LinkTag from '../../../util/Link';
import { useHistory } from 'react-router-dom';
import { copyToClipboard } from '../../../util/helper';

const Controls = ({
  job,
  currentTab,
  duplicateJob,
  duplicated,
  resetDuplicateJob,
  deleteJob,
  handleInitJobDelete,
  handleInitJobExpire,
  handleInitExtendExpire,
  companyInfo,
}) => {
  const history = useHistory();
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

  const handleDuplicateJob = (e) => {
    e.preventDefault();
    duplicateJob(job.id);
  };

  const controls = {
    pipeline: (
      <LinkTag
        to={`easyjobs-pipeline&id=${job.id}`}
        className="control-button control-button--primary"
      >
        <div className="control-button__icon">
          <i className="easyjobs-icon easyjobs-pipe"></i>
        </div>
        <span>{__('Pipeline', 'easyjobs')}</span>
      </LinkTag>
    ),
    candidates: (
      <LinkTag
        to={'easyjobs-job-candidates&id=' + job.id}
        className="control-button control-button--primary"
      >
        <div className="control-button__icon">
          <i className="easyjobs-icon easyjobs-users"></i>
        </div>
        <span>{__('Candidates', 'easyjobs')}</span>
      </LinkTag>
    ),
    edit: (
      <LinkTag
        to={'easyjobs-edit&id=' + job.id}
        className="control-button control-button--primary"
      >
        <div className="control-button__icon">
          <i className="easyjobs-icon easyjobs-document"></i>
        </div>
        <span>{__('Edit', 'easyjobs')}</span>
      </LinkTag>
    ),
    duplicate: (
      <a
        href="#"
        className="control-button control-button--primary"
        onClick={handleDuplicateJob}
      >
        <div className="control-button__icon">
          <i className="easyjobs-icon easyjobs-duplicate"></i>
        </div>
        <span>{__('Duplicate', 'easyjobs')}</span>
      </a>
    ),
    delete: (
      <a
        href="#"
        className="control-button control-button--danger"
        onClick={(e) => handleInitJobDelete(e, job.id)}
      >
        <div className="control-button__icon">
          <i className="easyjobs-icon easyjobs-delete"></i>
        </div>
        <span>{__('Delete', 'easyjobs')}</span>
      </a>
    ),
    more: (
      <div className="dropdown job-control-more">
        <button
          className="control-button control-button--primary"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <div className="control-button__icon">
            <i className="easyjobs-icon easyjobs-plus"></i>
          </div>
          <span>{__('More', 'easyjobs')}</span>
        </button>
        <ul className="dropdown-menu dropdown-menu-center">
          {job.view_url && (
            <a className="dropdown-item" href={job.view_url} target="_blank">
              <span className="dropdown-icon">
                <i className="easyjobs-icon easyjobs-eye-1"></i>
              </span>
              {__('View', 'easyjobs')}
            </a>
          )}
          <a
            className="dropdown-item ej-duplicate-job"
            href="#"
            onClick={handleDuplicateJob}
          >
            <span className="dropdown-icon">
              <i className="easyjobs-icon easyjobs-duplicate"></i>
            </span>
            {__('Duplicate', 'easyjobs')}
          </a>
          {!job?.is_expired && (
            <a
              className="dropdown-item ej-duplicate-job"
              href="#"
              onClick={(e) => handleInitJobExpire(e, job.id)}
            >
              <span className="dropdown-icon">
                <i className="easyjobs-icon easyjobs-clock"></i>
              </span>
              {__('Mark as Expire', 'easyjobs')}
            </a>
          )}
          {job?.is_expired && (
            <a
              className="dropdown-item ej-duplicate-job"
              href="#"
              onClick={(e) => handleInitExtendExpire(e, job.id)}
            >
              <span className="dropdown-icon">
                <i className="easyjobs-icon easyjobs-clock"></i>
              </span>
              {__('Extend Expiry', 'easyjobs')}
            </a>
          )}
          <a
            className="dropdown-item delete delete-job"
            href="#"
            onClick={(e) => handleInitJobDelete(e, job.id)}
          >
            <span className="dropdown-icon">
              <i className="easyjobs-icon easyjobs-delete"></i>
            </span>
            {__('Delete', 'easyjobs')}
          </a>
          {job?.social_links && !job?.is_expired && (
            <div className="share-button">
              <a
                className="dropdown-item"
                href="#"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="dropdown-icon">
                  <i className="easyjobs-icon easyjobs-share"></i>
                </div>
                {__('Share', 'easyjobs')}
              </a>
              <div className="share-button-menu">
                {job.social_links.facebook && (
                  <a className="dropdown-item" href={job.social_links.facebook}>
                    <span className="dropdown-icon">
                      <i className="easyjobs-icon easyjobs-facebook"></i>
                    </span>
                    {__('facebook', 'easyjobs')}
                  </a>
                )}
                {job.social_links.linkedIn && (
                  <a className="dropdown-item" href={job.social_links.linkedIn}>
                    <span className="dropdown-icon">
                      <i className="easyjobs-icon easyjobs-linkedin"></i>
                    </span>
                    {__('linkedin', 'easyjobs')}
                  </a>
                )}
                {job.social_links.twitter && (
                  <a className="dropdown-item" href={job.social_links.twitter}>
                    <span className="dropdown-icon">
                      <i className="eicon-2 eicon-2-twitter-x"></i>
                    </span>
                    {__('twitter', 'easyjobs')}
                  </a>
                )}
                {job?.view_url && (
                  <a
                    className="dropdown-item"
                    onClick={() => copyToClipboard(job.view_url)}
                    // href="#"
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="dropdown-icon">
                      <i className="easyjobs-icon e-paper"></i>
                    </span>
                    {__('Copy link', 'easyjobs')}
                  </a>
                )}
              </div>
            </div>
          )}
        </ul>
      </div>
    ),
  };
  let jobControls = [];
  if (companyInfo?.is_pro) {
    jobControls = ['pipeline', 'candidates', 'edit', 'more'];
  } else {
    jobControls = ['candidates', 'edit', 'more'];
  }

  const [currentControls, setCurrentControls] = useState(jobControls);
  useEffect(() => {
    if (currentTab && companyInfo?.is_pro) {
      switch (currentTab.id) {
        case 'archived-jobs':
          setCurrentControls(['pipeline', 'edit', 'duplicate', 'delete']);
          break;
        case 'draft-jobs':
          setCurrentControls(['edit', 'duplicate', 'delete']);
          break;
        default:
          setCurrentControls(['pipeline', 'candidates', 'edit', 'more']);
      }
    } else {
      switch (currentTab.id) {
        case 'archived-jobs':
          setCurrentControls(['edit', 'duplicate', 'delete']);
          break;
        case 'draft-jobs':
          setCurrentControls(['edit', 'duplicate', 'delete']);
          break;
        default:
          setCurrentControls(['candidates', 'edit', 'more']);
      }
    }
  }, [currentTab]);
  return (
    <div className="card-control">
      {currentControls.map((item, i) => controls[item])}
    </div>
  );
};

export default Controls;
