import { __ } from '@wordpress/i18n';
import LinkTag from '../../util/Link';
import {
  getPipelineLabel,
  getCandidateStageLabel,
  getAiScoreDetails,
  ratingIcon,
} from '../../util/helper';
import Ratting from '../../util/Ratting';

const Candidates = ({
  allJobCandidates,
  pipelines,
  loading,
  handleRatingOnClick,
  ratingLoading,
}) => {
  return (
    <div
      className={`data-table candidates-table ${
        loading || ratingLoading ? 'ej-loading' : ''
      }`}
    >
      <div className="table-wrap">
        <div className="table">
          {allJobCandidates?.length ? (
            <>
              <div className="table__row table__head">
                <div className="table-cell">{__('Name', 'easyjobs')}</div>
                <div className="table-cell">{__('Score', 'easyjobs')}</div>
                <div className="table-cell candidate-apply-time">
                  {__('Date', 'easyjobs')}
                </div>
                <div className="table-cell">{__('Stage', 'easyjobs')}</div>
                <div className="table-cell">{__('Rating', 'easyjobs')}</div>
              </div>
              <div className="table__body">
                {allJobCandidates.map((candidate) => {
                  const stage = getCandidateStageLabel(candidate, pipelines);
                  return (
                    <div
                      className="table__row"
                      data-candidate-id={candidate.id}
                    >
                      <div className="table-cell user__info">
                        <LinkTag
                          to={`easyjobs-candidates&id=${candidate.id}&tab=application`}
                          className="d-flex align-items-center"
                        >
                          <div className="user__image">
                            <img
                              src={candidate?.image}
                              alt=""
                              className="w-100 img-fluid"
                            />
                          </div>
                          <h4 className="user__name">
                            {candidate?.user?.name}
                          </h4>
                        </LinkTag>
                      </div>
                      <div className="table-cell user-ai-score has-ai-score">
                        {candidate.final_ai_score ? (
                          <>
                            <div className="progress">
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                  width: `${candidate?.final_ai_score}%`,
                                }}
                                aria-valuenow={candidate?.final_ai_score}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <div class="ai-score-details">
                              <ul>
                                {getAiScoreDetails(candidate.scores).map(
                                  (score) => score,
                                )}
                              </ul>
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="table-cell candidate-apply-time">
                        {candidate?.created_at}
                      </div>
                      <div className="table-cell job__status">
                        <div
                          className={
                            stage
                              ? `semi-button h-modified w-100 ${getPipelineLabel(
                                  stage,
                                )}`
                              : 'semi-button h-modified w-100'
                          }
                        >
                          {stage}
                        </div>
                      </div>
                      <div className="table-cell user-rate">
                        <Ratting
                          ratting={candidate?.rating}
                          candidate={candidate?.id}
                          handleRatingOnClick={handleRatingOnClick}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : loading ? (
            <h4 className="empty-message">
              {__('Loading candidates...', 'easyjobs')}
            </h4>
          ) : (
            <div className="table__row table__head">
              <div className="empty table-cell">
                {__('No candidates found', 'easyjobs')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Candidates;
