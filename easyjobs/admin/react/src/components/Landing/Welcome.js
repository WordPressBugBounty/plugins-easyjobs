import React, { useState } from 'react';
import { connect } from 'react-redux';
import { __ } from '@wordpress/i18n';
import { getImageUrl } from '../../util/helper';
const Welcome = ({ setView }) => {
  const [imgDisplay, setImgDisplay] = useState({ display: 'block' });
  const [videoDisplay, setVideoDisplay] = useState({ display: 'none' });
  const [videoBtn, setVideoBtn] = useState({ display: 'block' });

  const handleIntroVideo = (e) => {
    e.preventDefault();
    setImgDisplay({ display: 'none' });
    setVideoDisplay({ display: 'block' });
    setVideoBtn({ display: 'none' });
  };
  return (
    <div className="welcome">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="text-center">
              <a href="#" className="site-logo">
                <img src={getImageUrl('logo.png')} alt="easy.jobs" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="section-gap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="basic__content__block">
                <h1>The Best Hiring Solution For {new Date().getFullYear()}</h1>
                <div className="feature__list">
                  <div className="feature__item feature__item--one">
                    <div className="icon">
                      <img
                        src={getImageUrl('icon-1.png')}
                        alt="Automated Remote Hiring"
                      />
                    </div>
                    <p>Automated Remote Hiring</p>
                  </div>
                  <div className="feature__item feature__item--two">
                    <div className="icon">
                      <img src={getImageUrl('icon-2.png')} alt="AI Score" />
                    </div>
                    <p>Reporting With AI Score</p>
                    <span className="isPro">pro</span>
                  </div>
                  <div className="feature__item feature__item--three">
                    <div className="icon">
                      <img
                        src={getImageUrl('icon-3.png')}
                        alt="Easy Onboarding"
                      />
                    </div>
                    <p>Easy Onboarding Process</p>
                  </div>
                  <div className="feature__item feature__item--four">
                    <div className="icon">
                      <img
                        src={getImageUrl('icon-4.png')}
                        alt="Design With Elementor"
                      />
                    </div>
                    <p>Design With Elementor</p>
                  </div>
                  <div className="feature__item feature__item--five">
                    <div className="icon">
                      <img
                        src={getImageUrl('icon-5.png')}
                        alt="Custom Design"
                      />
                    </div>
                    <p>Custom Design</p>
                    <span className="isPro">pro</span>
                  </div>
                  <div className="feature__item feature__item--six">
                    <div className="icon">
                      <img
                        src={getImageUrl('icon-6.png')}
                        alt="In-App Messaging"
                      />
                    </div>
                    <p>In-App Messaging</p>
                    <span className="isPro">pro</span>
                  </div>
                </div>
                <p>
                  Recruiting for your company has been made easier and more
                  effective with the right tool for tracking, analyzing,
                  communicating, and evaluating candidates from one platform.
                </p>
              </div>
            </div>
            <div className="col-lg-6 ej-intro-video">
              <div className="content__thumb">
                <img
                  src={getImageUrl('macbook-air1.png')}
                  className="img-fluid"
                  alt="macbook"
                  style={imgDisplay}
                />
                <div
                  className="embed-responsive embed-responsive-16by9 video"
                  style={videoDisplay}
                >
                  <iframe
                    className="embed-responsive-item"
                    src="https://www.youtube.com/embed/xp1E65oLnlc?rel=0&autoplay=0"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="text-center" style={videoBtn}>
                <a href="#" className="watch-button" onClick={handleIntroVideo}>
                  <span></span> Watch Video
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section-gap">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="text-center">
                <button
                  className="get-started-button"
                  data-testid="ej-landing-get-started"
                  onClick={(e) => setView('login')}
                >
                  Get Started <span></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Welcome;
