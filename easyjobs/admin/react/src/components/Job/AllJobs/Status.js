import { __ } from '@wordpress/i18n';
import React from 'react';

const Status = ({ job }) => {
  if (job?.is_internal) {
    return (
      <span className="status-badge status-badge--primary">
        {__('Internal', 'easyjobs')}
      </span>
    );
  }

  switch (job?.status) {
    case 1:
      return (
        <span className="status-badge status-badge--warning">
          {__('Draft', 'easyjobs')}
        </span>
      );
    case 3:
      return (
        <span className="status-badge status-badge--info">
          {__('Archived', 'easyjobs')}
        </span>
      );
    case 4:
      return (
        <span className="status-badge status-badge--danger">
          {__('Deleted', 'easyjobs')}
        </span>
      );
    case 10:
      return (
        <span className="status-badge status-badge--success">
          {__('Republished', 'easyjobs')}
        </span>
      );
    default:
      if (job?.is_expired) {
        return (
          <span className="status-badge status-badge--danger">
            {__('Expired', 'easyjobs')}
          </span>
        );
      } else {
        return (
          <span className="status-badge status-badge--success">
            {__('Active', 'easyjobs')}
          </span>
        );
      }
  }
};
export default Status;
