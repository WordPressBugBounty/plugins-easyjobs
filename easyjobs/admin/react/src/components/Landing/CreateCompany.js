import React, { useEffect, useState } from 'react';
import { getImageUrl, validateFormFields } from '../../util/helper';
import Select from 'react-select';
import { hasFormError } from '../../util/helper';
import FormErrorMessage from '../../util/FormErrorMessage';

const CreateCompany = ({
  signUpData,
  loading,
  metaData,
  createCompany,
  createCompanyErrors,
}) => {
  const [companyTypes, setCompanyTypes] = useState([]);
  const [companySize, setCompanySize] = useState([]);
  const [selectedCompanySize, setSelectedCompanySize] = useState({});
  const [errors, setErrors] = useState(undefined);
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    username: '',
    mobile_number: '',
    industry: undefined,
    website: '',
    company_size: undefined,
    terms_and_policy: undefined,
  });

  useEffect(() => {
    if (metaData) {
      if (metaData.company_type) {
        setCompanyTypes(
          metaData.company_type.map((type) => ({
            label: type.name,
            value: type.id,
          })),
        );
      }
    }
    metaData &&
      metaData.company_sizes &&
      setCompanySize(
        metaData.company_sizes.map((each) => ({
          label: each.size + ' Employees',
          value: each.id,
          data: each,
        })),
      );
  }, [metaData]);

  useEffect(() => {
    if (companyInfo && companySize) {
      const valueToFind = companyInfo?.company_size;
      const foundObject = companySize?.find(
        (item) => item.value === valueToFind,
      );
      setSelectedCompanySize(foundObject);
    }
  }, [companyInfo, companySize]);

  useEffect(() => {
    if (createCompanyErrors) {
      setErrors(createCompanyErrors);
    }
  }, [createCompanyErrors]);

  const handleCompanyTypeChange = (selected) => {
    if (selected) {
      setCompanyInfo({
        ...companyInfo,
        industry: { id: selected.value, name: selected.label },
      });
    }
  };

  const handleCompanySizeChange = (selected) => {
    if (selected) {
      setCompanyInfo({
        ...companyInfo,
        company_size: selected.value,
      });
    }
  };

  const handleInputChange = (e) => {
    setCompanyInfo({
      ...companyInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateFormFields(companyInfo, {
      name: {
        required: true,
      },
      username: {
        required: true,
      },
      mobile_number: {
        required: {
          value: true,
          message: 'The phone no field is required',
        },
      },
      industry: {
        required: true,
      },
      website: {
        required: true,
      },
      company_size: {
        required: {
          value: true,
          message: 'The company size field is required',
        },
      },
      terms_and_policy: {
        required: {
          value: true,
          message: 'Please agree to terms and policy',
        },
      },
    });
    if (!isValid.valid) {
      setErrors(isValid.errors);
      return;
    }
    createCompany({
      user: signUpData,
      form_data: companyInfo,
    });
  };

  return (
    <div className="section-gap">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="create__company">
              <h2 className="create__company__title">
                Share More Information About Your Company To Jumpstart
              </h2>
              <p className="create__company__subtitle">
                You are just one step away from getting started with Easy.Jobs!
                Fill out your company's basic information to unlock the huge
                benefits
              </p>
              <div className="shape__wrap">
                <div className="shapes">
                  <img
                    src={getImageUrl('circle.png')}
                    className="shape-circle"
                  />
                  <img src={getImageUrl('dots.png')} className="shape-dots" />
                  <img
                    src={getImageUrl('triangle.png')}
                    className="shape-triangle"
                  />
                </div>
                <div className="account__wrap">
                  <div
                    className={`account__form ${loading ? 'ej-loading' : ''}`}
                  >
                    <form onSubmit={handleSubmit}>
                      <div className="form-note mb-4">
                        Give us few more information about your company
                      </div>
                      <div className="form-group">
                        <label>Company Name*</label>
                        <input
                          className={`form-control ${
                            hasFormError('name', errors) ? 'has-error' : ''
                          }`}
                          type="text"
                          placeholder="Your Company Name"
                          name="name"
                          value={companyInfo.name}
                          onChange={handleInputChange}
                        />
                        <FormErrorMessage field={'name'} errors={errors} />
                      </div>
                      <div className="form-group">
                        <label>Username / Company*</label>
                        <div className="input-group">
                          <input
                            className={`form-control ${
                              hasFormError('username', errors)
                                ? 'has-error'
                                : ''
                            }`}
                            type="text"
                            placeholder="Company Username"
                            name="username"
                            value={companyInfo.username}
                            onChange={handleInputChange}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text color-primary background-light">
                              .easy.jobs
                            </span>
                          </div>
                        </div>
                        <div className="form-note mt-2">
                          <span className="text-capitalize">tips: </span>
                          Accepted characters for username are alphabets,
                          numbers, hyphen & underscore.
                        </div>
                        <FormErrorMessage field={'username'} errors={errors} />
                      </div>
                      <div className="form-group">
                        <label>Phone No*</label>
                        <input
                          className={`form-control ${
                            hasFormError('mobile_number', errors)
                              ? 'has-error'
                              : ''
                          }`}
                          type="text"
                          placeholder="0123456789"
                          name="mobile_number"
                          value={companyInfo.mobile_number}
                          onChange={handleInputChange}
                        />
                        <FormErrorMessage
                          field={'mobile_number'}
                          errors={errors}
                        />
                      </div>
                      <div className="form-group">
                        <label>Industry*</label>
                        <Select
                          classNamePrefix="react-select"
                          placeholder="Your Industry Type..."
                          options={companyTypes}
                          isSearchable={true}
                          onChange={handleCompanyTypeChange}
                          className={
                            hasFormError('industry', errors) ? 'has-error' : ''
                          }
                        />
                        <FormErrorMessage field={'industry'} errors={errors} />
                      </div>
                      <div className="form-group">
                        <label>Website url*</label>
                        <input
                          className={`form-control ${
                            hasFormError('website', errors) ? 'has-error' : ''
                          }`}
                          type="text"
                          placeholder="http://www.example.com"
                          name="website"
                          value={companyInfo.website}
                          onChange={handleInputChange}
                        />
                        <div className="form-note mt-2">
                          <span className="text-capitalize">tips: </span>
                          Website URL should look like http://www.example.com
                        </div>
                        <FormErrorMessage field={'website'} errors={errors} />
                      </div>
                      <div className="form-group">
                        <label>Number of Employees*</label>
                        <Select
                          classNamePrefix="react-select"
                          placeholder="Your Company Size..."
                          maxMenuHeight={200}
                          options={companySize}
                          isSearchable={true}
                          onChange={handleCompanySizeChange}
                          className={
                            hasFormError('company_size', errors)
                              ? 'has-error'
                              : ''
                          }
                        />
                        <FormErrorMessage
                          field={'company_size'}
                          errors={errors}
                        />
                      </div>
                      <div className="row">
                        <div className="col">
                          <label className="checkbox mt-3">
                            <input
                              type="checkbox"
                              value="1"
                              id="terms-and-policy"
                              name="terms_and_policy"
                              onChange={(e) =>
                                setCompanyInfo({
                                  ...companyInfo,
                                  terms_and_policy: e.target.checked,
                                })
                              }
                            />
                            <span>
                              I Agree to the{' '}
                              <a target="_blank" href="https://easy.jobs/terms">
                                Terms and Policy
                              </a>
                              *
                            </span>
                          </label>
                          <FormErrorMessage
                            field={'terms_and_policy'}
                            errors={errors}
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-between equal-divided mt-3">
                        <button className="button info-button" type="submit">
                          Get Started
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompany;
