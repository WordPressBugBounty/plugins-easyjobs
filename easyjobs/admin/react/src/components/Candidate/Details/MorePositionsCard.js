import React from 'react';
import { __ } from '@wordpress/i18n';
import LinkTag from '../../../util/Link';

// Pipeline type 100 = Rejected (red tag); everything else uses the green tag.
const REJECTED_TYPE = 100;

/**
 * Right column — "More Positions": other jobs this candidate has applied to,
 * each linking to that application with its pipeline-stage tag. Mirrors the app.
 */
const MorePositionsCard = ({ candidateDetails }) => {
  const candidate = candidateDetails?.candidate || {};
  const jobs = candidate?.other_applied_jobs || [];
  if (!jobs.length) return null;

  return (
    <section className="ejc-card card-pad">
      <h2 className="card-h" style={{ marginBottom: '10px' }}>
        {__('More Positions', 'easyjobs')}
      </h2>
      <p className="mp-sub">
        {__('This candidate has also applied for these jobs.', 'easyjobs')}
      </p>
      <div className="mp-list">
        {jobs.map((job, i) => {
          const rejected = Number(job?.pipeline?.type) === REJECTED_TYPE;
          return (
            <div className="mp-row" key={job?.id ?? i}>
              <LinkTag
                to={`easyjobs-candidates&id=${job?.id}&tab=application`}
                className="mp-title"
              >
                {job?.title}
              </LinkTag>
              {job?.pipeline?.label ? (
                <span
                  className={`mp-tag ${rejected ? 'mp-tag--rejected' : ''}`}
                >
                  {job.pipeline.label}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MorePositionsCard;
