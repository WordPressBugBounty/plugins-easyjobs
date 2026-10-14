import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import DateTime from 'react-datetime';
import CreatableSelect from 'react-select/creatable';
import Cropper from 'react-easy-crop';
import getCroppedImg from './../../../util/imageCrop';
import Pagination from '../../../util/Pagination';
import { toast } from 'react-toastify';

const BasicInfoTab = ({
  createData,
  countryStates,
  cities,
  getStates,
  getCities,
  saveInfo,
  saveJobInfoErrors,
  jobId,
  basicInfo,
  updateJobInfo,
  getJobCategories,
  getJobSkills,
  allCategories,
  allSkills,
  getJobCountries,
  allCountries,
  isLoading,
  getJobTemplates,
  company,
  templates,
  getCompanyMetaData,
  companyMetadata,
  isCreateJob,
  saveCreatedState,
  createdState,
  saveCreatedCity,
  createdCity,
  reset,
}) => {
  const [formFields, setFormFields] = useState({
    title: '',
    details: '',
    responsibilities: '',
    category: {},
    vacancies: '',
    is_remote: false,
    job_type: {},
    remote_location_type: {},
    remote_countries: [],
    country: {},
    state: {},
    city: {},
    expire_at: '',
    employment_type: {},
    experience_level: {},
    salary_type: {},
    salary: '',
    salary_range: { min: '', max: '', currency: '' },
    salary_field_type: 1,
    office_time: '',
    skills: [],
    benefits: [],
    has_benefits: false,
    show_on_career_page: true,
    hideCoverPhoto: false,
    coverPhoto: undefined,
  });
  const [errors, setErrors] = useState({
    title: undefined,
    details: undefined,
    responsibilities: undefined,
    category: undefined,
    vacancies: undefined,
    is_remote: undefined,
    job_type: undefined,
    remote_location_type: undefined,
    country: undefined,
    state: undefined,
    city: undefined,
    expire_at: undefined,
    employment_type: undefined,
    experience_level: undefined,
    salary_type: undefined,
    salary: undefined,
    office_time: undefined,
    skills: undefined,
    benefits: undefined,
    has_benefits: undefined,
    show_on_career_page: undefined,
    hideCoverPhoto: undefined,
    coverPhoto: undefined,
  });

  const [visibleEditor, setVisibleEditor] = useState('details');
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [skills, setSkills] = useState([]);
  const [disableAddress, setDisableAddress] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [remoteLocation, setRemoteLocation] = useState([]);
  const [employmentType, setEmploymentType] = useState([]);
  const [salaryType, setSalaryType] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState([]);
  const [bannerImage, setBannerImage] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [coverImage, setCoverImage] = useState(undefined);
  const [preview, setPreview] = useState(undefined);
  const [showTemplate, setShowTemplate] = useState(false);
  const [jobTemplates, setJobTemplates] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(undefined);
  const [industries, setIndustries] = useState([]);
  const [totalTemplatesPage, setTotalTemplatesPage] = useState(1);
  const [templateSearch, setTemplateSearch] = useState(undefined);
  const [showOtherEmploymentTypeInput, setShowOtherEmploymentTypeInput] =
    useState(false);
  const [otherEmploymentType, setOtherEmploymentType] = useState('');
  const fileRef = useRef();
  const [salaryRange, setSalaryRange] = useState({
    min: '',
    max: '',
    currency: '',
  });
  const [isStateCityLoaded, setIsStateCityLoaded] = useState({
    stateLoaded: true,
    cityLoaded: true,
  });

  useEffect(() => {
    return () => {
      reset(['createdState', 'createdCity']);
    };
  }, []);

  useEffect(() => {
    if (coverImage) {
      setFormFields({ ...formFields, coverPhoto: coverImage });
      setPreview(coverImage);
    }
  }, [coverImage]);

  useEffect(() => {
    saveJobInfoErrors && setErrors(saveJobInfoErrors);
  }, [saveJobInfoErrors]);

  useEffect(() => {
    if (createData) {
      createData.meta &&
        setEmploymentType(
          createData.meta.employment_type.map((each) => ({
            label: each.name,
            value: each.id,
            data: each,
          })),
        );
      createData.meta &&
        setExperienceLevel(
          createData.meta.experience_level.map((each) => ({
            label: each.name,
            value: each.id,
            data: each,
          })),
        );
      createData.meta &&
        setSalaryType(
          createData.meta.salary_type.map((each) => ({
            label: each.name,
            value: each.id,
            data: each,
          })),
        );
      createData.meta &&
        setJobTypes(
          createData.meta.job_type.map((each) => ({
            label: each.name,
            value: each.id,
            data: each,
          })),
        );
      createData.meta &&
        setRemoteLocation(
          createData.meta.remote_location_type.map((each) => ({
            label: each.name,
            value: each.id,
            data: each,
          })),
        );
    }
  }, [createData]);

  useEffect(() => {
    allCountries &&
      setCountries(
        allCountries.map((each) => ({
          label: each.name,
          value: each.id,
          data: each,
        })),
      );
  }, [allCountries]);

  useEffect(() => {
    allCategories &&
      setCategories(
        allCategories.map((each) => ({
          label: each.group_name,
          options: each.opts.map((opt) => ({
            label: opt.name,
            value: opt.id,
            data: opt,
          })),
        })),
      );
  }, [allCategories]);

  useEffect(() => {
    allSkills &&
      setSkills(
        allSkills.map((each) => ({
          label: each.group_name,
          options: each.opts.map((opt) => ({
            label: opt.name,
            value: opt.id,
            data: opt,
          })),
        })),
      );
  }, [allSkills]);

  useEffect(() => {
    const options = [];
    countryStates &&
      // setStateOptions(
      //   countryStates.map((each) => ({
      //     label: each.name,
      //     value: each.id,
      //     data: each,
      //   }))
      // );

      countryStates.forEach((group) => {
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
    setStateOptions(options);
  }, [countryStates]);

  useEffect(() => {
    createdState && getStates(formFields.country.id);
    if (createdState) {
      let inputs = { ...formFields };
      inputs['state'] = { ...createdState };
      setFormFields(inputs);
    }
  }, [createdState]);

  useEffect(() => {
    const options = [];
    cities &&
      // setCityOptions(
      //   cities.map((each) => ({ label: each.name, value: each.id, data: each }))
      // );
      cities.forEach((group) => {
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
    setCityOptions(options);
  }, [cities]);

  useEffect(() => {
    createdCity && getCities(formFields?.country?.id, formFields?.state?.id);
    if (createdCity) {
      let inputs = { ...formFields };
      inputs['city'] = { ...createdCity };
      setFormFields(inputs);
    }
  }, [createdCity]);

  useEffect(() => {
    if (basicInfo && !isCreateJob) {
      const savedData = {
        ...basicInfo,
        title: basicInfo.title ? basicInfo.title : '',
        details: basicInfo.details ? basicInfo.details : '',
        responsibilities: basicInfo.responsibilities
          ? basicInfo.responsibilities
          : '',
        vacancies: basicInfo.vacancies ? basicInfo.vacancies : '',
        is_remote: basicInfo.is_remote,
        job_type: basicInfo.job_type,
        remote_location_type: basicInfo.remote_location_type,
        expire_at:
          basicInfo.expire_at && new Date(basicInfo.expire_at) >= new Date()
            ? basicInfo.expire_at
            : '',
        salary: basicInfo.salary ? basicInfo.salary : '',
        salary_range: basicInfo.salary_range
          ? basicInfo.salary_range
          : salaryRange,
        salary_field_type: basicInfo.salary_field_type
          ? basicInfo.salary_field_type
          : 1,
        office_time: basicInfo.office_time ? basicInfo.office_time : '',
        benefits: basicInfo.benefits,
        has_benefits: basicInfo.has_benefits,
        show_on_career_page: basicInfo.show_on_career_page,
        hideCoverPhoto: basicInfo.hideCoverPhoto,
        category: basicInfo.category,
        country: basicInfo.country,
        state: basicInfo.state,
        city: basicInfo.city,
        employment_type: basicInfo.employment_type,
        experience_level: basicInfo.experience_level,
        salary_type: basicInfo.salary_type,
        skills:
          basicInfo.skills &&
          basicInfo.skills.length &&
          basicInfo.skills.map((each) => ({ id: each.id, name: each.name })),
      };
      if (basicInfo.employment_type_other) {
        savedData.employment_type_other = basicInfo.employment_type_other;
        setOtherEmploymentType(basicInfo.employment_type_other);
        setShowOtherEmploymentTypeInput(true);
      }
      basicInfo.salary_range && setSalaryRange({ ...basicInfo.salary_range });
      setFormFields(savedData);

      basicInfo?.job_type?.id === 'remote' && setDisableAddress(true);
      basicInfo?.coverPhoto
        ? setPreview(basicInfo.coverPhoto)
        : basicInfo.banner_image && setPreview(basicInfo.banner_image);
    }
  }, [basicInfo]);

  useEffect(() => {
    if (
      !isCreateJob &&
      basicInfo?.job_type?.id === 'remote' &&
      remoteLocation.length > 0
    ) {
      let remoteLocationId = null;

      if (basicInfo?.remote_location_type?.id) {
        remoteLocationId = basicInfo.remote_location_type.id;
      } else if (
        typeof basicInfo?.remote_location_type === 'string' ||
        typeof basicInfo?.remote_location_type === 'number'
      ) {
        remoteLocationId = basicInfo.remote_location_type;
      }

      if (remoteLocationId) {
        const matchingOption = remoteLocation.find(
          (option) => String(option.value) === String(remoteLocationId),
        );
        if (matchingOption) {
          setFormFields((prev) => ({
            ...prev,
            remote_location_type: matchingOption.data,
          }));
        }
      }
    }
  }, [remoteLocation, basicInfo?.remote_location_type, isCreateJob]);

  useEffect(() => {
    if (templates) {
      if (templates.templates.data.length) {
        setTotalTemplatesPage(templates.templates.last_page);
        setJobTemplates(templates.templates.data);
      }
    }
  }, [templates]);

  useEffect(() => {
    if (company && company.industry) {
      setSelectedIndustry({
        label: company.industry.name,
        value: company.industry.id,
      });
    }
  }, [company]);

  useEffect(() => {
    if (companyMetadata && companyMetadata.company_type) {
      setIndustries([
        {
          label: '{All Industries}',
          value: 'all',
        },
        ...companyMetadata.company_type.map((each) => ({
          label: each.name,
          value: each.id,
        })),
      ]);
    }
  }, [companyMetadata]);

  useEffect(() => {
    if (isOtherEmploymentType(formFields.employment_type)) {
      setShowOtherEmploymentTypeInput(true);
    } else {
      clearOtherEmploymentTypeInput();
    }
  }, [formFields.employment_type]);

  const handleInput = (e, name) => {
    const inputs = { ...formFields };
    if (name === 'job_type') {
      inputs[name] = e.target.value;
      if ('remote' === e.target.value) {
        setDisableAddress(true);
      }
    } else if (name === 'expire_at') {
      if (typeof e === 'object' && e !== null) {
        inputs[name] = e?.format()?.valueOf();
      } else {
        inputs[name] = '';
      }
      setErrors({ ...errors, expire_at: undefined });
    } else if (name === 'hideCoverPhoto') {
      if (e.target.checked) {
        inputs[name] = 0;
      } else {
        inputs[name] = 1;
      }
    } else if (name === 'has_benefits') {
      inputs[name] = e.target.checked;
      inputs['benefits'] = e.target.checked;
    } else if (name === 'show_on_career_page') {
      inputs[name] = e.target.checked;
      inputs['show_on_career_page'] = e.target.checked;
    } else if (name === 'min') {
      const min = e.target.value >= 0 ? e.target.value : '';
      inputs['salary_range'] = { ...salaryRange, min: min };
      inputs['salary'] = '';
    } else if (name === 'max') {
      const max = e.target.value >= 0 ? e.target.value : '';
      inputs['salary_range'] = { ...salaryRange, max: max };
      inputs['salary'] = '';
    } else if (name === 'currency') {
      inputs['salary_range'] = { ...salaryRange, currency: e.target.value };
      inputs['salary'] = '';
    } else if (name === 'salary') {
      inputs[name] = e.target.value;
      inputs['salary_range'] = { min: '', max: '', currency: '' };
    } else {
      inputs[name] = e.target.value;
    }
    setSalaryRange({ ...inputs['salary_range'] });
    setFormFields(inputs);
  };

  const handleEditorInput = (value, name) => {
    setFormFields((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleReactSelectInput = (selected, name, dependencies) => {
    if (selected) {
      if (selected?.__isNew__ && name === 'city') {
        saveCreatedCity(
          formFields.country.id,
          formFields.state.id,
          selected.label,
        );
      }
      let inputs = { ...formFields };
      inputs[name] = selected.data;
      if (dependencies) {
        setFormFields({ ...inputs, ...dependencies });
      } else {
        setFormFields(inputs);
      }
    } else {
      let fields = { ...formFields };
      fields[name] = {};
      if (dependencies) {
        fields = { ...fields, ...dependencies };
      }
      setFormFields(fields);
    }
    if (selected && name === 'job_type' && selected?.data?.id === 'remote') {
      setDisableAddress(true);
      if (remoteLocation.length > 0 && !formFields.remote_location_type?.id) {
        let inputs = { ...formFields };
        inputs['job_type'] = selected.data;
        inputs['remote_location_type'] = remoteLocation[0].data;
        setFormFields(inputs);
        return;
      }
    } else {
      setDisableAddress(false);
    }
    if (name === 'country') {
      setIsStateCityLoaded({
        ...isStateCityLoaded,
        stateLoaded: false,
        cityLoaded: true,
      });
      if (!selected) {
        setIsStateCityLoaded({
          ...isStateCityLoaded,
          stateLoaded: true,
          cityLoaded: true,
        });
      }
    }
    if (
      formFields?.job_type?.id === 'remote' &&
      name === 'remote_location_type' &&
      selected?.data?.id === 'anywhere'
    ) {
      setDisableAddress(true);
    }
  };

  const showEditor = (e, name) => {
    e.preventDefault();
    setVisibleEditor(name);
  };

  const handleCountrySelect = (selected) => {
    if (selected) {
      getStates(selected.value);
      setIsStateCityLoaded({ ...isStateCityLoaded, stateLoaded: false });
    }
    setStateOptions([]);
    setCityOptions([]);
    handleReactSelectInput(selected, 'country', { state: {}, city: {} });
  };

  const handleStateSelect = (selected) => {
    if (selected) {
      if (selected?.__isNew__) {
        saveCreatedState(formFields.country.id, selected.label);
        getCities(formFields.country.id, 0);
        setIsStateCityLoaded({ ...isStateCityLoaded, cityLoaded: false });
      } else {
        getCities(formFields.country.id, selected.value);
        setIsStateCityLoaded({ ...isStateCityLoaded, cityLoaded: false });
      }
    }
    handleReactSelectInput(selected, 'state', { city: {} });
  };

  const customFormatCreateLabel = (inputValue, text) => {
    // Customize the label text for newly created options
    return `${text}`;
  };

  const handleSkills = (selected) => {
    if (selected && selected.length) {
      const skills = selected.map((skill, i) => {
        if (skill.__isNew__) {
          const newId = createData?.editing?.skills?.reduce(
            (acc, currentValue) => {
              if (acc.id) {
                return acc.id > currentValue.id ? acc : currentValue;
              } else {
                return currentValue;
              }
            },
            {},
          );
          return {
            id: newId.id + (i + 1),
            name: skill.label,
          };
        } else {
          if (skill.data) {
            return { ...skill.data };
          }
        }
      });
      setFormFields({ ...formFields, skills: skills });
    } else {
      setFormFields({ ...formFields, skills: [] });
    }
  };

  const handleSpecificCountries = (selected) => {
    if (selected && selected.length) {
      const selectedCountriesData = selected.map((country) => {
        if (country.data) {
          return { id: country.data.id, name: country.data.name };
        }
        return { id: country.value, name: country.label };
      });
      setFormFields({ ...formFields, remote_countries: selectedCountriesData });
    } else {
      setFormFields({ ...formFields, remote_countries: [] });
    }
  };

  const handleBannerUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerImage(url);
      setShowModal(true);
      toBase64(file);
    }
  };

  const toBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setCoverImage(reader.result);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) =>
    setCroppedAreaPixels(croppedAreaPixels);

  const saveCrop = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(bannerImage, croppedAreaPixels);
      setCoverImage(croppedImage);
      setShowModal(false);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

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

  const { __ } = wp.i18n;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formFields.job_type.id && jobTypes.length > 0) {
      formFields.job_type = jobTypes[0].data;
    }

    if (
      formFields.job_type.id === 'remote' &&
      !formFields.remote_location_type.id &&
      remoteLocation.length > 0
    ) {
      formFields.remote_location_type = remoteLocation[0].data;
    }

    if (formFields.salary_field_type != 1) {
      if (
        formFields.salary_range.min ||
        formFields.salary_range.max ||
        formFields.salary_range.currency
      ) {
        if (!formFields.salary_range.min) {
          setErrors({
            ...errors,
            salary: 'Please provide minimum salary range.',
          });
          toast.error('Please check inputs');
          return;
        } else if (!formFields.salary_range.max) {
          setErrors({
            ...errors,
            salary: 'Please provide maximum salary range.',
          });
          toast.error('Please check inputs');
          return;
        } else if (!formFields.salary_range.currency) {
          setErrors({ ...errors, salary: 'Please provide a currency.' });
          toast.error('Please check inputs');
          return;
        } else if (
          +formFields.salary_range.min >= +formFields.salary_range.max
        ) {
          setErrors({
            ...errors,
            salary: 'Please provide a valid salary range.',
          });
          toast.error('Please check inputs');
          return;
        }
      }
    }
    const submitData = {
      ...formFields,
      employment_type_other: otherEmploymentType,
    };

    if (jobId) {
      updateJobInfo(jobId, submitData);
      return;
    }
    saveInfo(submitData);
  };

  const getAllCategories = () => {
    !allCategories && getJobCategories();
  };

  const getAllSkills = () => {
    !allSkills && getJobSkills();
  };

  const getCountries = () => !allCountries && getJobCountries();

  const getInitialTemplates = (e) => {
    e.preventDefault();
    if (!industries.length) {
      getCompanyMetaData();
    }
    if (company) {
      setSelectedIndustry({
        label: company.industry.name,
        value: company.industry.id,
      });
    }
    getJobTemplates({
      industry_id: company && company.industry ? company.industry.id : null,
      page: 1,
      title: '',
    });
    setShowTemplate(true);
  };
  const handleSelectedTemplate = (e, index) => {
    e.preventDefault();
    const [jobContent] = jobTemplates.filter((each, i) => i === index);
    if (jobContent) {
      const data = {
        ...formFields,
        title: jobContent.title ? jobContent.title : '',
        details: jobContent.details ? jobContent.details : '',
        responsibilities: jobContent.responsibilities
          ? jobContent.responsibilities
          : '',
        vacancies: jobContent.vacancies ? jobContent.vacancies : '',
        is_remote: jobContent.is_remote,
        job_type: jobContent.job_type,
        remote_location_type: jobContent.remote_location_type,
        expire_at:
          jobContent.expire_at && new Date(basicInfo.expire_at) >= new Date()
            ? jobContent.expire_at
            : '',
        salary: jobContent.salary ? jobContent.salary : '',
        salary_range: jobContent.salary_range
          ? jobContent.salary_range
          : salaryRange,
        salary_field_type: jobContent.salary_field_type
          ? jobContent.salary_field_type
          : 1,
        office_time: jobContent.office_time ? jobContent.office_time : '',
        benefits: jobContent.benefits ? jobContent.benefits : [],
        has_benefits: jobContent.has_benefits ? jobContent.has_benefits : false,
        show_on_career_page: jobContent.show_on_career_page
          ? jobContent.show_on_career_page
          : true,
        hideCoverPhoto: jobContent.hideCoverPhoto
          ? jobContent.hideCoverPhoto
          : false,
        category: jobContent.category,
        country: jobContent.country,
        state: jobContent.state,
        city: jobContent.city,
        employment_type: jobContent.employment_type,
        experience_level: jobContent.experience_level,
        salary_type: jobContent.salary_type,
        skills:
          jobContent.skills &&
          jobContent.skills.length &&
          jobContent.skills.map((each) => ({ id: each.id, name: each.name })),
      };
      jobContent.salary_range && setSalaryRange({ ...jobContent.salary_range });
      setFormFields(data);
      closeTemplatesModal();
    }
  };

  const handleIndustryChange = (selected) => {
    setSelectedIndustry(selected);
    if (selected) {
      getJobTemplates({
        industry_id: selected.value,
        page: 1,
        title:
          (templateSearch && templateSearch.length && templateSearch) || '',
      });
    }
  };

  const getPaginatedTemplates = (page) => {
    getJobTemplates({
      industry_id: selectedIndustry.value,
      page: page,
      title: (templateSearch && templateSearch.length && templateSearch) || '',
    });
  };

  let typingTimer = null;

  const performSearch = (e) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      getJobTemplates({
        industry_id: selectedIndustry ? selectedIndustry.value : 'all',
        title: templateSearch,
        page: 1,
      });
    }, 500);
  };

  const closeTemplatesModal = (e) => {
    e && e.preventDefault();
    setShowTemplate(false);
    setSelectedIndustry(undefined);
    setTemplateSearch(undefined);
  };

  const isOtherEmploymentType = (selected) => {
    if (selected) {
      if (
        parseInt(selected.id) === 99 &&
        selected.name.toString().trim().toLowerCase() === 'other'
      ) {
        return true;
      }
    }
    return false;
  };
  const clearOtherEmploymentTypeInput = () => {
    setOtherEmploymentType('');
    setShowOtherEmploymentTypeInput(false);
  };

  const handleSalaryFieldTypeChange = (e) => {
    e.preventDefault();
    if (formFields.salary_field_type == 1) {
      setFormFields({
        ...formFields,
        salary_field_type: 2,
        salary: '',
        salary_range: { min: '', max: '', currency: '' },
      });
    } else {
      setFormFields({
        ...formFields,
        salary_field_type: 1,
        salary: '',
        salary_range: { min: '', max: '', currency: '' },
      });
    }
  };

  const handleAdd7Or30Days = (e, days) => {
    e.preventDefault();
    let newDate = '';
    if (formFields && !formFields.expire_at) {
      newDate = new Date();
      newDate.setDate(newDate.getDate() + days);
    } else {
      newDate = new Date(formFields.expire_at);
      newDate.setDate(newDate.getDate() + days);
    }
    setFormFields({ ...formFields, expire_at: newDate.toISOString() });
  };

  return (
    <div className="progress-tab basic-info">
      <form
        onSubmit={handleSubmit}
        className={showTemplate ? `ej-loading ` : ''}
      >
        <div className="form-box">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label
                  htmlFor="job-title"
                  className="w-100 d-flex justify-content-between"
                >
                  <span>{__('Job Title', 'easyjobs')}*</span>
                  <a
                    href="#"
                    className="ej-select-template-btn color-primary pull-right"
                    onClick={(e) => getInitialTemplates(e)}
                  >
                    Select a template
                  </a>
                </label>
                <input
                  id={'job-title'}
                  data-testid="ej-create-job-title"
                  type="text"
                  placeholder={__('Enter your job title...', 'easyjobs')}
                  className="form-control"
                  onChange={(e) => handleInput(e, 'title')}
                  value={formFields.title}
                />
                {errors.title && (
                  <div className="error-message">Please provide job title</div>
                )}
                <div className="form-note">
                  <span>{__('TIPS:', 'easyjobs')} </span>
                  {__(
                    'The job title is essential for your job post to attract the best candidates. Please type your job title. (Example: Senior Executive)',
                    'easyjobs',
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="text-editor__nav">
                <a
                  href="#"
                  className={`btn btn-sm ${
                    visibleEditor === 'details' ? 'active' : ''
                  }`}
                  onClick={(e) => showEditor(e, 'details')}
                >
                  Job Details*
                </a>
                <a
                  href="#"
                  className={`btn btn-sm ${
                    visibleEditor === 'responsibilities' ? 'active' : ''
                  }`}
                  onClick={(e) => showEditor(e, 'responsibilities')}
                >
                  Responsibilities
                </a>
              </div>
              <div className="form-group">
                {visibleEditor === 'details' && (
                  <div className="editor job-details">
                    <ReactQuill
                      modules={modules}
                      formats={formats}
                      placeholder={'Write job details here'}
                      onChange={(value) => handleEditorInput(value, 'details')}
                      value={formFields.details}
                    />
                    {errors.details && (
                      <div className="error-message">{errors.details}</div>
                    )}
                  </div>
                )}

                {visibleEditor === 'responsibilities' && (
                  <div className="editor job-responsibilities">
                    <ReactQuill
                      modules={modules}
                      formats={formats}
                      placeholder={'Write job responsibilities here'}
                      onChange={(value) =>
                        handleEditorInput(value, 'responsibilities')
                      }
                      value={formFields.responsibilities}
                    />
                    {errors.responsibilities && (
                      <div className="error-message">
                        {errors.responsibilities}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="row py-0">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="Vacancies">Vacancies</label>
                    <input
                      id={'Vacancies'}
                      type="number"
                      placeholder="Vacancies"
                      min={0}
                      className="form-control"
                      onChange={(e) => handleInput(e, 'vacancies')}
                      value={formFields.vacancies}
                    />
                    {errors.vacancies && (
                      <div className="error-message">{errors.vacancies}</div>
                    )}
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Job Type</label>
                    <div className="select-option">
                      <Select
                        classNamePrefix="react-select"
                        options={jobTypes}
                        isSearchable={true}
                        isClearable={true}
                        value={
                          formFields.job_type && formFields.job_type.id
                            ? {
                                label: formFields.job_type.name,
                                value: formFields.job_type.id,
                                data: formFields.job_type,
                              }
                            : undefined
                        }
                        onChange={(selected) =>
                          handleReactSelectInput(selected, 'job_type')
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {formFields?.job_type?.id === 'remote' && (
              <div
                className={`col-md-${
                  formFields?.remote_location_type?.name ===
                  'Choose specific countries'
                    ? 6
                    : 3
                }`}
              >
                <div className="form-group">
                  <label>Remote Location</label>
                  <div className="select-option">
                    <Select
                      classNamePrefix="react-select"
                      options={remoteLocation}
                      isSearchable={true}
                      isClearable={false}
                      value={
                        formFields.remote_location_type &&
                        (formFields.remote_location_type.id ||
                          formFields.remote_location_type.name)
                          ? {
                              label:
                                formFields.remote_location_type.name ||
                                formFields.remote_location_type.id,
                              value: formFields.remote_location_type.id,
                              data: formFields.remote_location_type,
                            }
                          : undefined
                      }
                      onChange={(selected) =>
                        handleReactSelectInput(selected, 'remote_location_type')
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            {!(
              formFields?.job_type?.id === 'remote' &&
              formFields?.remote_location_type?.name ===
                'Choose specific countries'
            ) && (
              <div
                className={`col-md-${
                  formFields?.job_type?.id === 'remote' ? 3 : 6
                }`}
              >
                <div className="form-group">
                  <label>Country</label>
                  <div className="select-option">
                    <Select
                      classNamePrefix="react-select"
                      options={countries}
                      isSearchable={true}
                      isClearable={true}
                      isDisabled={disableAddress}
                      onChange={(selected) => handleCountrySelect(selected)}
                      value={
                        (formFields.country &&
                          formFields.country.id && {
                            label: formFields.country.name,
                            value: formFields.country.id,
                            data: formFields.country,
                          }) || {
                          label: 'Select Country',
                          value: '',
                          data: '',
                        }
                      }
                      onMenuOpen={getCountries}
                      isLoading={isLoading}
                    />
                  </div>
                  {errors.country && (
                    <div className="error-message">{errors.country}</div>
                  )}
                </div>
              </div>
            )}
            <div className="col-md-3">
              <div className="form-group">
                <label>Expiry Date*</label>
                <div className="d-flex">
                  <div className="flex-grow-1 mr-2">
                    <div className="date-picker">
                      <DateTime
                        isValidDate={(currentDate) => {
                          return currentDate.isAfter(new Date());
                        }}
                        timeFormat={false}
                        closeOnSelect={true}
                        dateFormat={'MMMM D, YYYY'}
                        onChange={(e) => {
                          handleInput(e, 'expire_at');
                        }}
                        value={
                          (formFields.expire_at &&
                            new Date(formFields.expire_at)) ||
                          ''
                        }
                      />
                    </div>
                    {errors.expire_at && (
                      <div className="error-message">
                        Please select an expiry date.
                      </div>
                    )}
                  </div>
                  <div className="expire-date-button">
                    <button
                      className="btn semi-button-info btn-sm btn-block"
                      onClick={(e) => handleAdd7Or30Days(e, 7)}
                    >
                      +7 Days
                    </button>
                    <button
                      className="btn semi-button-info btn-sm btn-block"
                      onClick={(e) => handleAdd7Or30Days(e, 30)}
                    >
                      +30 Days
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>Show on Career Page</label>
                <div className="d-flex align-items-center">
                  <div className="custom-control custom-switch my-2">
                    <input
                      type="checkbox"
                      id="career-page"
                      value="true"
                      className="custom-control-input"
                      onChange={(e) => handleInput(e, 'show_on_career_page')}
                      checked={formFields?.show_on_career_page ? true : false}
                    />
                    <label
                      htmlFor="career-page"
                      className="custom-control-label"
                    >
                      {formFields?.show_on_career_page ? 'Yes' : 'No'}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {!(
              formFields?.job_type?.id === 'remote' &&
              formFields?.remote_location_type?.name ===
                'Choose specific countries'
            ) && (
              <div className="col-md-6">
                <div className="form-group">
                  <label>State</label>
                  <div className="select-option">
                    <CreatableSelect
                      classNamePrefix="react-select"
                      options={stateOptions}
                      isSearchable={true}
                      isClearable={false}
                      isDisabled={
                        disableAddress || isStateCityLoaded.stateLoaded
                      }
                      onChange={(selected) => handleStateSelect(selected)}
                      formatCreateLabel={(value) =>
                        customFormatCreateLabel(
                          value,
                          'Press Enter to add State',
                        )
                      }
                      value={
                        (formFields.state &&
                          formFields.state.id && {
                            label: formFields.state.name,
                            value: formFields.state.id,
                            data: formFields.state,
                          }) || {
                          label: 'Select State',
                          value: '',
                          data: '',
                        }
                      }
                    />
                  </div>
                  {errors.state && (
                    <div className="error-message">{errors.state}</div>
                  )}
                </div>
              </div>
            )}
            {formFields?.job_type?.id === 'remote' &&
              formFields?.remote_location_type?.name ===
                'Choose specific countries' && (
                <div className="col-md-6">
                  <div className="form-group mb-0">
                    <label>Countries</label>
                    <div className="select-option multiple">
                      <Select
                        classNamePrefix="react-select"
                        isSearchable
                        isClearable
                        isMulti
                        onChange={(selected) =>
                          handleSpecificCountries(selected)
                        }
                        options={countries}
                        value={
                          formFields.remote_countries &&
                          formFields.remote_countries.length
                            ? formFields.remote_countries.map((each) => ({
                                label: each.name,
                                value: each.id,
                                data: each,
                              }))
                            : []
                        }
                        onMenuOpen={getCountries}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                </div>
              )}
            <div className="col-md-6">
              <div className="form-group">
                <label>Category*</label>
                <div className="select-option">
                  <Select
                    classNamePrefix="react-select"
                    options={categories}
                    isSearchable={true}
                    isClearable={true}
                    onChange={(selected) =>
                      handleReactSelectInput(selected, 'category')
                    }
                    value={
                      (formFields.category &&
                        formFields.category.id && {
                          label: formFields.category.name,
                          value: formFields.category.id,
                          data: formFields.category,
                        }) ||
                      undefined
                    }
                    onMenuOpen={getAllCategories}
                    isLoading={isLoading}
                  />
                </div>
                {errors.category && (
                  <div className="error-message">{errors.category}</div>
                )}
              </div>
            </div>
            {!(
              formFields?.job_type?.id === 'remote' &&
              formFields?.remote_location_type?.name ===
                'Choose specific countries'
            ) && (
              <div className="col-md-6">
                <div className="form-group">
                  <label>City</label>
                  <div className="select-option">
                    <CreatableSelect
                      classNamePrefix="react-select"
                      options={cityOptions}
                      isSearchable={true}
                      isClearable={false}
                      isDisabled={
                        disableAddress || isStateCityLoaded.cityLoaded
                      }
                      formatCreateLabel={(value) =>
                        customFormatCreateLabel(
                          value,
                          'Press Enter to add City',
                        )
                      }
                      value={
                        formFields.city && formFields.city.id
                          ? {
                              label: formFields.city.name,
                              value: formFields.city.id,
                              data: formFields.city,
                            }
                          : {
                              label: 'Select City',
                              value: '',
                              data: '',
                            }
                      }
                      onChange={(selected) =>
                        handleReactSelectInput(selected, 'city')
                      }
                    />
                  </div>
                  {errors.city && (
                    <div className="error-message">{errors.city}</div>
                  )}
                </div>
              </div>
            )}
            <div className="col-md-12">
              <div className="form-group mb-0">
                <label>Add Skills*</label>
                <div className="select-option multiple">
                  <CreatableSelect
                    classNamePrefix="react-select"
                    isSearchable
                    isClearable
                    isMulti
                    onChange={(selected) => handleSkills(selected)}
                    options={skills}
                    value={
                      formFields.skills && formFields.skills.length
                        ? formFields.skills.map((each) => ({
                            label: each.name,
                            value: each.id,
                            data: each,
                          }))
                        : []
                    }
                    isLoading={isLoading}
                    onMenuOpen={getAllSkills}
                  />
                </div>
                {errors.skills && (
                  <div className="error-message">{errors.skills}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="form-box mt-30">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Employment Type*</label>
                <div className="d-flex w-100 align-items-center">
                  <div
                    className={
                      showOtherEmploymentTypeInput
                        ? 'select-option w-50'
                        : 'select-option w-100'
                    }
                  >
                    <Select
                      classNamePrefix="react-select"
                      options={employmentType}
                      isSearchable={true}
                      isClearable={true}
                      value={
                        formFields.employment_type &&
                        formFields.employment_type.id
                          ? {
                              label: formFields.employment_type.name,
                              value: formFields.employment_type,
                            }
                          : undefined
                      }
                      onChange={(selected) =>
                        handleReactSelectInput(selected, 'employment_type')
                      }
                    />
                  </div>
                  {showOtherEmploymentTypeInput && (
                    <div className="w-50 ml-1">
                      <input
                        type="text"
                        placeholder="Employment type"
                        className="form-control"
                        onChange={(e) => setOtherEmploymentType(e.target.value)}
                        value={otherEmploymentType}
                      />
                    </div>
                  )}
                </div>
                {errors.employment_type && (
                  <div className="error-message">{errors.employment_type}</div>
                )}
                {errors.employment_type_other && (
                  <div className="error-message">
                    {errors.employment_type_other}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Experiences Level</label>
                <div className="select-option">
                  <Select
                    classNamePrefix="react-select"
                    options={experienceLevel}
                    isSearchable={true}
                    isClearable={true}
                    value={
                      formFields.experience_level &&
                      formFields.experience_level.id
                        ? {
                            label: formFields.experience_level.name,
                            value: formFields.experience_level.id,
                            data: formFields.experience_level,
                          }
                        : undefined
                    }
                    onChange={(selected) =>
                      handleReactSelectInput(selected, 'experience_level')
                    }
                  />
                </div>
                {errors.experience_level && (
                  <div className="error-message">{errors.experience_level}</div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Salary Type*</label>
                <div className="select-option">
                  <Select
                    classNamePrefix="react-select"
                    options={salaryType}
                    isSearchable={true}
                    isClearable={true}
                    value={
                      formFields.salary_type && formFields.salary_type.id
                        ? {
                            label: formFields.salary_type.name,
                            value: formFields.salary_type.id,
                            data: formFields.salary_type,
                          }
                        : undefined
                    }
                    onChange={(selected) =>
                      handleReactSelectInput(selected, 'salary_type')
                    }
                  />
                </div>
                {errors.salary_type && (
                  <div className="error-message">{errors.salary_type}</div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <div className="d-flex justify-content-between">
                  <label htmlFor="Salary">
                    {formFields.salary_field_type == 1
                      ? 'Salary'
                      : 'Salary Range'}
                  </label>
                  <a
                    href="#"
                    className="color-primary fs14"
                    onClick={handleSalaryFieldTypeChange}
                  >
                    {formFields.salary_field_type == 1
                      ? 'Salary Range'
                      : 'Salary'}
                  </a>
                </div>
                {formFields.salary_field_type == 1 ? (
                  <input
                    id={'Salary'}
                    type="text"
                    placeholder="$1000 USD"
                    className="form-control"
                    onChange={(e) => handleInput(e, 'salary')}
                    value={formFields.salary}
                  />
                ) : (
                  <div className="d-flex flex-column flex-sm-row gap4 justify-content-between align-items-center">
                    <input
                      type="number"
                      id="Salary"
                      placeholder="min"
                      maxLength="50"
                      className="form-control"
                      onChange={(e) => handleInput(e, 'min')}
                      value={formFields.salary_range.min}
                    />
                    <input
                      type="number"
                      id="salary_range_max"
                      placeholder="max"
                      maxLength="50"
                      className="form-control"
                      onChange={(e) => handleInput(e, 'max')}
                      value={formFields.salary_range.max}
                    />
                    <input
                      type="text"
                      id="salary_range_currency"
                      placeholder="currency"
                      maxLength="10"
                      className="form-control"
                      onChange={(e) => handleInput(e, 'currency')}
                      value={formFields.salary_range.currency}
                    />
                  </div>
                )}
                {errors.salary && (
                  <div className="error-message">{errors.salary}</div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="Office-Time">Office Time</label>
                <input
                  id={'Office-Time'}
                  type="text"
                  className="datepicker form-control"
                  placeholder="[SUN - THU: 8:00 AM to 6:00 PM]"
                  onChange={(e) => handleInput(e, 'office_time')}
                  value={formFields.office_time}
                />
                {errors.office_time && (
                  <div className="error-message">{errors.office_time}</div>
                )}
                <div className="form-note">
                  <span className="text-capitalize">Hint: </span> type your
                  office time like [SUN - THU: 8:00 AM to 6:00 PM]
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Show Company Benefits?</label>
                <div className="d-flex align-items-center">
                  <div className="custom-control custom-switch my-2">
                    <input
                      type="checkbox"
                      id="has-benefits"
                      value="true"
                      className="custom-control-input"
                      onChange={(e) => handleInput(e, 'has_benefits')}
                      checked={formFields.has_benefits ? true : false}
                    />
                    <label
                      htmlFor="has-benefits"
                      className="custom-control-label"
                    >
                      {formFields.has_benefits ? 'Yes' : 'No'}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-box mt-30 p-4">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group mb-0">
                <div
                  className="thumbnail-upload"
                  style={{ backgroundImage: `url(${preview})` }}
                >
                  <div className="ej-switch">
                    <input
                      type="checkbox"
                      id="ai-enabled"
                      className="notify"
                      name="is_ai_enabled"
                      onChange={(e) => handleInput(e, 'hideCoverPhoto')}
                      checked={formFields.hideCoverPhoto ? false : true}
                    />
                    <label for="ai-enabled" className="switch__btn">
                      <span>{formFields.hideCoverPhoto ? 'Hide' : 'Show'}</span>
                    </label>
                  </div>
                  <label className="file-browse-button">
                    <span>Upload Banner Image</span>
                    <input
                      type="file"
                      className="myfile"
                      onChange={(e) => handleBannerUpload(e)}
                      ref={fileRef}
                      onClick={(e) => {
                        fileRef.current.value = '';
                      }}
                    />
                  </label>
                  {errors.office_time && (
                    <div className="error-message">{errors.office_time}</div>
                  )}
                  {showModal && (
                    <div className="modal resize-image-modal" tabIndex="-1">
                      <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Crop image</h5>
                            <button
                              type="button"
                              className="close"
                              onClick={(e) => setShowModal(false)}
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <div className="cropper-container">
                              <Cropper
                                image={bannerImage}
                                crop={crop}
                                zoom={zoom}
                                onCropChange={setCrop}
                                aspect={40 / 21}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropSize={{ width: 600, height: 315 }}
                              />
                            </div>
                          </div>
                          <div className="modal-footer justify-content-between">
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={(e) => setShowModal(false)}
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={saveCrop}
                            >
                              Save changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-gap d-flex justify-content-between">
          <button
            type="submit"
            className="button info-button ml-auto"
            data-testid="ej-create-job-save"
          >
            Save & Continue
          </button>
        </div>
      </form>
      {showTemplate && (
        <div className="modal fade show ej-react-modal" tabIndex="-1">
          <div
            role="document"
            className="modal-dialog modal-lg modal-dialog-centered"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title text-uppercase">Job templates</h4>
                <button
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                  className="close"
                  onClick={closeTemplatesModal}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <input
                        type="text"
                        id="job-title"
                        placeholder="search job template"
                        maxLength="150"
                        autoFocus="autofocus"
                        className="form-control"
                        onChange={(e) => setTemplateSearch(e.target.value)}
                        onKeyUp={performSearch}
                        onKeyDown={(e) => clearTimeout(typingTimer)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <div className="select-option">
                        <Select
                          classNamePrefix="react-select"
                          options={industries}
                          isSearchable={true}
                          isClearable={true}
                          value={selectedIndustry}
                          onChange={handleIndustryChange}
                          isLoading={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    className={`data-table user-table template-select-table ${
                      isLoading ? 'ej-loading' : ''
                    }`}
                  >
                    <div className="table-wrap">
                      <div className="table table-modal ej-job-templates">
                        {jobTemplates &&
                          jobTemplates.map((each, i) => (
                            <div
                              className="table__row pt-4 py-0"
                              key={`jt-${i}`}
                            >
                              <div className="table-cell pinter-select">
                                <a
                                  href="#"
                                  onClick={(e) => handleSelectedTemplate(e, i)}
                                >
                                  {each.title}
                                </a>
                              </div>
                              <div className="table-cell text-right my-0 py-0">
                                <a
                                  href="#"
                                  className="form-note color-primary"
                                  onClick={(e) => handleSelectedTemplate(e, i)}
                                >
                                  Select
                                </a>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button
                  data-dismiss="modal"
                  className="button semi-button-info"
                  onClick={closeTemplatesModal}
                >
                  back
                </button>
                <Pagination
                  showPagination={
                    templates &&
                    templates.templates &&
                    templates.templates.last_page > 1
                  }
                  total={totalTemplatesPage}
                  changeHandler={getPaginatedTemplates}
                  topMargin={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInfoTab;
