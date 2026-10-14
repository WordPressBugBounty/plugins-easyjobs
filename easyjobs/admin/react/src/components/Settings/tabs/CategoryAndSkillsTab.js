import React, { useEffect, useState } from 'react';
//import moment from 'moment';
import Pagination from '../../../util/Pagination';
const CategoryAndSkillsTab = ({
  currentTab,
  loading,
  getSettingsSkills,
  getSettingsCategories,
  settingsCategories,
  settingsSkills,
  saveSettingsCategory,
  saveSettingsSkill,
  dataSaved,
  deleteCategory,
  deleteSkill,
}) => {
  const [categories, setCategories] = useState([]);
  const [categoryPagination, setCategoriesPagination] = useState({});
  const [skills, setSkills] = useState([]);
  const [skillPagination, setSkillPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBtnText, setModalBtnText] = useState('Add');
  const [modalAction, setModalAction] = useState('category');
  const [category, setCategory] = useState({ name: '', id: null });
  const [categoryError, setCategoryError] = useState(undefined);
  const [skill, setSkill] = useState({ name: '', id: null });
  const [skillError, setSkillError] = useState(undefined);
  const [deleteId, setDeleteId] = useState(undefined);
  const [confirmation, setConfirmation] = useState(false);

  useEffect(() => {
    getSettingsCategories(1);
    getSettingsSkills(1);
  }, []);

  useEffect(() => {
    if (typeof dataSaved !== 'undefined') {
      if (dataSaved) {
        setDeleteId(undefined);
        if (modalAction === 'category') {
          getSettingsCategories(1);
        }
        if (modalAction === 'skill') {
          getSettingsSkills(1);
        }
        hideModalActions();
      } else {
      }
    }
  }, [dataSaved]);

  useEffect(() => {
    if (settingsCategories) {
      settingsCategories.data && setCategories(settingsCategories.data);
      setCategoriesPagination({
        currentPage: settingsCategories.current_page,
        totalPage: settingsCategories.last_page,
      });
    }
  }, [settingsCategories]);

  useEffect(() => {
    if (settingsSkills) {
      settingsSkills.data && setSkills(settingsSkills.data);
      setSkillPagination({
        currentPage: settingsSkills.current_page,
        totalPage: settingsSkills.last_page,
      });
    }
  }, [settingsSkills]);

  const getDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  const hideModal = (e) => {
    e.preventDefault();
    hideModalActions();
  };

  const hideModalActions = () => {
    setShowModal(false);
    setCategoryError(undefined);
    setSkillError(undefined);
    setCategory({ name: '', id: null });
    setSkill({ name: '', id: null });
  };

  const addCategory = (e) => {
    e.preventDefault();
    setModalTitle('add category');
    setModalBtnText('add category');
    setModalAction('category');
    setShowModal(true);
  };

  const addSkill = (e) => {
    e.preventDefault();
    setModalTitle('add skill');
    setModalBtnText('add skill');
    setModalAction('skill');
    setShowModal(true);
  };

  const updateCategory = (e, id) => {
    e.preventDefault();
    const [cat] = categories.filter((cat) => cat.id === id);
    setCategory({ name: cat.name, id: cat.id });
    setModalTitle('Update category');
    setModalBtnText('Update category');
    setModalAction('category');
    setShowModal(true);
  };

  const updateSkill = (e, id) => {
    e.preventDefault();
    const [skill] = skills.filter((skill) => skill.id === id);
    setSkill({ name: skill.name, id: skill.id });
    setModalTitle('Update skill');
    setModalBtnText('Update skill');
    setModalAction('skill');
    setShowModal(true);
  };

  const handleCategoryDelete = (e, id) => {
    e.preventDefault();
    const [deleteItem] = categories.filter((cat) => cat.id === id);
    setModalAction('category');
    if (deleteItem.use_count) {
      setDeleteId(deleteItem.id);
      setConfirmation(true);
      return;
    }
    deleteCategory(deleteItem.id);
  };

  const handleSkillDelete = (e, id) => {
    e.preventDefault();
    const [deleteItem] = skills.filter((cat) => cat.id === id);
    setModalAction('skill');
    if (deleteItem.use_count) {
      setDeleteId(deleteItem.id);
      setConfirmation(true);
      return;
    }
    deleteSkill(deleteItem.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalAction === 'category') {
      if (!category.name.length) {
        setCategoryError('Please add category name');
        return;
      }
      if (hasDuplicate(category.name)) {
        setCategoryError('Please provide unique category name');
        return;
      }
      saveSettingsCategory({ ...category, name: category.name.trim() });
      setCategoryError(undefined);
    }
    if (modalAction === 'skill') {
      if (!skill.name.length) {
        setSkillError('Please add skill name');
        return;
      }
      if (hasDuplicate(skill.name)) {
        setSkillError('Please provide unique skill name');
        return;
      }
      saveSettingsSkill({ ...skill, name: skill.name.trim() });
      setCategoryError(undefined);
    }
  };
  const handleDelete = (e) => {
    e.preventDefault();
    if (modalAction === 'category') {
      deleteCategory(deleteId);
    }
    if (modalAction === 'skill') {
      deleteSkill(deleteId);
    }
    setConfirmation(false);
    setDeleteId(undefined);
  };

  const hasDuplicate = (name) => {
    let duplicates = undefined;
    if (modalAction === 'category') {
      duplicates = categories.filter((cat) => cat.name === name.trim());
    }
    if (modalAction === 'skill') {
      duplicates = skills.filter((skill) => skill.name === name.trim());
    }
    return duplicates && duplicates.length > 0;
  };
  return (
    <div
      className={`settings-content settings-tab ${
        currentTab === 'category-skill' ? 'active' : ''
      } ${loading ? 'ej-loading' : ''}`}
    >
      <div className="section-title-wrap mb-0 d-flex justify-content-between align-items-start">
        <div className="section-title margin-deliver">
          Manage Categories
          <div className="v-popover">
            <div className="trigger">
              <button className="ej__tooltip__button ml-1">
                <i className="easyjobs-icon easyjobs-question"></i>
              </button>
            </div>
          </div>
        </div>
        <button
          className="button primary-button text-capitalize button-icon"
          onClick={addCategory}
        >
          <span className="icon">
            <i className="easyjobs-icon easyjobs-plus"></i>
          </span>
          <span className="text-capitalize">Add Category</span>
        </button>
      </div>
      <div className="data-table user-table">
        {(categories.length && (
          <>
            <div className="table-wrap">
              <div className="table">
                <div className="table__row table__head">
                  <div className="table-cell">Category Name</div>
                  {/* <div className="table-cell text-center">Updated On</div> */}
                  <div className="table-cell text-center">Actions</div>
                </div>
                {categories.map((each, index) => (
                  <div className="table__row" key={`cat-${index}`}>
                    <div className="table-cell user__info">{each.name}</div>
                    {/* <div className="table-cell text-center">
                      {getDate(each.updated_at)}
                    </div> */}
                    <div className="table-cell user-action">
                      <div className="d-flex justify-content-center">
                        <button
                          className="control-button control-button--primary has_bg_color"
                          onClick={(e) => updateCategory(e, each.id)}
                        >
                          <div className="control-button__icon">
                            <i className="easyjobs-icon easyjobs-pencil"></i>
                          </div>
                          <span>Update</span>
                        </button>
                        <button
                          className="control-button control-button--danger has_bg_color"
                          onClick={(e) => handleCategoryDelete(e, each.id)}
                        >
                          <div className="control-button__icon">
                            <i className="easyjobs-icon easyjobs-delete"></i>
                          </div>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Pagination
              showPagination={categoryPagination.totalPage > 1}
              total={categoryPagination.totalPage}
              changeHandler={getSettingsCategories}
            />
          </>
        )) || <h4 className="empty-message">No Categories found</h4>}
      </div>
      <div className="section-title-wrap mb-0 d-flex justify-content-between align-items-start section-gap">
        <div className="section-title margin-deliver">Manage Skills</div>
        <button
          className="button primary-button text-capitalize button-icon"
          onClick={addSkill}
        >
          <span className="icon">
            <i className="easyjobs-icon easyjobs-plus"></i>
          </span>{' '}
          <span className="text-capitalize">Add Skills</span>
        </button>
      </div>
      <div className="data-table user-table">
        {(skills.length && (
          <>
            <div className="table-wrap">
              <div className="table">
                <div className="table__row table__head">
                  <div className="table-cell">Skill Name</div>
                  {/* <div className="table-cell text-center">Updated On</div> */}
                  <div className="table-cell text-center">Actions</div>
                </div>
                {skills.map((each, index) => (
                  <div className="table__row" key={`skill-${index}`}>
                    <div className="table-cell user__info">{each.name}</div>
                    {/* <div className="table-cell text-center">
                      {getDate(each.updated_at)}
                    </div> */}
                    <div className="table-cell user-action">
                      <div className="d-flex justify-content-center">
                        <button
                          className="control-button control-button--primary has_bg_color"
                          onClick={(e) => updateSkill(e, each.id)}
                        >
                          <div className="control-button__icon">
                            <i className="easyjobs-icon easyjobs-pencil"></i>
                          </div>
                          <span>Update</span>
                        </button>
                        <button
                          className="control-button control-button--danger has_bg_color"
                          onClick={(e) => handleSkillDelete(e, each.id)}
                        >
                          <div className="control-button__icon">
                            <i className="easyjobs-icon easyjobs-delete"></i>
                          </div>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Pagination
              showPagination={skillPagination.totalPage > 1}
              total={skillPagination.totalPage}
              changeHandler={getSettingsSkills}
            />
          </>
        )) || <h4 className="empty-message">No skills found.</h4>}
      </div>
      {showModal && (
        <div className="modal fade show ej-react-modal">
          <div
            role="document"
            className="modal-dialog modal-md modal-dialog-centered"
          >
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title text-uppercase">{modalTitle}</h4>
                  <button type="button" className="close" onClick={hideModal}>
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  {(modalAction === 'category' && (
                    <div className="form-group">
                      <label htmlFor="name">Category Name*</label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Category Name"
                        className="form-control"
                        value={category.name}
                        onChange={(e) =>
                          setCategory({ ...category, name: e.target.value })
                        }
                      />
                      {categoryError && (
                        <div className="error-message">{categoryError}</div>
                      )}
                    </div>
                  )) || (
                    <div className="form-group">
                      <label htmlFor="name">Skill Name*</label>
                      <input
                        type="text"
                        id="skill_name"
                        placeholder="Skill Name"
                        className="form-control"
                        value={skill.name}
                        onChange={(e) =>
                          setSkill({ ...skill, name: e.target.value })
                        }
                      />
                      {skillError && (
                        <div className="error-message">{skillError}</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <button
                    className="button semi-button-info"
                    onClick={hideModal}
                  >
                    Back
                  </button>
                  <button type="submit" className="button info-button">
                    {modalBtnText}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {confirmation && (
        <div className="modal resize-image-modal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmation</h5>
              </div>
              <div className="modal-body">
                <p>
                  This {modalAction} is used in one or many jobs. Are you sure,
                  you want to remove this {modalAction}?
                </p>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={(e) => setConfirmation(false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryAndSkillsTab;
