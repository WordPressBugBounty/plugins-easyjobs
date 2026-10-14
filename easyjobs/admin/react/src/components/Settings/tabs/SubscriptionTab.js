import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { packages } from '../../../redux/sagas/settingsSaga';
const SubscriptionTab = ({ currentTab, loading, getPackages, allPackages }) => {
  const [all, setAll] = useState([]);
  const [activePackage, setActivePackage] = useState({});
  const [selectedTab, setSelectedTab] = useState(1);

  const handleTabChange = (id) => {
    setSelectedTab(id);
  };

  useEffect(() => {
    getPackages();
  }, []);

  return (
    <div
      className={`account-content agency-enterprise settings-content settings-tab ${
        currentTab === 'subscription' ? 'active' : ''
      } ${loading ? 'ej-loading' : ''}`}
    >
      {(allPackages &&
        allPackages.map((data, i) => (
          <div key={`pkg-group-${i}`}>
            <div className="section-title-wrap mb-0 d-flex justify-content-between align-items-start">
              <div className="section-title margin-deliver">{data.title}</div>
            </div>
            <div className="tab-wrapper">
              <div
                onClick={() => handleTabChange(1)}
                className={`tab-items ${selectedTab === 1 ? 'active' : ''}`}
              >
                <span>Regular</span>
              </div>
              <div
                onClick={() => handleTabChange(2)}
                className={`tab-items ${selectedTab === 2 ? 'active' : ''}`}
              >
                <span>Enterprise</span>
              </div>
              <div
                onClick={() => handleTabChange(3)}
                className={`tab-items ${selectedTab === 3 ? 'active' : ''}`}
              >
                <span>Agency</span>
              </div>
            </div>
            <div
              className={`row ${
                selectedTab === 1 ? 'tab-content' : 'tab-content-hide'
              }`}
            >
              {data.packages &&
                data.packages.map((each, index) => (
                  <div className="col-xl-4 col-sm-6" key={`pkg-${index}`}>
                    <div
                      className={`subscription-package ${
                        each.is_selected ? 'active' : ''
                      }`}
                    >
                      <div className="package-title">{each.name}</div>
                      <div className="package-pricing-box">
                        {each.price !== each.discounted_price && (
                          <span className="previous-price">{each.price}</span>
                        )}
                        {each.discounted_price && (
                          <span className="package-price">
                            {each.discounted_price}
                          </span>
                        )}
                        <span className="package-duration">{each.plan}</span>
                      </div>
                      <ul className="plan-states">
                        {each.attrs &&
                          each.attrs.map((attr, ai) => (
                            <li
                              key={`att-${ai}`}
                              className={!attr.active ? 'disable' : ''}
                            >
                              {attr.title}
                            </li>
                          ))}
                      </ul>
                      {each.is_selected && !each?.is_expired && (
                        <a
                          href="#"
                          className="button"
                          onClick={(e) => e.preventDefault()}
                        >
                          Selected
                        </a>
                      )}
                      {each.is_selected && each?.is_expired && (
                        <a
                          href={`${easyJobsJs.easyjobs_app_url}/subscribe?plan=${each.slug}`}
                          className="button"
                          target="_blank"
                        >
                          Renew
                        </a>
                      )}
                      {(!each.is_selected && each.upgradable && (
                        <a
                          href={`${easyJobsJs.easyjobs_app_url}/subscribe?plan=${each.slug}`}
                          className="button"
                          target="_blank"
                        >
                          Upgrade
                        </a>
                      )) ||
                        (!each.is_selected && (
                          <a
                            href="#"
                            className="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toast.warn('Package downgrade is not possible');
                            }}
                          >
                            Upgrade
                          </a>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
            <div
              className={`row ${
                selectedTab === 2 ? 'tab-content' : 'tab-content-hide'
              } enterprise align-items-center`}
            >
              <div className="col-xl-6 col-sm-6">
                <h2 className="agency-title">Easy.Jobs Enterprise</h2>
                <p className="enterprise-desc">
                  Get started with easy.jobs Enterprise Plan to customize your
                  company profile with white labeling and unlock more exclusive
                  features. You will be able to create a self-hosted hiring
                  platform maintaining distinct, secure boundaries for your
                  data, and ensure data security with GDPR compliance for your
                  company.
                </p>
                <a
                  href="https://easy.jobs/enterprise/"
                  target="_blank"
                  className="button primary-button"
                >
                  <span>Learn More</span>
                </a>
              </div>
              <div className="col-xl-6 col-sm-6">
                <img
                  src={`${easyJobsJs.plugin_url}admin/assets/img/enterprise.jpg`}
                />
              </div>
            </div>
            <div
              className={`row ${
                selectedTab === 3 ? 'tab-content' : 'tab-content-hide'
              } enterprise align-items-center`}
            >
              <div className="col-xl-6 col-sm-6">
                <h2 className="agency-title">Easy.Jobs Agency</h2>
                <p className="enterprise-desc">
                  Subscribe to easy.jobs Agency Plan to create customized job
                  boards with unlimited companies with white labeling and unlock
                  more exclusive features. You will be able to create a
                  self-hosted platform maintaining distinct, secure boundaries
                  for your data, and ensuring data security with GDPR
                  compliance. So, creating a professional hiring platform will
                  be easier and smoother.
                </p>
                <a
                  href="https://easy.jobs/enterprise/"
                  target="_blank"
                  className="button primary-button"
                >
                  <span>Learn More</span>
                </a>
              </div>
              <div className="col-xl-6 col-sm-6">
                <img
                  src={`${easyJobsJs.plugin_url}admin/assets/img/agency.jpg`}
                />
              </div>
            </div>
          </div>
        ))) || <div className="alert alert-warning">No packages found</div>}
    </div>
  );
};

export default SubscriptionTab;
