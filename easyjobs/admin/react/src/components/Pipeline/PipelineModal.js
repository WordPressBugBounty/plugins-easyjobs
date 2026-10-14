import React from 'react';
import {
  customPipelineTypeList,
  stepTypeLabel,
  ejLabelBGColor,
} from '../../util/helper';

const PipelineModal = ({
  allPipelineTemplates,
  handleStageSelect,
  pipelines,
  deleteStage,
  newStage,
  handleNewStage,
  errMessage,
  addNewStage,
  savePipelineHandle,
  loadingModal,
}) => {
  return (
    <div
      id="pipeline-modal"
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
              <h4 className="modal-title text-uppercase">edit job pipeline</h4>
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
                <div className="pipeline-main-wrapper">
                  {pipelines?.map((stage) => {
                    return (
                      <div>
                        <div className="pipeline-item d-flex align-items-center gap-10">
                          <div className="title flex-grow-1">
                            <p>{stage.label}</p>
                          </div>
                          <div className="stage-name">
                            <span className={ejLabelBGColor(stage.label)}>
                              {stepTypeLabel(stage.type)}
                            </span>
                          </div>
                          <div className="actions">
                            {stage.type !== 1 && (
                              <a href="#" className="edit">
                                <span className="easyjobs-icon easyjobs-pencil"></span>
                              </a>
                            )}
                            <a href="#" className="delete">
                              <span className="easyjobs-icon easyjobs-delete"></span>
                            </a>
                          </div>
                        </div>
                        {/*<div className="pipeline-item pipeline-item--editable d-flex align-items-center gap-10">*/}
                        {/*  <div className="flex-grow-1">*/}
                        {/*    <input type="text" className="form-control" />*/}
                        {/*  </div>*/}
                        {/*  <div className="stage-name px-2 d-flex align-items-center">*/}
                        {/*    <div className="dropdown" >*/}
                        {/*      <a href="#" className="dropdown-toggle" >*/}
                        {/*        <span className="primary-label">hello</span>*/}
                        {/*      </a>*/}
                        {/*      <div className="dropdown-menu show">*/}
                        {/*        <a  className="dropdown-item" href="#">*/}
                        {/*          pipeline.label*/}
                        {/*        </a>*/}
                        {/*        <a  className="dropdown-item" href="#">*/}
                        {/*          pipeline.label*/}
                        {/*        </a>*/}
                        {/*      </div>*/}
                        {/*    </div>*/}
                        {/*  </div>*/}
                        {/*  <div className="back-button m-0">*/}
                        {/*    <a href="javascript:void(0)" className="back-button__icon"><i className="eicon e-checkmark"></i></a>*/}
                        {/*  </div>*/}
                        {/*</div>*/}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/*<div className="form-group row">*/}
              {/*  <div className="col-md-12">*/}
              {/*    <label>New Pipeline Step Name</label>*/}
              {/*  </div>*/}
              {/*  <div className="col-md-9">*/}
              {/*    <input*/}
              {/*      type="text"*/}
              {/*      placeholder="New step title"*/}
              {/*      className="form-control"*/}
              {/*      id="add_new_stage"*/}
              {/*      name="add_new_stage"*/}
              {/*//       value={newStage}*/}
              {/*//       onChange={handleNewStage}*/}
              {/*//     />*/}
              {/*    <div className="error-message">{errMessage}</div>*/}
              {/*  </div>*/}
              {/*  <div className="col-md-3">*/}
              {/*    <button*/}
              {/*      className="button semi-button-info w-100 add-new-stage"*/}
              {/*      onClick={addNewStage}*/}
              {/*    >*/}
              {/*      Add New*/}
              {/*    </button>*/}
              {/*  </div>*/}
              {/*</div>*/}
              <div className="form-group row mb-0">
                <div className="col-md-4">
                  <label>Title</label>
                  <input
                    type="text"
                    maxLength="50"
                    placeholder="New step title"
                    className="form-control"
                  />
                  <div className="error-message"></div>
                </div>
                <div className="col-md-4">
                  <label>Type</label>
                  <div className="select-option">
                    <select className="form-control">
                      <option value="">Please Select</option>
                      {customPipelineTypeList?.map((type) => {
                        return <option value={type.value}>{type.label}</option>;
                      })}
                    </select>
                  </div>
                  <div className="error-message"></div>
                </div>
                <div className="col-md-4">
                  <label>&nbsp;</label>
                  <div className="d-flex align-items-center add-step-action">
                    <button className="button semi-button-info w-100">
                      Add New
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <button data-dismiss="modal" className="button semi-button-info">
                Back
              </button>
              <button
                type="submit"
                className="button info-button"
                onClick={savePipelineHandle}
              >
                Save Pipeline
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PipelineModal;

{
  /*<div className="input-wrapper pipeline-wrapper">*/
}
{
  /*  <input*/
}
{
  /*    type="text"*/
}
{
  /*    name="pipeline[]"*/
}
{
  /*    disabled={*/
}
//       stage?.name?.toLowerCase() === 'applied'
//         ? true
//         : false
{
  /*    }*/
}
{
  /*    readOnly={*/
}
{
  /*      stage?.name?.toLowerCase() === 'applied'*/
}
{
  /*        ? false*/
}
//         : true
//     }
//     className={`form-control pipeline-stage ${
//       stage?.name?.toLowerCase() === 'applied'
//         ? 'default-step'
//         : ''
//     }`}
//     value={stage?.name}
//     data-stage-id={stage?.id}
//   />
//   {!stage?.is_fixed && (
//     <a
//       href="#"
//       className="input-wrapper-append delete-stage"
//       draggable="false"
{
  /*      onClick={() => deleteStage(stage?.name)}*/
}
{
  /*    >*/
}
{
  /*      <i className="easyjobs-icon easyjobs-delete"></i>*/
}
{
  /*    </a>*/
}
{
  /*  )}*/
}
{
  /*</div>*/
}
