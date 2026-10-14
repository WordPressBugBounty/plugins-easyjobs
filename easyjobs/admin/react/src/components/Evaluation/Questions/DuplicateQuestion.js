import React from 'react';
const DuplicateQuestion = () => {
  return (
    <div className="question-section section-gap-30">
      <div className="back-button">
        <a
          href="/company/question/group/"
          className="back-button__icon router-link-active"
        >
          <i className="eicon e-back"></i>
        </a>
        <div className="back-button__text text-capitalize">
          Back To All Question Set
        </div>
      </div>

      <div className="section-title mb-4 text-capitalize">
        Edit Question Set
      </div>

      <form className="evaluation-form">
        <div className="form-box form-filter">
          <div className="form-group row">
            <div className="col-md-9">
              <label className="text-capitalize">Set Name*</label>
              <input
                type="text"
                id="set_name"
                maxLength="250"
                placeholder="Question Set Name"
                required="required"
                autoFocus="autofocus"
                className="form-control"
              />
            </div>
            <div className="col-md-3">
              <div className="form-group mb-0">
                <label className="text-capitalize">Set Type*</label>
                <div className="select-option">
                  <select className="ej-candidate-job-select">
                    <option value="">Sort by</option>
                    <option value="">Sort by</option>
                    <option value="">Sort by</option>
                    <option value="">Sort by</option>
                    <option value="">Sort by</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group row mb-0">
            <div className="col-md-12">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                cols="30"
                rows="3"
                className="form-control"
              ></textarea>
              <div className="form-note mt-1">
                <span className="text-capitalize">note: </span>Only team members
                can see notes
              </div>
            </div>
          </div>
        </div>

        <div className="form-box mt-2 ">
          <div className="form-group">
            <label className="label-color">Instruction (optional)</label>
            <textarea className="form-control"></textarea>
          </div>
          <div className="form-note mt-1">
            <span className="text-capitalize">note: </span>Candidate will see
            this instruction before starting the quiz/assessment.
          </div>
        </div>

        <div className="screening-question-card">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="screening-question-card__title">Question: 1</h3>
            <div className="d-flex ml-auto align-items-center justify-content-end my-2">
              <a
                href="#"
                className="control-button control-button--info has_bg_color"
              >
                <div className="control-button__icon">
                  <i className="eicon e-plus"></i>
                </div>
                <span>Add Option</span>
              </a>
              <a
                href="#"
                className="control-button control-button--primary has_bg_color"
              >
                <div className="control-button__icon">
                  <i className="eicon e-arrow-down"></i>
                </div>
                <span>Move Down</span>
              </a>
              <a href="#" className="erase-button">
                <i className="eicon e-delete"></i>
                <span>Delete</span>
              </a>
            </div>
          </div>
          <div className="form-box">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group mb-0">
                  <label className="text-capitalize">Set Type*</label>
                  <div className="select-option">
                    <select className="ej-candidate-job-select">
                      <option value="">Sort by</option>
                      <option value="">Sort by</option>
                      <option value="">Sort by</option>
                      <option value="">Sort by</option>
                      <option value="">Sort by</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="form-group mb-0">
                  <div className="d-flex justify-content-between">
                    <label htmlFor="question-0">Type Your Question*</label>
                  </div>
                  <input
                    type="text"
                    maxLength="250"
                    name=""
                    id="question-0"
                    placeholder="Screening Question"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-3">
                <div className="form-group screening-question-answer">
                  <label>Option 1</label>
                  <div className="d-flex align-items-center">
                    <label className="checkbox">
                      <input type="checkbox" value="0" />
                      <span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="Option 1"
                      className="form-control"
                    />
                    <a href="javascript:void(0)" className="remove-button">
                      <i className="eicon e-close"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group screening-question-answer">
                  <label>Option 2</label>
                  <div className="d-flex align-items-center">
                    <label className="checkbox">
                      <input type="checkbox" value="1" />
                      <span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="Option 2"
                      className="form-control"
                    />
                    <a href="javascript:void(0)" className="remove-button">
                      <i className="eicon e-close"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-30">
          <button className="button primary-button button-icon text-capitalize">
            <span className="icon">
              <i className="eicon e-plus"></i>
            </span>
            <span className="text-capitalize">add question</span>
          </button>
        </div>

        <div className="section-gap d-flex">
          <button
            type="submit"
            className="button info-button ml-auto text-capitalize info-button"
          >
            Update Question Set
          </button>
        </div>
      </form>
    </div>
  );
};

export default DuplicateQuestion;
