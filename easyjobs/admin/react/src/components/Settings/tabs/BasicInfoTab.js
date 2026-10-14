import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';

const BasicInfoTab = ({
  loading,
  currentTab,
  getBasicInfo,
  basicInfo,
  getCompanyMetaData,
  metadata,
  address,
  getCountries,
  getStates,
  getCities,
  saveBasicInfo,
  basicInfoError,
  resetAddress,
}) => {
  const { __ } = wp.i18n;
  const [formData, setFormData] = useState({
    company: {
      name: '',
      username: '',
      mobile_number: '',
      company_type: '',
      website: undefined,
      company_size: '',
      description: '',
      show_job_filter: false,
      show_location: false,
      show_city: false,
      show_state: false,
      show_country: false,
      benefits: '',
      show_explore_company: 0,
      time_zone: undefined,
      jobs_per_page: '',
      translate_user_input: false,
    },
    companyAddress: {
      postal_code: '',
      country: '',
      state: '',
      city: '',
    },
    lang: '',
  });

  const [industry, setIndustry] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [companySize, setCompanySize] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [timeZone, setTimeZone] = useState([]);
  const [selectedCompanySize, setSelectedCompanySize] = useState({});

  useEffect(() => {
    getBasicInfo();
    getCompanyMetaData();
  }, []);
  const checkForNullValue = (value) => (value !== null ? value : undefined);

  useEffect(() => {
    if (basicInfo) {
      const data = { ...formData };
      if (basicInfo.company) {
        data.company = {
          ...basicInfo.company,
          name: checkForNullValue(basicInfo.company.name),
          username: checkForNullValue(basicInfo.company.username),
          mobile_number: checkForNullValue(basicInfo.company.mobile_number),
          company_type: checkForNullValue(basicInfo.company.company_type),
          website: checkForNullValue(basicInfo.company.website),
          company_size: checkForNullValue(basicInfo.company.company_size),
          description: checkForNullValue(basicInfo.company.description)
            ? basicInfo.company.description
            : '',
          benefits:
            (checkForNullValue(basicInfo.company.benefits) &&
              basicInfo.company.benefits) ||
            '',
          show_job_filter: checkForNullValue(basicInfo.company.show_job_filter),
          show_location: checkForNullValue(basicInfo.company.show_location),
          show_city: checkForNullValue(basicInfo.company.show_city),
          show_state: checkForNullValue(basicInfo.company.show_state),
          show_country: checkForNullValue(basicInfo.company.show_country),
          translate_user_input: checkForNullValue(
            basicInfo.company.translate_user_input,
          ),
          show_explore_company: checkForNullValue(
            basicInfo.company.show_explore_company,
          ),
          time_zone: checkForNullValue(basicInfo.company.time_zone),
          jobs_per_page: basicInfo?.company?.jobs_per_page,
        };
      }
      if (basicInfo.companyAddress) {
        data.companyAddress = {
          ...data.companyAddress,
          postal_code: checkForNullValue(basicInfo.companyAddress.postal_code)
            ? basicInfo.companyAddress.postal_code
            : '',
          country: checkForNullValue(basicInfo.companyAddress.country)
            ? Array.isArray(basicInfo.companyAddress.country)
              ? undefined
              : basicInfo.companyAddress.country
            : basicInfo.companyAddress.country,
          state: checkForNullValue(basicInfo.companyAddress.state)
            ? Array.isArray(basicInfo.companyAddress.state)
              ? undefined
              : basicInfo.companyAddress.state
            : basicInfo.companyAddress.state,
          city: checkForNullValue(basicInfo.companyAddress.city)
            ? Array.isArray(basicInfo.companyAddress.city)
              ? undefined
              : basicInfo.companyAddress.city
            : basicInfo.companyAddress.city,
        };
      }
      if (basicInfo.lang) {
        data.lang = checkForNullValue(basicInfo.lang);
      }
      setFormData(data);
    }
  }, [basicInfo]);

  useEffect(() => {
    if (formData && companySize) {
      const valueToFind = formData?.company?.company_size;
      const foundObject = companySize?.find(
        (item) => item.value === valueToFind,
      );
      setSelectedCompanySize(foundObject);
    }
  }, [formData, companySize]);

  useEffect(() => {
    metadata &&
      metadata.company_type &&
      setIndustry(
        metadata.company_type.map((each) => ({
          label: each.name,
          value: each.id,
          data: each,
        })),
      );

    metadata &&
      metadata.company_sizes &&
      setCompanySize(
        metadata.company_sizes.map((each) => ({
          label: each.size + ' Employees',
          value: each.id,
          data: each,
        })),
      );

    metadata &&
      metadata.languages &&
      setLanguages(
        metadata.languages.map((each) => ({
          label: each.name,
          value: each.code,
          data: each,
        })),
      );

    metadata &&
      metadata.timezones &&
      setTimeZone(
        metadata.timezones.map((each) => ({
          label: each.time_zone,
          value: each.time_zone,
          data: each,
        })),
      );
  }, [metadata]);

  useEffect(() => {
    address.countries &&
      setCountries(
        address.countries.map((each) => ({
          label: each.name,
          value: each.id,
          data: each,
        })),
      );
  }, [address.countries]);

  useEffect(() => {
    const options = [];
    address.states &&
      address.states.forEach((group) => {
        const groupOptions = group.opts.map((option) => ({
          label: `${option.name}`,
          value: `${option.id}`,
          data: option,
        }));

        if (groupOptions.length > 0) {
          options.push({
            label: group.group_name,
            options: groupOptions,
          });
        }
      });
    setStates(options);
  }, [address.states]);

  useEffect(() => {
    const options = [];
    address.cities &&
      address.cities.forEach((group) => {
        const groupOptions = group.opts.map((option) => ({
          label: `${option.name}`,
          value: `${option.id}`,
          data: option,
        }));

        if (groupOptions.length > 0) {
          options.push({
            label: group.group_name,
            options: groupOptions,
          });
        }
      });
    setCities(options);
  }, [address.cities]);

  const handleFormField = (e, object) => {
    const allData = { ...formData };
    if (
      e.target.name === 'show_job_filter' ||
      e.target.name === 'show_location_filter' ||
      e.target.name === 'show_city_filter' ||
      e.target.name === 'show_state_filter' ||
      e.target.name === 'show_country_filter' ||
      e.target.name === 'translate_user_input' ||
      e.target.name === 'show_explore_company'
    ) {
      if (e.target.name === 'show_location_filter') {
        allData[object]['show_location'] = e.target.checked;
      } else if (e.target.name === 'show_city_filter') {
        allData[object]['show_city'] = e.target.checked;
      } else if (e.target.name === 'show_state_filter') {
        allData[object]['show_state'] = e.target.checked;
      } else if (e.target.name === 'show_country_filter') {
        allData[object]['show_country'] = e.target.checked;
      } else {
        allData[object][e.target.name] = e.target.checked;
      }
    } else {
      allData[object][e.target.name] = e.target.value;
    }
    setFormData(allData);
  };
  const getMetaData = () => {
    !metadata && getCompanyMetaData();
  };

  const getAddressData = (name) => {
    switch (name) {
      case 'countries':
        !address.countries && getCountries();
        break;
      case 'states':
        if (!formData.companyAddress.country?.id) {
          toast.error(__('Please select country', 'easyjobs'));
          return;
        }
        !address.states && getStates(formData.companyAddress.country?.id);
        break;
      case 'cities':
        if (!formData.companyAddress.country?.id) {
          toast.error(__('Please select country', 'easyjobs'));
          return;
        }
        if (!formData.companyAddress.state?.id) {
          toast.error(__('Please select state', 'easyjobs'));
          return;
        }
        !address.cities &&
          getCities(
            formData.companyAddress.country?.id,
            formData.companyAddress.state?.id,
          );
        break;
    }
  };

  const handleReactSelectInput = (selected, name, object, dependencies) => {
    if (selected === null || name === 'country') {
      resetAddress(['addressLoading', 'states', 'cities', 'addressError']);
      setCities([]);
      setStates([]);
    }
    const inputs = { ...formData };
    if (selected) {
      if ('company_size' === name || 'time_zone' === name) {
        inputs[object][name] = selected?.value;
      } else if (object) {
        inputs[object][name] = selected.data;
      } else {
        inputs[name] = selected.data;
      }
    } else {
      if (object) {
        inputs[object][name] = undefined;
      } else {
        inputs[name] = undefined;
      }
    }
    if (dependencies) {
      inputs[object] = { ...inputs[object], ...dependencies };
    }
    setFormData(inputs);
  };
  const handleEditorInput = (value, name) => {
    if (formData.company[name] !== value) {
      setFormData((prevState) => ({
        ...prevState,
        company: { ...prevState.company, [name]: value },
      }));
    }
  };
  const modules = {
    toolbar: [
      [
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        { header: 1 },
        { header: 2 },
      ],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }],
      [{ align: [] }],
      ['clean'],
    ],
  };

  const formats = [
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'header',
    'size',
    'list',
    'color',
    'align',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    saveBasicInfo(formData);
  };
  const capitalizeFirstLetter = (string) => {
    if ('string' === typeof string) {
      string?.charAt(0)?.toUpperCase() + string?.slice(1);
    }
  };
  return (
    <div
      className={`settings-tab ${currentTab === 'basic' ? 'active' : ''} ${
        loading || address.addressLoading ? 'ej-loading' : ''
      }`}
    >
      <div className="section-title-wrap margin-deliver">
        <div className="section-title">{__('Company Setup', 'easyjobs')}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-box">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="company-name">
                  {__('Company Name', 'easyjobs')}*
                </label>
                <input
                  id={'company-name'}
                  data-testid="ej-settings-company-name"
                  type="text"
                  className="form-control"
                  placeholder="Your Company Name"
                  value={formData.company.name}
                  name="name"
                  onChange={(e) => handleFormField(e, 'company')}
                />
                {basicInfoError && basicInfoError['company.name'] && (
                  <div className="error-message">
                    {capitalizeFirstLetter(basicInfoError['company.name'][0])}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group disabled">
                <label htmlFor="user-name">
                  {__('User Name / Company', 'easyjobs')}*
                </label>
                <input
                  id={'user-name'}
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Your User Name / Company*"
                  value={formData.company.username}
                  disabled
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="mobile-number">
                  {__('Mobile Number', 'easyjobs')}*
                </label>
                <input
                  id={'mobile-number'}
                  type="text"
                  name="mobile_number"
                  className="form-control"
                  placeholder="0123456789"
                  value={formData.company.mobile_number}
                  onChange={(e) => handleFormField(e, 'company')}
                />
                {basicInfoError && basicInfoError['company.mobile_number'] && (
                  <div className="error-message">
                    {capitalizeFirstLetter(
                      basicInfoError['company.mobile_number'][0],
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>{__('Industry', 'easyjobs')}*</label>
                <div className="select-option">
                  <Select
                    classNamePrefix="react-select"
                    isSearchable
                    isClearable
                    onChange={(e) =>
                      handleReactSelectInput(e, 'company_type', 'company')
                    }
                    options={industry}
                    onMenuOpen={getMetaData}
                    value={
                      (formData.company.company_type && {
                        label: formData.company.company_type.name,
                        value: formData.company.company_type.id,
                        data: formData.company.company_type,
                      }) ||
                      undefined
                    }
                  />
                </div>
                {basicInfoError && basicInfoError['company.company_type'] && (
                  <div className="error-message">Please select industry</div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>{__('Country', 'easyjobs')}</label>
                <div className="select-option">
                  <Select
                    classNamePrefix="react-select"
                    isSearchable
                    isClearable
                    onChange={(e) =>
                      handleReactSelectInput(e, 'country', 'companyAddress', {
                        city: undefined,
                        state: undefined,
                      })
                    }
                    options={countries}
                    onMenuOpen={() => getAddressData('countries')}
                    value={
                      (formData.companyAddress.country && {
                        label: formData.companyAddress.country.name,
                        value: formData.companyAddress.country.id,
                        data: formData.companyAddress.country,
                      }) ||
                      undefined
                    }
                    placeholder={__('Select country', 'easyjobs')}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>State</label>
                <div className="select-option">
                  <Select
                    classNamePrefix="react-select"
                    isSearchable
                    onChange={(e) =>
                      handleReactSelectInput(e, 'state', 'companyAddress', {
                        city: undefined,
                      })
                    }
                    options={states}
                    onMenuOpen={() => getAddressData('states')}
                    value={
                      formData.companyAddress.state
                        ? {
                            label: formData.companyAddress.state.name,
                            value: formData.companyAddress.state.id,
                            data: formData.companyAddress.state,
                          }
                        : {
                            label: 'Select',
                            value: '',
                            data: '',
                          }
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>{__('City', 'easyjobs')}</label>
                <div className="select-option">
                  <Select
                    classNamePrefix="react-select"
                    isSearchable
                    onChange={(e) =>
                      handleReactSelectInput(e, 'city', 'companyAddress')
                    }
                    options={cities}
                    onMenuOpen={() => getAddressData('cities')}
                    value={
                      formData.companyAddress.city
                        ? {
                            label: formData.companyAddress.city.name,
                            value: formData.companyAddress.city.id,
                            data: formData.companyAddress.city,
                          }
                        : {
                            label: 'Select',
                            value: '',
                            data: '',
                          }
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="postal-code">
                  {__('Postal Code', 'easyjobs')}
                </label>
                <input
                  id={'postal-code'}
                  type="number"
                  placeholder="1234"
                  className="form-control"
                  value={formData.companyAddress.postal_code}
                  onChange={(e) => handleFormField(e, 'companyAddress')}
                  name={'postal_code'}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="web-url">
                  {__('Website URL', 'easyjobs')}*
                </label>
                <input
                  id={'web-url'}
                  type="text"
                  className="form-control"
                  placeholder={__('Enter Website URL', 'easyjobs')}
                  value={formData.company.website}
                  onChange={(e) => handleFormField(e, 'company')}
                  name={'website'}
                />
                {basicInfoError && basicInfoError['company.website'] && (
                  <div className="error-message">
                    {capitalizeFirstLetter(
                      basicInfoError['company.website'][0],
                    )}
                  </div>
                )}
                <div className="form-group mb-0 mt-3">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name={'show_explore_company'}
                      checked={formData?.company?.show_explore_company}
                      onChange={(e) => handleFormField(e, 'company')}
                    />
                    <span>{__('Show explore button', 'easyjobs')}</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>{__('Language', 'easyjobs')}</label>
                <div className="select-option">
                  <Select
                    classNamePrefix="react-select"
                    isSearchable
                    isClearable
                    onChange={(e) => handleReactSelectInput(e, 'lang')}
                    options={languages}
                    onMenuOpen={getMetaData}
                    value={
                      formData.lang && formData.lang.code
                        ? {
                            label: formData.lang.name,
                            value: formData.lang.code,
                            data: formData.lang,
                          }
                        : ''
                    }
                  />
                </div>
              </div>
              <div className="form-group mb-0 mt-3">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name={'translate_user_input'}
                    checked={formData?.company?.translate_user_input}
                    onChange={(e) => handleFormField(e, 'company')}
                  />
                  <span>{__('Update Company Page', 'easyjobs')}</span>
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>{__('Time Zone', 'easyjobs')}</label>
                <div className="select-option">
                  <Select
                    classNamePrefix="react-select"
                    isSearchable
                    isClearable
                    onChange={(e) =>
                      handleReactSelectInput(e, 'time_zone', 'company')
                    }
                    options={timeZone}
                    onMenuOpen={getMetaData}
                    value={
                      formData.company.time_zone
                        ? {
                            label: formData.company.time_zone,
                            value: formData.company.time_zone,
                            data: formData.company.time_zone,
                          }
                        : ''
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>{__('Number of Employees*', 'easyjobs')}</label>
                <div className="select-option">
                  <Select
                    classNamePrefix="react-select"
                    isSearchable
                    isClearable
                    onChange={(e) =>
                      handleReactSelectInput(e, 'company_size', 'company')
                    }
                    options={companySize}
                    onMenuOpen={getMetaData}
                    value={selectedCompanySize ? selectedCompanySize : ''}
                  />
                </div>
                {basicInfoError && basicInfoError['company.company_size'] && (
                  <div className="error-message">
                    Please select company size
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="job_per_page">
                  {__('Show Jobs Per Page', 'easyjobs')}
                </label>
                {/*<input
                  id={'job_per_page'}
                  type="number"
                  min={1}
                  max={9999}
                  className="form-control"
                  placeholder={__('Show Jobs Per Page', 'easyjobs')}
                  value={formData.company.jobs_per_page}
                  onChange={(e) => handleFormField(e, 'company')}
                  name={'jobs_per_page'}
                />*/}
                <div className="">
                  <select
                    className="form-control job-per-page"
                    value={formData.company.jobs_per_page}
                    onChange={(e) => handleFormField(e, 'company')}
                    name={'jobs_per_page'}
                    id={'job_per_page'}
                  >
                    <option value="">All</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group mb-0 mt-3">
            <label>{__('Write Description', 'easyjobs')}</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              placeholder={__('Write company description here', 'easyjobs')}
              value={formData.company.description}
              onChange={(value) => handleEditorInput(value, 'description')}
            />
          </div>
          <div className="form-group mb-0 mt-3">
            <label>{__('Company Benefits', 'easyjobs')}</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              placeholder={__('Write company benefits here', 'easyjobs')}
              value={formData.company.benefits}
              onChange={(value) => handleEditorInput(value, 'benefits')}
            />
          </div>
          <div className="form-group mb-0 mt-3" id="show-job-filter">
            <label className="checkbox">
              <input
                type="checkbox"
                name={'show_job_filter'}
                checked={formData?.company?.show_job_filter}
                onChange={(e) => handleFormField(e, 'company')}
              />
              <span>Show job filter on company page</span>
            </label>
          </div>
          {formData?.company?.show_job_filter === true ? (
            <>
              <div className="form-group mb-0 mt-3" id="show-job-filter">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name={'show_location_filter'}
                    checked={formData?.company?.show_location}
                    onChange={(e) => handleFormField(e, 'company')}
                  />
                  <span>Show location filter on company page</span>
                </label>
              </div>
              {formData?.company?.show_location === true ? (
                <>
                  <div className="d-flex items-center gap15 mt-2 pl-4">
                    <div className="form-group mb-0">
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          name={'show_city_filter'}
                          checked={formData?.company?.show_city}
                          onChange={(e) => handleFormField(e, 'company')}
                        />
                        <span>City</span>
                      </label>
                    </div>
                    <div className="form-group mb-0">
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          name={'show_state_filter'}
                          checked={Number(formData?.company?.show_state)}
                          onChange={(e) => handleFormField(e, 'company')}
                        />
                        <span>State</span>
                      </label>
                    </div>
                    <div className="form-group mb-0">
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          name={'show_country_filter'}
                          checked={formData?.company?.show_country}
                          onChange={(e) => handleFormField(e, 'company')}
                        />
                        <span>Country</span>
                      </label>
                    </div>
                  </div>
                  {basicInfoError && (
                    <div className="error-message">
                      {capitalizeFirstLetter(basicInfoError)}
                    </div>
                  )}
                </>
              ) : (
                ''
              )}
            </>
          ) : (
            ''
          )}
          <div className="d-flex justify-content-end">
            <button
              className="button info-button mt-5"
              type="submit"
              data-testid="ej-settings-save"
            >
              {__('Save Changes', 'easyjobs')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BasicInfoTab;
