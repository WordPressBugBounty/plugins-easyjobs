import { __ } from '@wordpress/i18n';
import React from 'react';
import LinkTag from '../../util/Link';

const WelcomeScreen = () => {
  return (
    <section className="ej-welcome section-gap">
      <div className="container">
        <div className="row justify-content-center p-0">
          <div className="col-md-10 text-center">
            <h1 className="mb-4">Welcome to Easy.jobs</h1>
            <div className="video p-3 bg-white">
              <div className="embed-responsive embed-responsive-16by9">
                <iframe
                  className="embed-responsive-item"
                  src="https://www.youtube.com/embed/xp1E65oLnlc?rel=0"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
            <div className="ej-welcome-cta mt-4 d-flex justify-content-center align-content-center w-100">
              <LinkTag to="easyjobs-create" className="button primary-button">
                Create a job post
              </LinkTag>
              <a
                href="https://easy.jobs/docs/"
                target="_blank"
                className="button primary-button ml-4"
              >
                How to use EasyJobs
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeScreen;
