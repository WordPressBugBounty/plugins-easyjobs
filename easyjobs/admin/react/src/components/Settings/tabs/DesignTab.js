import React, { useEffect, useState } from 'react';
const DesignTab = ({
  currentTab,
  loading,
  getCustomizerLink,
  customizerLink,
}) => {
  useEffect(() => {
    getCustomizerLink();
  }, []);

  return (
    <div
      className={`settings-tab ${currentTab === 'design' ? 'active' : ''} ${
        loading ? 'ej-loading' : ''
      }`}
    >
      <div className="section-title-wrap margin-deliver">
        <div className="section-title">Design</div>
      </div>
      <div className="form-box">
        <div className="row">
          <div className="col">
            <div className="ej-customizer-design-box p-0">
              <h3>Design your content live with customizer</h3>
              <a href={customizerLink} className="ej-customizer-btn">
                Go To Customizer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignTab;
