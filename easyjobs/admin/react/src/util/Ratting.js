import React from 'react';

const Ratting = ({ ratting, candidate, handleRatingOnClick, jobId }) => {
  let totalRattings = [1, 2, 3, 4, 5];
  return (
    <div className="user__text__ratting">
      {totalRattings.map((rate) => (
        <div
          className={`rate-count ${rate <= ratting ? 'rated has-rating' : ''}`}
          onClick={() => handleRatingOnClick(rate, candidate, jobId)}
        >
          <i className="easyjobs-icon easyjobs-star"></i>
        </div>
      ))}
    </div>
  );
};

export default Ratting;
