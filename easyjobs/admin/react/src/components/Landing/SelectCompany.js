import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from 'react';

const SelectCompany = ({ signInData, connectApiKey }) => {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState(undefined);
  useEffect(() => {
    if (signInData && signInData.companies) {
      setCompanies(signInData.companies);
    }
  }, [signInData]);
  const handleCompanySelect = (e) => {
    e.preventDefault();
    if (selected) {
      connectApiKey(selected);
    }
  };
  return (
    <div className="company-select">
      <form className="ej-company-select-form" onSubmit={handleCompanySelect}>
        <div className="form-group">
          <label>{__('Select Company', 'easyjobs')}</label>
          <select
            name="select_company"
            className="form-control"
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="0" disabled selected>
              {__('Select Company', 'easyjobs')}
            </option>
            {companies &&
              companies.map((company, i) => (
                <option value={company.value}>{company.name}</option>
              ))}
          </select>
        </div>
        <button type="submit" name="submit" className="button info-button">
          {__('Save', 'easyjobs')}
        </button>
      </form>
    </div>
  );
};

export default SelectCompany;
