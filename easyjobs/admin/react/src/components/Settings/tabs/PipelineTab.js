import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  customPipelineTypeList,
  ejLabelBGColor,
  stepTypeLabel,
} from '../../../util/helper';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const PipelineTab = ({
  currentTab,
  loading,
  getPipelineSetup,
  pipelineSetup,
  createPipeline,
  updatePipeline,
  updatedPipelines,
  deletePipeline,
  pipelineDeleted,
}) => {
  const [pipelines, setPipelines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalPipeline, setModalPipeline] = useState({});
  const [modalAction, setModalAction] = useState('');
  const [pipelineToDelete, setPipelineToDelete] = useState(undefined);
  const stepNameRef = useRef();
  const [stepType, setStepType] = useState('');
  const [idToUpdate, setIdToUpdate] = useState(undefined);
  const [isEditStep, setIsEditStep] = useState(false);
  const [stepIdToEdit, setStepIdToEdit] = useState(undefined);
  const [stepToEdit, setStepToEdit] = useState({});
  const [isVisibleTypeMenu, setIsVisibleTypeMenu] = useState(false);
  const dropdownRef = useRef(null);
  const [newStepName, setNewStepName] = useState('');
  const [isSetNewStepData, setIsSetNewStepData] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    stepName: '',
    stepTypeErr: '',
    stepNameEdit: '',
  });
  const [removeModalShowHide, setRemoveModalShowHide] = useState({
    display: 'none',
  });

  useEffect(() => {
    getPipelineSetup();
  }, []);

  useEffect(() => {
    pipelineSetup && setPipelines(pipelineSetup);
  }, [pipelineSetup]);

  useEffect(() => {
    updatedPipelines && setPipelines(updatedPipelines);
  }, [updatedPipelines]);

  useEffect(() => {
    pipelineDeleted &&
      setPipelines(pipelines.filter((e, i) => i !== pipelineToDelete)) &&
      setPipelineToDelete(undefined);
  }, [pipelineDeleted]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsVisibleTypeMenu(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (isEditStep) {
      const editableObject = modalPipeline.steps.find(
        (obj) => obj.edit === true,
      );
      const index = modalPipeline.steps.findIndex((obj) => obj.edit === true);
      setStepToEdit({ ...stepToEdit, ...editableObject });
      setStepIdToEdit(index);
    }
  }, [modalPipeline]);

  const hideModal = (e) => {
    e.preventDefault();
    setShowModal(false);
    setErrors({
      name: '',
      stepName: '',
      stepTypeErr: '',
      stepNameEdit: '',
    });
  };

  const handleUpdate = (e, index) => {
    e.preventDefault();
    setModalAction('edit');
    let modalData = pipelines.filter((e, i) => i === index).pop();
    modalData = { ...modalData, steps: [...modalData.steps] };
    setModalPipeline(modalData);
    setShowModal(true);
    setIdToUpdate(index);
  };

  const addStep = (e) => {
    e.preventDefault();
    if (stepNameRef.current.value.trim().length == 0) {
      setErrors({
        ...errors,
        stepName: 'Please enter pipeline step title.',
        stepTypeErr: '',
      });
      return;
    } else if (
      stepNameRef.current.value &&
      stepNameRef.current.value.trim().length < 4
    ) {
      setErrors({
        ...errors,
        stepName: 'Please enter step title at least 4 characters.',
        stepTypeErr: '',
      });
      return;
    }

    if (stepType === '') {
      setErrors({
        ...errors,
        stepName: '',
        stepTypeErr: 'Please select step type.',
      });
      return;
    }
    if (
      stepNameRef.current.value &&
      stepNameRef.current.value.trim().length > 3
    ) {
      const stepName = stepNameRef.current.value.trim();
      const steps = [
        ...modalPipeline.steps.map((stepName) => stepName.label.toLowerCase()),
      ];
      if (steps.includes(stepName.toLowerCase())) {
        setErrors({
          ...errors,
          stepName: 'Please enter a unique step title.',
          stepTypeErr: '',
        });
        return;
      }
      const index = modalPipeline.steps.length;
      setModalPipeline({
        ...modalPipeline,
        steps: [
          ...modalPipeline.steps,
          {
            label: stepName,
            index: index,
            type: parseInt(stepType),
            edit: false,
          },
        ],
      });
      stepNameRef.current.value = '';
      setNewStepName('');
      setStepType('');
      setIsSetNewStepData(false);
      setErrors({ ...errors, stepName: '', stepTypeErr: '', stepNameEdit: '' });
    }
  };

  const addPipeline = (e) => {
    e.preventDefault();
    setModalAction('create');
    setModalPipeline({
      name: '',
      steps: [
        { label: 'Applied', type: 1, index: 0 },
        { label: 'Selected', type: 99, index: 1 },
        { label: 'Rejected', type: 100, index: 2 },
      ],
    });
    setShowModal(true);
  };

  const savePipeline = (e) => {
    e.preventDefault();
    const { name } = modalPipeline;
    if (!name.trim()) {
      setErrors({
        ...errors,
        name: 'Please write pipeline name',
      });
      return;
    } else if (name.trim().length < 3) {
      setErrors({
        ...errors,
        name: 'Please enter pipeline name at least 3 characters.',
      });
      return;
    }
    if (modalAction === 'create') {
      createPipeline({
        ...modalPipeline,
        name: name.trim(),
      });
    } else {
      if (
        pipelines.filter((e, i) => i === idToUpdate).pop() === modalPipeline
      ) {
        toast.error('Nothing to update.');
        setShowModal(false);
        return;
      }
      updatePipeline({ ...modalPipeline, name: name.trim(), id: idToUpdate });
    }
    setShowModal(false);
    setErrors({
      name: '',
      stepName: '',
      stepTypeErr: '',
      stepNameEdit: '',
    });
  };

  const handleDeletePipeline = (e) => {
    e.preventDefault();
    const [pipeline] = pipelines.filter((e, i) => i === pipelineToDelete);
    delete pipeline.default;
    let steps = pipeline.steps;
    steps.forEach((step) => delete step.edit);
    pipeline.steps = steps;
    setRemoveModalShowHide({ display: 'none' });
    deletePipeline(pipeline, pipelineToDelete);
  };

  const handleDeletePipelineInit = (e, id) => {
    e.preventDefault();
    setPipelineToDelete(id);
    setRemoveModalShowHide({ display: 'block' });
  };

  const handleCancleRemove = (e) => {
    e.preventDefault();
    setRemoveModalShowHide({ display: 'none' });
  };

  const checkTypeExists = (type) => {
    for (const item of modalPipeline.steps) {
      if (type == 10) {
        return false;
      }
      if (item.type == type) {
        return true;
      }
    }
    return false;
  };

  const checkEditTypeExists = (type) => {
    const steps = [...modalPipeline.steps];
    steps.splice(stepIdToEdit, 1);
    steps.splice(stepIdToEdit, 0, stepToEdit);
    for (const item of steps) {
      if (type == 10) {
        return false;
      }
      if (item.type == type) {
        return true;
      }
    }
    return false;
  };

  const removePipelineStep = (e, index) => {
    e.preventDefault();
    const steps = [...modalPipeline.steps];
    steps.splice(index, 1);
    const updatedSteps = steps.map((step, i) => {
      return { ...step, index: i };
    });
    setModalPipeline({ ...modalPipeline, steps: updatedSteps });
  };

  const editPipelineStep = (e, index) => {
    e.preventDefault();
    setIsEditStep(true);
    if (isEditStep) {
      let objToUpdate = modalPipeline.steps[stepIdToEdit];
      objToUpdate.edit = false;
      modalPipeline.steps[stepIdToEdit] = objToUpdate;
    }
    setStepIdToEdit(index);
    let objToUpdate = modalPipeline.steps[index];
    objToUpdate.edit = true;
    modalPipeline.steps[index] = objToUpdate;
    setStepToEdit(modalPipeline.steps.filter((e, i) => i === index).pop());
  };

  const toggleTypeMenuVisibility = (e) => {
    e.preventDefault();
    setIsVisibleTypeMenu(!isVisibleTypeMenu);
  };

  const editStepSubmit = (e, index) => {
    e.preventDefault();
    if (stepToEdit.label.trim().length === 0) {
      setErrors({
        ...errors,
        stepNameEdit: 'Please enter the pipeline step title.',
      });
      return;
    } else if (stepToEdit.label.trim().length < 4) {
      setErrors({
        ...errors,
        stepNameEdit: 'Please enter step title at least 4 characters.',
      });
      return;
    } else {
      const steps = [
        ...modalPipeline.steps
          .filter((step) => step.index != stepToEdit.index)
          .map((stepName) => stepName.label.toLowerCase()),
      ];
      if (steps.includes(stepToEdit.label.toLowerCase())) {
        setErrors({
          ...errors,
          stepNameEdit: 'Please enter a unique step title.',
        });
        return;
      }
    }
    setErrors({
      name: '',
      stepName: '',
      stepTypeErr: '',
      stepNameEdit: '',
    });
    let objToUpdate = modalPipeline.steps[index];
    objToUpdate.edit = false;
    modalPipeline.steps[index] = objToUpdate;
    const steps = modalPipeline.steps;
    steps.splice(stepIdToEdit, 1);
    const editStep = { ...stepToEdit, edit: false };
    steps.splice(stepIdToEdit, 0, editStep);
    setModalPipeline({ ...modalPipeline, steps });
    setIsEditStep(false);
    setStepIdToEdit(undefined);
  };

  const handleTypeChange = (e) => {
    e.preventDefault();
    if (e.target.value || newStepName) {
      setIsSetNewStepData(true);
    } else {
      setIsSetNewStepData(false);
    }
    setErrors({ ...errors, stepTypeErr: '' });
    setStepType(e.target.value);
  };

  const handleNewStepName = (e) => {
    if (e.target.value || stepType) {
      setIsSetNewStepData(true);
    } else {
      setIsSetNewStepData(false);
    }
    setErrors({ ...errors, stepName: '' });
    setNewStepName(e.target.value);
  };

  const handleClearNewStepData = (e) => {
    e.preventDefault();
    setErrors({ ...errors, stepName: '', stepTypeErr: '' });
    setIsSetNewStepData(false);
    stepNameRef.current.value = '';
    setNewStepName('');
    setStepType('');
  };

  const handlePipelineNameChange = (e) => {
    setErrors({ ...errors, name: '' });
    setModalPipeline({
      ...modalPipeline,
      name: e.target.value,
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const { source, destination } = result;
    const updatedItems = Array.from(modalPipeline.steps);
    const [removed] = updatedItems.splice(source.index, 1); // Remove dragged item
    updatedItems.splice(destination.index, 0, removed); // Insert item at destination index
    setModalPipeline({ ...modalPipeline, steps: [...updatedItems] }); // Update state with new order
  };

  return (
    <div
      className={`settings-content settings-tab ${
        currentTab === 'pipeline' ? 'active' : ''
      } ${loading ? 'ej-loading' : ''}`}
    >
      <div className="section-title-wrap mb-0 d-flex justify-content-between align-items-start">
        <div className="section-title margin-deliver">Pipeline Setup</div>
        <button className="button primary-button" onClick={addPipeline}>
          Add New Pipeline
        </button>
      </div>
      <div className="data-table user-table">
        <div className="table-wrap">
          <div className="table">
            <div className="table__row table__head">
              <div className="table-cell text-center">No</div>
              <div className="table-cell">Name</div>
              <div className="table-cell">Steps</div>
              <div className="table-cell text-center">Actions</div>
            </div>
            {pipelines.map((each, i) => (
              <div className="table__row" key={`pi-${i}`}>
                <div className="table-cell pipeline-counter">
                  {i + 1 < 10 ? `0${i + 1}` : i + 1}
                </div>
                <div className="table-cell pipeline-name">{each.name}</div>
                <div className="table-cell pipeline-steps">
                  {each.steps && (
                    <ul>
                      {each.steps.map((step, index) => (
                        <li key={`step-${index}`}>{step?.label}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="table-cell pipeline-action">
                  <div className="d-flex align-items-center justify-content-center">
                    <a
                      href="#"
                      className="control-button control-button--primary has_bg_color"
                      onClick={(e) => handleUpdate(e, i)}
                    >
                      <div className="control-button__icon">
                        <i className="easyjobs-icon easyjobs-pencil"></i>
                      </div>
                      <span>Update</span>
                    </a>
                    {i !== 0 && (
                      <a
                        href="#"
                        className="control-button control-button--danger has_bg_color"
                        onClick={(e) => handleDeletePipelineInit(e, i)}
                      >
                        <div className="control-button__icon">
                          <i className="easyjobs-icon easyjobs-delete"></i>
                        </div>
                        <span>Delete</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show ej-react-modal pipeline-modal">
          <div
            role="document"
            className="modal-dialog modal-lg modal-dialog-centered"
          >
            <form onSubmit={savePipeline}>
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title text-uppercase">
                    {modalAction === 'create' ? 'Add' : 'Edit'} pipeline
                  </h4>
                  <button type="button" className="close" onClick={hideModal}>
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Pipeline Name*</label>
                    <input
                      type="text"
                      placeholder="Enter Pipeline Name"
                      className="form-control"
                      onChange={handlePipelineNameChange}
                      value={modalPipeline.name}
                    />
                    {errors.name && (
                      <div className="error-message">{errors.name}</div>
                    )}
                  </div>

                  <div className="form-group pipeline-step-list">
                    <label>Pipeline Steps</label>
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="droppable">
                        {(provided) => (
                          <div
                            className="pipeline-main-wrapper"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {modalPipeline?.steps?.map((stage, i) => (
                              <Draggable
                                key={stage.index}
                                draggableId={stage.index.toString()}
                                index={i}
                              >
                                {(provided) => (
                                  <div>
                                    {stepIdToEdit != i || !isEditStep ? (
                                      <div
                                        className="pipeline-item d-flex align-items-center gap-10"
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                      >
                                        <div className="title flex-grow-1">
                                          <p>{stage.label}</p>
                                        </div>
                                        <div className="stage-name">
                                          <span
                                            className={ejLabelBGColor(
                                              stage.type,
                                            )}
                                          >
                                            {stepTypeLabel(stage.type)}
                                          </span>
                                        </div>
                                        <div className="actions">
                                          <a
                                            href="#"
                                            className="edit"
                                            onClick={(e) =>
                                              editPipelineStep(e, i)
                                            }
                                          >
                                            <span className="easyjobs-icon easyjobs-pencil"></span>
                                          </a>
                                          {stage.type != 1 && (
                                            <a
                                              href="#"
                                              className="delete"
                                              onClick={(e) =>
                                                removePipelineStep(e, i)
                                              }
                                            >
                                              <span className="easyjobs-icon easyjobs-delete"></span>
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                      >
                                        <div className="pipeline-item pipeline-item--editable d-flex align-items-center gap-10">
                                          <div className="flex-grow-1">
                                            <input
                                              type="text"
                                              className="form-control"
                                              value={stepToEdit.label}
                                              onChange={(e) =>
                                                setStepToEdit({
                                                  ...stepToEdit,
                                                  label: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                          <div className="stage-name px-2 d-flex align-items-center">
                                            <div
                                              className="dropdown"
                                              onClick={(e) =>
                                                toggleTypeMenuVisibility(e)
                                              }
                                              ref={dropdownRef}
                                            >
                                              <a
                                                href="#"
                                                className={`${
                                                  stage.type != 1
                                                    ? 'dropdown-toggle'
                                                    : ''
                                                }`}
                                              >
                                                <span
                                                  className={ejLabelBGColor(
                                                    stepToEdit.type,
                                                  )}
                                                >
                                                  {stepTypeLabel(
                                                    stepToEdit.type,
                                                  )}
                                                </span>
                                              </a>
                                              {stage.type != 1 && (
                                                <div
                                                  className={`dropdown-menu ${
                                                    isVisibleTypeMenu
                                                      ? 'show'
                                                      : ''
                                                  }`}
                                                >
                                                  {customPipelineTypeList?.map(
                                                    (type) => {
                                                      return (
                                                        <a
                                                          className={`dropdown-item ${
                                                            checkEditTypeExists(
                                                              type.value,
                                                            )
                                                              ? 'disabled-drop-item'
                                                              : ''
                                                          }`}
                                                          href="#"
                                                          onClick={(e) =>
                                                            !checkEditTypeExists(
                                                              type.value,
                                                            ) &&
                                                            setStepToEdit({
                                                              ...stepToEdit,
                                                              type: type.value,
                                                            })
                                                          }
                                                        >
                                                          {type.label}
                                                        </a>
                                                      );
                                                    },
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div className="back-button m-0">
                                            <a
                                              href="javascript:void(0)"
                                              className="back-button__icon"
                                              onClick={(e) =>
                                                editStepSubmit(e, i)
                                              }
                                            >
                                              <i className="eicon e-checkmark"></i>
                                            </a>
                                          </div>
                                        </div>
                                        {errors.stepNameEdit && (
                                          <div className="error-message mb-2">
                                            {errors.stepNameEdit}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                  <div className="form-group row mb-0">
                    <div className="col-md-4">
                      <label>Title</label>
                      <input
                        type="text"
                        maxLength="50"
                        placeholder="New step title"
                        className="form-control"
                        name="add_new_stage"
                        ref={stepNameRef}
                        value={newStepName}
                        onChange={handleNewStepName}
                      />
                      {errors.stepName && (
                        <div className="error-message">{errors.stepName}</div>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label>Type</label>
                      <div className="select-option">
                        <select
                          className="form-control"
                          value={stepType}
                          onChange={handleTypeChange}
                        >
                          <option value="">Please Select</option>
                          {customPipelineTypeList?.map((type) => {
                            return (
                              <option
                                value={type.value}
                                disabled={checkTypeExists(type.value)}
                              >
                                {type.label}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      {errors.stepTypeErr && (
                        <div className="error-message">
                          {errors.stepTypeErr}
                        </div>
                      )}
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="d-none d-md-block">&nbsp;</label>
                        <div className="d-flex align-items-center add-step-action">
                          {isSetNewStepData && (
                            <span
                              className="search__remove"
                              onClick={handleClearNewStepData}
                            >
                              <i className="eicon e-close"></i>
                            </span>
                          )}
                          <button
                            className="button semi-button-info w-100"
                            onClick={addStep}
                          >
                            Add New
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <button
                    className="button semi-button-info"
                    onClick={hideModal}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="button info-button"
                    disabled={isEditStep}
                  >
                    {modalAction === 'create' ? 'Save' : 'Update'} Pipeline
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <div
        className="dg-wrapper ej-candidate-confirmation"
        id="ej-candidate-confirmation"
        style={removeModalShowHide}
      >
        <div className="dg-backdrop"></div>
        <div className="dg-container">
          <div className="dg-content-cont dg-content-cont--floating">
            <div className="dg-main-content">
              <div className="dg-view-wrapper">
                <div className="dg-content-body dg-content-body--has-title">
                  <h6 className="dg-title">Confirmation</h6>
                  <div className="dg-content">
                    Are you sure, you want to remove this Pipeline?
                  </div>
                </div>
                <div className="dg-content-footer">
                  <button
                    className="dg-btn dg-btn--cancel remove-rating-cancel"
                    onClick={handleCancleRemove}
                  >
                    <span>No</span>
                  </button>
                  <button
                    className="dg-btn dg-btn--ok dg-pull-right ej-candidate-action-confirm"
                    onClick={(e) => handleDeletePipeline(e)}
                  >
                    <span className="dg-btn-content">Yes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineTab;
