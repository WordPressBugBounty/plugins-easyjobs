import React, { useEffect, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  getAllPipelines,
  getPipelineTemplates,
  changePipeline,
  savePipeline,
} from '../../redux/actions/pipelineActions';
import {
  customPipelineTypeList,
  ejLabelBGColor,
  getFormatedDate,
  stepTypeLabel,
} from '../../util/helper';
import PipelineListBox from './PipelineListBox';
import PipelineBox from './PipelineBox';
import PipelineTopOptions from './PipelineTopOptions';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const mapStateToProps = (state) => {
  return {
    allPipeline: state.pipelines.allPipeline,
    loading: state.pipelines.loading,
    allPipelineTemplates: state.pipelines.allPipelineTemplates,
    pipelineJob: state.pipelines.pipelineJob,
    savedPipeline: state.pipelines.savedPipeline,
    loadingPipeline: state.pipelines.loadingPipeline,
    loadingModal: state.pipelines.loadingModal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllPipelines: (params) => dispatch(getAllPipelines(params)),
    getPipelineTemplates: () => dispatch(getPipelineTemplates()),
    changePipeline: (params) => dispatch(changePipeline(params)),
    savePipeline: (params) => dispatch(savePipeline(params)),
  };
};

const Pipeline = ({
  getAllPipelines,
  allPipeline,
  loading,
  pipelineJob,
  getPipelineTemplates,
  allPipelineTemplates,
  changePipeline,
  savePipeline,
  savedPipeline,
  loadingPipeline,
  loadingModal,
}) => {
  const { search } = useLocation();
  const ejJobId = new URLSearchParams(search).get('id');
  const [stepType, setStepType] = useState('');
  const [modalPipeline, setModalPipeline] = useState({ steps: [] });
  const stepNameRef = useRef();
  const [stepIdToEdit, setStepIdToEdit] = useState(undefined);
  const [isEditStep, setIsEditStep] = useState(false);
  const [stepToEdit, setStepToEdit] = useState({});
  const [isVisibleTypeMenu, setIsVisibleTypeMenu] = useState(false);
  const [newStepName, setNewStepName] = useState('');
  const [isSetNewStepData, setIsSetNewStepData] = useState(false);
  const dropdownRef = useRef(null);
  const [errors, setErrors] = useState({
    stepName: '',
    stepTypeErr: '',
    stepNameEdit: '',
  });

  useEffect(() => {
    getAllPipelines({ job_id: ejJobId });
    getPipelineTemplates();
  }, []);

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

  let firstPipeline = {};
  if (Array.isArray(allPipeline) && allPipeline.length && allPipeline[0]) {
    firstPipeline = allPipeline[0];
  }

  const filteredPipeline = allPipeline?.map((item, i) => ({
    index: i,
    id: item.id,
    label: item.label,
    type: item.type,
    edit: false,
    count: item.count,
  }));

  const [pipelines, setPipelines] = useState([]);

  useEffect(() => {
    setPipelines(filteredPipeline);
    setModalPipeline({ ...modalPipeline, name: '', steps: filteredPipeline });
  }, [allPipeline]);

  const [selectedCandidates, setSelectedCandidates] = useState(new Set());

  const handleCheckobxToggle = (e) => {
    const { checked, value } = e.target;
    const checkedCandidates = new Set([...selectedCandidates]);

    if (checked) {
      checkedCandidates.add(value);
    } else {
      checkedCandidates.delete(value);
    }

    setSelectedCandidates(checkedCandidates);
  };

  const handleMoveStage = (e, pipeline) => {
    e.preventDefault();
    changePipeline({
      pipeline_id: pipeline,
      applicants_id: Array.from(selectedCandidates),
      job_id: ejJobId,
    });
    setSelectedCandidates(new Set());
  };

  const handleStageSelect = (e) => {
    swal({
      title: 'Confirmation',
      text: "There are candidate(s) in some steps. If you change pipeline template, some candidates' will be be moved to 'Applied' step. Are you sure you want to make this change?",
      buttons: {
        cancel: {
          text: 'NO',
          value: null,
          visible: true,
          className: '',
          closeModal: true,
        },
        confirm: {
          text: 'YES',
          value: true,
          visible: true,
          className: '',
          closeModal: true,
        },
      },
    }).then(function (confirm) {
      if (confirm) {
        if (e.target.value === 'select') {
          return;
        } else {
          const optionValue = parseInt(e.target.value);
          const selectedTemplate = allPipelineTemplates[optionValue];
          setPipelines(selectedTemplate.steps);
          setModalPipeline({ ...modalPipeline, steps: selectedTemplate.steps });
        }
      }
    });
  };

  const [newStage, setNewStage] = useState('');
  const handleNewStage = (e) => {
    const { value } = e.target;
    setNewStage(value);
  };

  const savePipelineHandle = (e) => {
    e.preventDefault();
    savePipeline({
      form_data: modalPipeline,
      job_id: ejJobId,
    });
  };

  const removePipelineStep = (e, index, count) => {
    e.preventDefault();
    if (count) {
      swal({
        title: 'Confirmation',
        text: "There are candidate(s) in this step. If you delete this step some candidates will be moved to the 'Applied' step. Are you sure you want to make this change?",
        buttons: {
          cancel: {
            text: 'NO',
            value: null,
            visible: true,
            className: '',
            closeModal: true,
          },
          confirm: {
            text: 'YES',
            value: true,
            visible: true,
            className: '',
            closeModal: true,
          },
        },
      }).then(function (confirm) {
        if (confirm) {
          const steps = [...modalPipeline.steps];
          steps.splice(index, 1);
          const updatedSteps = steps.map((step, i) => {
            return { ...step, index: i };
          });
          setModalPipeline({ ...modalPipeline, steps: updatedSteps });
        }
      });
    } else {
      const steps = [...modalPipeline.steps];
      steps.splice(index, 1);
      const updatedSteps = steps.map((step, i) => {
        return { ...step, index: i };
      });
      setModalPipeline({ ...modalPipeline, steps: updatedSteps });
    }
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
            index,
            type: parseInt(stepType),
            count: 0,
            edit: false,
          },
        ],
      });
      stepNameRef.current.value = '';
      setStepType('');
      setIsSetNewStepData(false);
      setNewStepName('');
      setErrors({ ...errors, stepName: '', stepTypeErr: '', stepNameEdit: '' });
    }
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
          .filter((step) => step.index !== stepToEdit.index)
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
    <>
      <section
        data-testid="ej-pipeline-board"
        className={`pipeline-section ${
          loading || loadingModal ? 'ej-loading' : ''
        }`}
      >
        <PipelineTopOptions
          pipelineJob={pipelineJob}
          ejJobId={ejJobId}
          selectedCandidates={selectedCandidates}
          allPipeline={allPipeline}
          handleMoveStage={handleMoveStage}
        />
        <div className="section-title-wrap">
          <div className="active-pipeline pipeline-button">
            <span>{firstPipeline?.name}</span>
            <span className="candidates-number">{firstPipeline?.count}</span>
          </div>
          <div className="d-none d-md-block job-title">
            <div className="section-title">{pipelineJob?.title}</div>
            {pipelineJob && (
              <span className="section-label">
                {getFormatedDate(
                  pipelineJob?.expire_at,
                  'en-us',
                  'numeric',
                  'long',
                  'numeric',
                )}
              </span>
            )}
          </div>
          <div className="nav pipeline-toggler" id="nav-tab" role="tablist">
            <a
              className="toggler-button active"
              data-toggle="tab"
              href="#pipeline-box"
              role="tab"
              aria-controls="pipeline-box"
              aria-selected="true"
              data-job-id={pipelineJob?.id}
            >
              <div className="icon">
                <i className="easyjobs-icon easyjobs-thumbnail"></i>
              </div>
            </a>
            <a
              className="toggler-button"
              data-toggle="tab"
              href="#pipeline-list-box"
              role="tab"
              aria-controls="pipeline-list-box"
              aria-selected="true"
              data-job-id={ejJobId}
            >
              <div className="icon">
                <i className="easyjobs-icon easyjobs-trello"></i>
              </div>
            </a>
          </div>
        </div>
        <div className="tab-content pipeline-tab-content">
          <div id="pipeline-box" className="tab-pane fade show active">
            <PipelineBox
              allPipeline={allPipeline}
              selectedCandidates={selectedCandidates}
              handleCheckobxToggle={handleCheckobxToggle}
              loadingPipeline={loadingPipeline}
            />
          </div>
          <div id="pipeline-list-box" className="tab-pane fade">
            <PipelineListBox
              allPipeline={allPipeline}
              changePipeline={changePipeline}
              job_id={ejJobId}
              loadingPipeline={loadingPipeline}
            />
          </div>
        </div>
      </section>
      <div
        id="pipeline-modal"
        data-testid="ej-pipeline-modal"
        className="modal fade custom-fields pipeline-modal"
      >
        <div
          role="document"
          className={`modal-dialog modal-lg modal-dialog-centered ${
            loadingModal ? 'ej-loading' : ''
          }`}
        >
          <form className="save-pipeline">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title text-uppercase">
                  edit job pipeline
                </h4>
                <button
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                  className="close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                {allPipelineTemplates?.length && (
                  <div className="form-filter">
                    <div className="form-group flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <label>Select A Template</label>
                      </div>
                      <div className="select-option">
                        <select
                          className="ej-pipeline-template-select form-control"
                          onChange={handleStageSelect}
                        >
                          <option value="select" selected>
                            Select A Template
                          </option>
                          {allPipelineTemplates?.map((template, index) => {
                            return (
                              <option value={index}>{template?.name}</option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
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
                                      data-testid="ej-pipeline-stage-handle"
                                      className="pipeline-item d-flex align-items-center gap-10"
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      ref={provided.innerRef}
                                    >
                                      <div className="title flex-grow-1">
                                        <p>{stage.label}</p>
                                        {stage.count > 0 && (
                                          <p className="counter">
                                            {`${stage.count} ${
                                              stage.count > 1
                                                ? 'applicants are'
                                                : 'applicant is'
                                            }`}{' '}
                                            here
                                          </p>
                                        )}
                                      </div>
                                      <div className="stage-name">
                                        <span
                                          className={ejLabelBGColor(stage.type)}
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
                                              removePipelineStep(
                                                e,
                                                i,
                                                stage.count,
                                              )
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
                                                {stepTypeLabel(stepToEdit.type)}
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
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
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
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
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
                                disabled={
                                  modalPipeline.steps &&
                                  checkTypeExists(type.value)
                                }
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
                          data-testid="ej-pipeline-add-stage"
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
                  data-dismiss="modal"
                  className="button semi-button-info"
                >
                  Back
                </button>
                <button
                  data-dismiss="modal"
                  type="submit"
                  className="button info-button"
                  onClick={savePipelineHandle}
                  disabled={isEditStep}
                >
                  Save Pipeline
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Pipeline);
