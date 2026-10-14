import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import LinkTag from '../../util/Link';
import { __ } from '@wordpress/i18n';
import { ratingIcon } from '../../util/helper';

const Stage = ({ applicant, index }) => {
  return (
    <Draggable
      key={applicant?.id}
      draggableId={applicant?.id.toString()}
      index={index}
    >
      {(provided) => (
        <li
          className="pipeline-card"
          id={`applicant-${applicant?.id}`}
          data-applicant-id={applicant?.id}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="user__image">
            <img
              src={applicant?.user?.profile_image}
              alt=""
              className="w-100 img-fluid"
            />
          </div>
          <div className="user__details">
            <LinkTag
              to={`easyjobs-candidates&id=${applicant?.id}&tab=application`}
              className="user__name"
            >
              {applicant?.user?.name}
            </LinkTag>
            <div className="d-flex">
              {applicant?.user?.nationality && (
                <span className="user__address">
                  {applicant?.user?.nationality}
                </span>
              )}
              <p className="user__experience">
                {' '}
                {`${applicant?.user?.experience}`}
                {__(' Years', 'easyjobs')}
              </p>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <div className="user__text__ratting">
                {ratingIcon(applicant?.rating).map((star) => star)}
              </div>
              <div className="application-duration">
                {applicant?.updated_diff}
              </div>
            </div>
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default Stage;
