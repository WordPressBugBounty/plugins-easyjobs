import React from 'react';
import Select, { components, NoticeProps } from 'react-select';

const NoOptionsMessage = (props) => {
  return <components.NoOptionsMessage {...props} />;
};

function CustomSelect({
  options,
  onChange,
  isMulti,
  isClearable,
  isSearchable,
  placeholder,
  className,
  value,
}) {
  return (
    <Select
      components={{ NoOptionsMessage }}
      isMulti={isMulti}
      options={options}
      onChange={onChange}
      isClearable={isClearable}
      isSearchable={isSearchable}
      placeholder={placeholder}
      className={className}
      value={value}
    />
  );
}

export default CustomSelect;
