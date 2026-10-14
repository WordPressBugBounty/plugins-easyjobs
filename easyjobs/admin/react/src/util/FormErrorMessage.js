import React from 'react';
import { hasFormError } from './helper';

const FormErrorMessage = ({ field, errors }) => {
  if (hasFormError(field, errors)) {
    return <div className="error-message">{errors[field]}</div>;
  }
  return '';
};

export default FormErrorMessage;
