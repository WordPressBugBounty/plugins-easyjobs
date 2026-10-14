import React, { useEffect, useState } from 'react';
import { loginOptionsData, ejFieldTypes } from '../../../util/helper';
import { toast } from 'react-toastify';
const ApplySettingsTab = ({
  currentTab,
  loading,
  getApplySettings,
  applySettings,
  deleteCustomField,
  deletedField,
  saveApplySettings,
  formError,
  updateLoginAttachment,
}) => {
  const { __ } = wp.i18n;
  const [applyFields, setApplyFields] = useState([]);
  const [fieldError, setFieldError] = useState([]);
  const [loginOptions, setLoginOptions] = useState([]);
  const [allLoginOptions, setAllLoginOptions] = useState(loginOptionsData);
  const [error, setError] = useState({});
  const [confirmation, setConfirmation] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(undefined);
  const [showFieldTypesModal, setShowFieldTypesModal] = useState(false);
  const [emailAttached, setEmailAttached] = useState(false);
  const [fieldTypes, setFieldTypes] = useState(ejFieldTypes);
  const [customFieldId, setCustomFieldId] = useState('');

  useEffect(() => {
    getApplySettings();
  }, []);

  useEffect(() => {
    if (deletedField) {
      setApplyFields(applyFields.filter((field) => field.id !== deletedField));
      setConfirmation(false);
    }
  }, [deletedField]);

  useEffect(() => {
    if (applySettings) {
      // applySettings.all_options &&
      //   setAllLoginOptions(applySettings.all_options);
      if (applySettings?.login_option?.length > 0) {
        const updatedAllLoginOptions = allLoginOptions?.map((option) => ({
          ...option,
          selected: applySettings.login_option.includes(option.id),
        }));
        setAllLoginOptions([...updatedAllLoginOptions]);
      }
      applySettings?.custom_fields &&
        setApplyFields(applySettings.custom_fields);
      setEmailAttached(applySettings?.attach_resume_with_email);
    }
  }, [applySettings]);

  useEffect(() => {
    if (formError) {
      if (formError.hasOwnProperty('login_option')) {
        setError({ ...error, loginOption: formError.login_option[0] });
      }
    }
  }, [formError]);

  const removeField = (e, index) => {
    e.preventDefault();
    setConfirmation(true);
    setDeleteIndex(index);
  };

  const addField = (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    setApplyFields([
      ...applyFields,
      {
        title: '',
        id: null,
        field_name: '',
        type: 'select',
        active: true,
        meta: { allowed_types: [] },
      },
    ]);
  };

  const handleFieldNameInput = (e, i) => {
    const allFields = [...applyFields];
    allFields[i].title = e.target.value;
    allFields[i].field_name = e.target.value.trim().toLowerCase();
    setApplyFields(allFields);
  };

  const handleFieldTypeInput = (e, i) => {
    const allFields = [...applyFields];
    allFields[i].type = e.target.value;
    if (e.target.value === 'file') {
      allFields[i].meta = { allowed_types: [] };
    }
    setApplyFields(allFields);
  };

  const handleFieldActiveInput = (e, i) => {
    const allFields = [...applyFields];
    allFields[i].active = !allFields[i].active;
    setApplyFields(allFields);
  };

  const validateFields = () => {
    const errors = [];
    applyFields.map((each, index) => {
      const error = {};
      if (each.type === 'select') {
        error.type = __('Please select a field type.', 'easyjobs');
      }
      if (!each.title.length && !error.type) {
        error.title = __('Please provide field name.', 'easyjobs');
      }
      if (each.title.length > 50) {
        error.title = __(
          'Field name should not be more than 50 character.',
          'easyjobs',
        );
      }
      if (each.type === 'file' && each.meta.allowed_types.length <= 0) {
        error.allowed_types = __(
          'Please select at least one file type.',
          'easyjobs',
        );
      }
      if (Object.keys(error).length !== 0) {
        errors[index] = error;
      }
    });
    // if (applyFields.length > 1) {
    //   const lastField = applyFields.slice(-1)[0];
    //   if (lastField) {
    //     const hasDuplicate = applyFields.filter(
    //       (field) => field.title === lastField.title
    //     );
    //     if (hasDuplicate.length > 1) {
    //       errors[applyFields.length - 1] = {
    //         title: __('Please provide unique field name', 'easyjobs'),
    //       };
    //     }
    //   }
    // }

    if (errors.length) {
      setFieldError(errors);
      return false;
    }
    setFieldError([]);
    return true;
  };

  const handleLoginOption = (e, key) => {
    if (e.target.checked) {
      setLoginOptions([...loginOptions, key]);
      setError({ ...error, loginOption: '' });
    } else {
      setLoginOptions(loginOptions.filter((option) => option !== key));
    }
  };

  const saveApplySettingsData = (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    saveApplySettings({
      custom_fields: applyFields.map((field) => ({
        id: field.id,
        type: field.type,
        field_name: field.title.trim(),
        active: field.active,
        allowed_types: field?.meta?.allowed_types,
      })),
    });
  };

  const handleDeleteField = (e) => {
    e.preventDefault();
    const [field] = applyFields.filter((el, i) => i === deleteIndex);
    if (!field) {
      setConfirmation(false);
      return;
    }
    if (!field.id) {
      setApplyFields(applyFields.filter((el, i) => i !== deleteIndex));
      setConfirmation(false);
      return;
    }
    deleteCustomField(field.id);
  };

  const handleUpdate = (e, field) => {
    e.preventDefault();
    if (field === 'emailAttachment') {
      setEmailAttached(!emailAttached);
      updateLoginAttachment({
        id: 'attach_resume_with_email',
        selected: !emailAttached,
      });
    } else {
      const countTrueSelected = allLoginOptions.filter(
        (option) => option.selected,
      ).length;

      // Check if there is only one option with selected: true
      if (
        countTrueSelected === 1 &&
        allLoginOptions.find((option) => option.id === field).selected === true
      ) {
        toast.error('You must select at least one login option.');
        return;
      }
      const updatedLoginOptions = allLoginOptions.map((option) => {
        if (option.id === field) {
          return { ...option, selected: !option.selected };
        }
        return option;
      });
      setAllLoginOptions([...updatedLoginOptions]);
      const targetOption = allLoginOptions.find(
        (option) => option.id === field,
      );
      updateLoginAttachment({
        id: field,
        selected: !targetOption.selected,
      });
    }
  };

  const modifyData = (selectedFields) => {
    const fields = {
      allowedFileTypes: [...selectedFields],
      allowedFileTypeExtensionsWise: {
        images: {},
        documents: {},
        others: {},
      },
      isSelected: {
        documents:
          selectedFields.includes('pdf') ||
          selectedFields.includes('doc') ||
          selectedFields.includes('xls') ||
          selectedFields.includes('ppt'),
        images:
          selectedFields.includes('jpg') ||
          selectedFields.includes('jpeg') ||
          selectedFields.includes('png') ||
          selectedFields.includes('svg') ||
          selectedFields.includes('gif'),
        others:
          selectedFields.includes('mp3') ||
          selectedFields.includes('mp4') ||
          selectedFields.includes('zip'),
      },
      allDocumentsFieldSelected:
        selectedFields.includes('pdf') &&
        selectedFields.includes('doc') &&
        selectedFields.includes('xls') &&
        selectedFields.includes('ppt'),
      allImagesFieldSelected:
        selectedFields.includes('jpg') &&
        selectedFields.includes('jpeg') &&
        selectedFields.includes('png') &&
        selectedFields.includes('svg') &&
        selectedFields.includes('gif'),
      allOthersFieldSelected:
        selectedFields.includes('mp3') &&
        selectedFields.includes('mp4') &&
        selectedFields.includes('zip'),
      extensions: {
        documents: ['pdf', 'doc', 'xls', 'ppt'],
        images: ['jpg', 'jpeg', 'png', 'svg', 'gif'],
        others: ['mp3', 'mp4', 'zip'],
      },
    };
    setFieldTypes({
      ...fieldTypes,
      ...fields,
      allowedFileTypes: [...fields.allowedFileTypes],
      isSelected: { ...fields.isSelected },
    });
  };

  const handleFieldTypeModal = (e, field, index) => {
    e.preventDefault();
    setCustomFieldId(index);
    modifyData(field?.meta?.allowed_types);
    setShowFieldTypesModal(true);
  };

  const handleAllCheck = (e, fileTypes) => {
    const allowedTypes = [...fieldTypes.allowedFileTypes];
    if (e.target.checked) {
      const newAllowedTypes = [...allowedTypes, ...fileTypes];
      modifyData(newAllowedTypes);
    } else {
      const newAllowedTypes = allowedTypes.filter(
        (element) => !fileTypes.includes(element),
      );
      modifyData(newAllowedTypes);
    }
  };

  const handleFieldCheck = (e, type) => {
    const allowedTypes = [...fieldTypes.allowedFileTypes];
    if (e.target.checked) {
      const newAllowedTypes = [...allowedTypes, type];
      modifyData(newAllowedTypes);
    } else {
      const newAllowedTypes = allowedTypes.filter(
        (element) => element !== type,
      );
      modifyData(newAllowedTypes);
    }
  };

  const handleSaveSelectedFileTypes = (e) => {
    e.preventDefault();
    // Check if the index is valid
    if (customFieldId >= 0 && customFieldId < applyFields?.length) {
      // Create a new array with the modified element
      const newData = applyFields.map((item, index) => {
        if (index === customFieldId) {
          return {
            ...item,
            meta: {
              ...item.meta,
              allowed_types: [...fieldTypes?.allowedFileTypes],
            },
          };
        }
        return item;
      });
      setApplyFields(newData);
      setShowFieldTypesModal(false);
    }
  };

  return (
    <div
      className={`settings-content settings-tab ${
        currentTab === 'apply-Settings' ? 'active' : ''
      } ${loading ? 'ej-loading' : ''}`}
    >
      <div className="section-title-wrap mb-0 d-flex justify-content-between align-items-start">
        <div className="section-title margin-deliver">
          Candidate Apply Settings
        </div>
      </div>
      <div className="form-box apply-settings custom-fields">
        <div className="accordion ej-accordion mb-4" id="accordionExample">
          <div className="card max-w-100">
            <div className="card-header" id="headingOne-login">
              <button
                className="btn btn-link btn-block text-left"
                type="button"
                data-toggle="collapse"
                data-target="#collapseOne-login"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Login Options
              </button>
            </div>
            <div
              id="collapseOne-login"
              className="collapse show"
              aria-labelledby="headingOne"
              data-parent="#accordionExample"
            >
              <div className="card-body">
                <div className="notification__settings">
                  {allLoginOptions.length > 0 &&
                    allLoginOptions.map((option, index) => (
                      <div className="settings__item" key={'option' + index}>
                        <div className="item__content">
                          <h5 className="mb-1">
                            <i
                              className={`eicon-2 eicon-2-${option.e_icon}`}
                            ></i>{' '}
                            {option.title}
                          </h5>
                          <p>{option.hint}</p>
                        </div>
                        <div className="item__switch">
                          <label className="ej-switch">
                            <input type="checkbox" checked={option.selected} />
                            <span
                              className="switch__btn"
                              onClick={(e) => handleUpdate(e, option.id)}
                            >
                              {option.selected ? (
                                <span className="on">On</span>
                              ) : (
                                <span className="off">Off</span>
                              )}
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion ej-accordion mb-4" id="accordionExample-2">
          <div className="card max-w-100">
            <div className="card-header" id="headingOne-login">
              <button
                className="btn btn-link btn-block text-left"
                type="button"
                data-toggle="collapse"
                data-target="#collapseOne-attachment"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Attachment
              </button>
            </div>
            <div
              id="collapseOne-attachment"
              className="collapse show"
              aria-labelledby="headingOne"
              data-parent="#accordionExample-2"
            >
              <div className="card-body">
                <div className="notification__settings">
                  <div className="settings__item">
                    <div className="item__content">
                      <h5 className="mb-1">
                        <i className="eicon-2 eicon-2-document"></i>Attach
                        Resume With Email
                      </h5>
                      <p>
                        Enable this to get a copy of resume of the applicant
                        through email notification. This helps you to see the
                        resume without logging in to easy.jobs.
                      </p>
                    </div>
                    <div className="item__switch">
                      <label className="ej-switch">
                        <input type="checkbox" checked={emailAttached} />
                        <span
                          className="switch__btn"
                          onClick={(e) => handleUpdate(e, 'emailAttachment')}
                        >
                          {emailAttached ? (
                            <span className="on">On</span>
                          ) : (
                            <span className="off">Off</span>
                          )}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion ej-accordion" id="accordionExample-3">
          <div className="card max-w-100">
            <div className="card-header" id="headingOne-login">
              <button
                className="btn btn-link btn-block text-left"
                type="button"
                data-toggle="collapse"
                data-target="#collapseOne-apply"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Custom Apply Fields
              </button>
            </div>
            <div
              id="collapseOne-apply"
              className="collapse show"
              aria-labelledby="headingOne"
              data-parent="#accordionExample-3"
            >
              <div className="card-body">
                {applyFields && applyFields?.length === 0 && (
                  <div className="text-center">
                    <button
                      className="button info-button mx-auto"
                      onClick={addField}
                    >
                      Add Custom Field
                    </button>
                    <p className="pt-3">
                      With the help of this fields you can mention what users
                      have to upload.
                    </p>
                  </div>
                )}
                {applyFields &&
                  applyFields?.length > 0 &&
                  applyFields.map((field, index) => (
                    <div
                      className="custom-field-item"
                      key={'custom-apply-fields-' + index}
                    >
                      <div>
                        <label for="">Select Field Type</label>
                        <div className="select-option w-100">
                          <select
                            value={field?.type}
                            onChange={(e) => handleFieldTypeInput(e, index)}
                          >
                            <option value="select">Select a type</option>
                            <option value="text">Text</option>
                            <option value="file">File</option>
                          </select>
                        </div>
                        {fieldError[index] && fieldError[index].type && (
                          <div className={'error-message flex-1'}>
                            {fieldError[index].type}
                          </div>
                        )}
                      </div>
                      <div className="notification__settings custom-fields pt-2">
                        {field?.type !== 'select' && (
                          <div className="settings__item">
                            <div className="d-flex flex-wrap align-items-end">
                              <div className="form-group">
                                <label for="custom-field-0">
                                  Enter{' '}
                                  {field?.type === 'text' ? 'Text' : 'Attach'}{' '}
                                  Filed Title
                                </label>
                                <div className="input-group">
                                  <input
                                    id="custom-field-0"
                                    maxlength="50"
                                    type="text"
                                    placeholder="i.e: Tell us something about yourself"
                                    className="form-control"
                                    value={field?.title}
                                    onChange={(e) =>
                                      handleFieldNameInput(e, index)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="item__switch d-flex">
                                <label className="ej-switch">
                                  <input
                                    type="checkbox"
                                    checked={field.active}
                                  />
                                  <span
                                    className="switch__btn"
                                    onClick={(e) =>
                                      handleFieldActiveInput(e, index)
                                    }
                                  >
                                    {field.active ? (
                                      <span className="on">Show</span>
                                    ) : (
                                      <span className="off">Hide</span>
                                    )}
                                  </span>
                                </label>

                                <button className="control-button control-button--danger has_bg_color">
                                  <div
                                    className="control-button__icon"
                                    onClick={(e) => removeField(e, index)}
                                  >
                                    <i className="eicon e-delete"></i>
                                  </div>
                                </button>
                              </div>
                            </div>
                            {fieldError[index] && fieldError[index].title && (
                              <div className={'error-message flex-1'}>
                                {fieldError[index].title}
                              </div>
                            )}
                          </div>
                        )}
                        {field?.type === 'file' && (
                          <div>
                            <label className="d-block">File Types</label>
                            <p className="mb-2">
                              {field?.meta?.allowed_types &&
                                field.meta.allowed_types.join(', ')}
                            </p>
                            {fieldError[index] &&
                              fieldError[index].allowed_types && (
                                <div className={'error-message flex-1'}>
                                  {fieldError[index].allowed_types}
                                </div>
                              )}
                            <button
                              className="semi-button semi-button-info button-sm mb-2"
                              onClick={(e) =>
                                handleFieldTypeModal(e, field, index)
                              }
                            >
                              Choose
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              {applyFields && applyFields?.length > 0 && (
                <div className="custom-field-footer d-flex align-items-center justify-content-between px-4 py-3">
                  <button className="button info-button" onClick={addField}>
                    Add Another Field
                  </button>
                  <button
                    type="submit"
                    className="button info-button"
                    onClick={saveApplySettingsData}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {confirmation && (
        <div className="modal resize-image-modal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {__('Confirmation', 'easyjobs')}
                </h5>
              </div>
              <div className="modal-body">
                <p>
                  {__(
                    'Are you sure, you want to delete this field?',
                    'easyjobs',
                  )}
                </p>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={(e) => setConfirmation(false)}
                >
                  {__('No', 'easyjobs')}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteField}
                >
                  {__('Yes', 'easyjobs')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showFieldTypesModal && (
        <>
          <div className={`modal-backdrop fade show`}></div>
          <div className={`modal fade custom-fields show`}>
            <div
              className="modal-dialog modal-xl modal-dialog-centered"
              role="document"
            >
              <div className="modal-content">
                <form>
                  <div className="modal-header">
                    <h4 className="modal-title">Select File Formats</h4>
                    <button
                      type="button"
                      className="close"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowFieldTypesModal(false);
                      }}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="">
                        Mark the file formats that you want to collect from
                        candidate.
                      </label>
                    </div>
                    {fieldTypes && (
                      <div className="row row-cols-md-3">
                        <div className="col" key={`field-`}>
                          <div className="custom-field-card">
                            <div className="custom-field-card__head">
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  checked={fieldTypes.allDocumentsFieldSelected}
                                  onChange={(e) =>
                                    handleAllCheck(
                                      e,
                                      fieldTypes.extensions.documents,
                                    )
                                  }
                                />
                                <span>Document Types</span>
                              </label>
                            </div>
                            <div className="custom-field-card__body">
                              <ul>
                                {fieldTypes.extensions.documents.map(
                                  (type, i) => (
                                    <li key={`type-${i}`}>
                                      {
                                        <label className="checkbox">
                                          <input
                                            type="checkbox"
                                            checked={fieldTypes.allowedFileTypes.includes(
                                              type,
                                            )}
                                            onChange={(e) =>
                                              handleFieldCheck(e, type)
                                            }
                                          />
                                          <span>{type}</span>
                                        </label>
                                      }
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col" key={`field-`}>
                          <div className="custom-field-card">
                            <div className="custom-field-card__head">
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  checked={fieldTypes.allImagesFieldSelected}
                                  onChange={(e) =>
                                    handleAllCheck(
                                      e,
                                      fieldTypes.extensions.images,
                                    )
                                  }
                                />
                                <span>Image Types</span>
                              </label>
                            </div>
                            <div className="custom-field-card__body">
                              <ul>
                                {fieldTypes.extensions.images.map((type, i) => (
                                  <li key={`type-${i}`}>
                                    {
                                      <label className="checkbox">
                                        <input
                                          type="checkbox"
                                          checked={fieldTypes.allowedFileTypes.includes(
                                            type,
                                          )}
                                          onChange={(e) =>
                                            handleFieldCheck(e, type)
                                          }
                                        />
                                        <span>{type}</span>
                                      </label>
                                    }
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col" key={`field-`}>
                          <div className="custom-field-card">
                            <div className="custom-field-card__head">
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  checked={fieldTypes.allOthersFieldSelected}
                                  onChange={(e) =>
                                    handleAllCheck(
                                      e,
                                      fieldTypes.extensions.others,
                                    )
                                  }
                                />
                                <span>Other Types</span>
                              </label>
                            </div>
                            <div className="custom-field-card__body">
                              <ul>
                                {fieldTypes.extensions.others.map((type, i) => (
                                  <li key={`type-${i}`}>
                                    {
                                      <label className="checkbox">
                                        <input
                                          type="checkbox"
                                          checked={fieldTypes.allowedFileTypes.includes(
                                            type,
                                          )}
                                          onChange={(e) =>
                                            handleFieldCheck(e, type)
                                          }
                                        />
                                        <span>{type}</span>
                                      </label>
                                    }
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer d-flex justify-content-between">
                    <button
                      className="button semi-button-info"
                      onClick={(e) => {
                        e.preventDefault();
                        setCustomFieldId('');
                        setShowFieldTypesModal(false);
                      }}
                    >
                      Back
                    </button>
                    <button
                      className="button info-button"
                      type="submit"
                      onClick={(e) => handleSaveSelectedFileTypes(e)}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApplySettingsTab;
