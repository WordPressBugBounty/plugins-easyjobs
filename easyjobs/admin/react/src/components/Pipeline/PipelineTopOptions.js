import React from 'react';
import LinkTag from '../../util/Link';
import { __ } from '@wordpress/i18n';

const PipelineTopOptions = ({
  pipelineJob,
  ejJobId,
  selectedCandidates,
  allPipeline,
  handleMoveStage,
}) => {
  return (
    <div className="d-flex justify-content-between my-5">
      <div className="back-button m-0">
        <LinkTag to={'easyjobs-jobs'} className="back-button__icon">
          <i className="easyjobs-icon easyjobs-back"></i>
        </LinkTag>
        <div className="back-button__text d-none d-md-block">
          {__('Back To Jobs', 'easyjobs')}
        </div>
        <div className="section-title d-block d-md-none ml-4">
          {pipelineJob?.title}
        </div>
      </div>
      <div className="dropdown pipeline-action ml-auto mr-3 d-none d-md-block">
        <button
          className="button white-button dropdown-toggle"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {__('Job Menu', 'easyjobs')}
        </button>
        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="dropdownMenuButton"
        >
          <LinkTag className="dropdown-item" to={'easyjobs-jobs'}>
            {__('All jobs', 'easyjobs')}
          </LinkTag>
          <LinkTag
            className="dropdown-item"
            to={`easyjobs-job-candidates&id=${ejJobId}`}
          >
            {__('Candidates', 'easyjobs')}
          </LinkTag>
        </div>
      </div>
      <button
        className="edit-button d-none d-md-flex mr-3"
        data-testid="ej-pipeline-edit"
        data-toggle="modal"
        data-target="#pipeline-modal"
      >
        <span className="edit-icon">
          <i className="easyjobs-icon easyjobs-pencil"></i>
        </span>
        <span> {__('Edit Pipeline', 'easyjobs')} </span>
      </button>
      <div
        className="dropdown pipeline-move-btn"
        style={{ display: selectedCandidates.size > 0 ? 'block' : 'none' }}
      >
        <button
          className="button primary-button dropdown-toggle"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {__('Move To Stage', 'easyjobs')}
        </button>
        <div className="dropdown-menu dropdown-menu-right">
          {allPipeline?.map(({ id, label }) => {
            return (
              <a
                className="dropdown-item change-pipeline"
                href="#"
                onClick={(e) => handleMoveStage(e, id)}
              >
                {__(label, 'easyjobs')}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PipelineTopOptions;
