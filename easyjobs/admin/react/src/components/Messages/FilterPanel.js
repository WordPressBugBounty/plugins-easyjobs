import { __ } from '@wordpress/i18n';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import Icon from './icons';
import { getCompanyJobs } from '../../redux/actions/candidateActions';

// Conversation hide-pipeline values (PIPELINE_TYPE in the app).
const PIPELINE = { SELECTED: 99, REJECTED: 100 };

// react-select menu is portaled to <body> so it isn't clipped by the panel's
// scroll container; keep it above the popover.
const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({ ...base, maxHeight: 200 }),
  // Neutral option highlight (replaces react-select's default bright blue).
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? 'rgba(89, 125, 252, .14)'
      : state.isFocused
      ? 'rgba(89, 125, 252, .07)'
      : '#fff',
    color: '#1d2339',
    cursor: 'pointer',
  }),
};

// Hide the vertical separator line in the control.
const selectComponents = { IndicatorSeparator: () => null };

const Check = ({ label, checked, disabled, onChange }) => (
  <label
    className={`ej-msg-check ${checked ? 'is-checked' : ''} ${
      disabled ? 'is-disabled' : ''
    }`}
  >
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
    <span className="ej-msg-check__box" aria-hidden="true">
      <Icon name="check2" size={12} strokeWidth={2.4} />
    </span>
    <span className="ej-msg-check__label">{label}</span>
  </label>
);

const FilterPanel = ({
  filters,
  onClose,
  onApply,
  companyJobs,
  fetchCompanyJobs,
}) => {
  const [jobOption, setJobOption] = useState(filters.jobOption || null);
  const [messageStatus, setMessageStatus] = useState(
    filters.message_status || ['read', 'unread'],
  );
  const [hidePipeline, setHidePipeline] = useState(filters.hide_pipeline || []);
  const [activeJobs, setActiveJobs] = useState(
    !!filters.active_jobs_applicants,
  );

  useEffect(() => {
    if (!companyJobs || !companyJobs.length) {
      fetchCompanyJobs();
    }
  }, []);

  const jobOptions = (companyJobs || []).map((j) => ({
    value: j.id,
    label: j.title || j.name || `#${j.id}`,
  }));

  // At least one of read/unread must stay checked.
  const toggleStatus = (val) => {
    setMessageStatus((cur) => {
      if (cur.includes(val)) {
        return cur.length === 1 ? cur : cur.filter((v) => v !== val);
      }
      return [...cur, val];
    });
  };
  const togglePipeline = (val) =>
    setHidePipeline((cur) =>
      cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val],
    );

  const readChecked = messageStatus.includes('read');
  const unreadChecked = messageStatus.includes('unread');
  const readDisabled = readChecked && !unreadChecked;
  const unreadDisabled = unreadChecked && !readChecked;

  const apply = () =>
    onApply({
      jobOption,
      message_status: messageStatus,
      hide_pipeline: hidePipeline,
      active_jobs_applicants: activeJobs,
    });

  const reset = () => {
    setJobOption(null);
    setMessageStatus(['read', 'unread']);
    setHidePipeline([]);
    setActiveJobs(false);
    onApply({
      jobOption: null,
      message_status: ['read', 'unread'],
      hide_pipeline: [],
      active_jobs_applicants: false,
    });
  };

  return (
    <div
      className="ej-msg-filters"
      role="dialog"
      aria-label={__('Filters', 'easyjobs')}
    >
      <span className="ej-msg-filters__arrow" aria-hidden="true" />

      <div className="ej-msg-filters__head">
        <h3>{__('Filters', 'easyjobs')}</h3>
        <button
          type="button"
          className="ej-msg-iconbtn"
          onClick={onClose}
          aria-label={__('Close', 'easyjobs')}
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="ej-msg-filters__body">
        <div className="ej-msg-field">
          <label>{__('Select Job', 'easyjobs')}</label>
          <Select
            classNamePrefix="ej-rs"
            options={jobOptions}
            value={jobOption}
            onChange={setJobOption}
            isClearable
            placeholder={__('Select option', 'easyjobs')}
            menuPortalTarget={
              typeof document !== 'undefined' ? document.body : null
            }
            styles={selectStyles}
            components={selectComponents}
            maxMenuHeight={200}
            noOptionsMessage={() => __('No jobs found', 'easyjobs')}
          />
        </div>

        {/* Manager selection is intentionally hidden — the plugin has no manager
            support, so the manager is always "Everybody". */}

        <div className="ej-msg-field">
          <label>{__('Message Status', 'easyjobs')}</label>
          <div className="ej-msg-checkrow">
            <Check
              label={__('Read', 'easyjobs')}
              checked={readChecked}
              disabled={readDisabled}
              onChange={() => toggleStatus('read')}
            />
            <Check
              label={__('Unread', 'easyjobs')}
              checked={unreadChecked}
              disabled={unreadDisabled}
              onChange={() => toggleStatus('unread')}
            />
          </div>
        </div>

        <div className="ej-msg-field">
          <label>{__('Hide Pipeline', 'easyjobs')}</label>
          <div className="ej-msg-checkrow">
            <Check
              label={__('Selected', 'easyjobs')}
              checked={hidePipeline.includes(PIPELINE.SELECTED)}
              onChange={() => togglePipeline(PIPELINE.SELECTED)}
            />
            <Check
              label={__('Rejected', 'easyjobs')}
              checked={hidePipeline.includes(PIPELINE.REJECTED)}
              onChange={() => togglePipeline(PIPELINE.REJECTED)}
            />
          </div>
        </div>

        <div className="ej-msg-field">
          <label>{__('Active Job Applicants', 'easyjobs')}</label>
          <div className="ej-msg-checkrow">
            <Check
              label={__('Active Jobs', 'easyjobs')}
              checked={activeJobs}
              onChange={(e) => setActiveJobs(e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div className="ej-msg-filters__foot">
        <button type="button" className="ej-msg-reset" onClick={reset}>
          <Icon name="refresh" size={15} />
          <span>{__('Reset', 'easyjobs')}</span>
        </button>
        <div className="ej-msg-filters__foot-right">
          <button
            type="button"
            className="ej-msg-btn ej-msg-btn--ghost"
            onClick={onClose}
          >
            {__('Cancel', 'easyjobs')}
          </button>
          <button
            type="button"
            className="ej-msg-btn ej-msg-btn--primary"
            onClick={apply}
          >
            {__('Apply', 'easyjobs')}
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  companyJobs: state.candidate.companyJobs,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCompanyJobs: () => dispatch(getCompanyJobs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
