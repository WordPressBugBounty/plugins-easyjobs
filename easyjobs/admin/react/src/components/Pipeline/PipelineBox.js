import React from 'react';
import { ratingIcon } from '../../util/helper';
import LinkTag from '../../util/Link';
import { __ } from '@wordpress/i18n';

const PipelineBox = ({
  allPipeline,
  selectedCandidates,
  handleCheckobxToggle,
  loadingPipeline,
}) => {
  return (
    <div className={`pipeline-box ${loadingPipeline ? 'ej-loading' : ''}`}>
      <div className="pipeline-menu">
        <div className="pipeline-hamburger">
          <div className="hamburger-toggler"></div>
        </div>
        <ul
          className="pipeline-nav nav nav-tabs flex-column"
          id="pipeline-tab"
          role="tablist"
        >
          {allPipeline?.map((pipeline, index) => {
            return (
              <li className="nav-item" role="presentation">
                <a
                  data-testid="ej-pipeline-stage"
                  className={`pipeline-button pipeline-${pipeline?.label
                    ?.toLowerCase()
                    ?.replace(/ /g, '-')} ${index == 0 ? 'active' : ''} ${
                    pipeline.type == 99 && 'selected'
                  } ${pipeline.type == 100 && 'rejected'}`}
                  data-toggle="tab"
                  href={`#${pipeline?.label
                    ?.toLowerCase()
                    ?.replace(/ /g, '-')}`}
                  role="tab"
                  aria-controls={`${pipeline?.label
                    ?.toLowerCase()
                    ?.replace(/ /g, '-')}`}
                  aria-selected={`${index == 0 ? 'true' : 'false'}`}
                >
                  <span>{pipeline?.label}</span>
                  <span className="candidates-number">{pipeline?.count} </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="pipeline-content tab-content">
        {allPipeline?.map((pipeline, index) => {
          return (
            <div
              className={`tab-pane pipeline-tab fade ${
                index == 0 ? 'show active' : ''
              }`}
              id={`${pipeline?.label?.toLowerCase()?.replace(/ /g, '-')}`}
              role="tabpanel"
              aria-labelledby={`${pipeline?.label
                ?.toLowerCase()
                ?.replace(/ /g, '-')}`}
            >
              {pipeline?.count > 0 ? (
                <div className="row row-cols-xl-3">
                  {pipeline?.applicants?.map((applicant, ind) => {
                    return (
                      <div className="col" key={ind}>
                        <div className="pipeline-card">
                          <div className="user__image">
                            <img
                              src={`${applicant?.user?.profile_image}`}
                              alt=""
                              className="w-100 img-fluid"
                            />
                          </div>
                          <div className="user__details">
                            <LinkTag
                              to={`easyjobs-candidates&id=${applicant?.id}&tab=application`}
                              className="user__name"
                            >
                              {`${applicant?.user?.name}`}
                            </LinkTag>
                            <div className="d-flex">
                              {applicant?.user?.nationality && (
                                <span className="user__address">
                                  {applicant?.user?.nationality}
                                </span>
                              )}
                              &nbsp;
                              <p className="user__experience">
                                {' '}
                                {`${applicant?.user?.experience}`}
                                {__(' Years', 'easyjobs')}
                              </p>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                              <div className="user__text__ratting">
                                {ratingIcon(applicant?.rating).map(
                                  (star) => star,
                                )}
                              </div>
                              <div className="application-duration">{`${applicant?.updated_diff}`}</div>
                            </div>
                          </div>
                          <label
                            className="checkbox pipeline-checkbox"
                            htmlFor={`applicant-${applicant?.id}`}
                          >
                            <input
                              type="checkbox"
                              className="applicant"
                              value={applicant?.id}
                              checked={selectedCandidates.has(
                                String(applicant?.id),
                              )}
                              id={`applicant-${applicant?.id}`}
                              onChange={handleCheckobxToggle}
                            />
                            <span></span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <h4 className={'empty-message'}>No candidates found</h4>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineBox;
