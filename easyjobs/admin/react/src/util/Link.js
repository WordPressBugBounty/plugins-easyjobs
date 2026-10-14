import React from 'react';
import { Link } from 'react-router-dom';

const LinkTag = ({ to, children, className = '', ...rest }) => {
  return (
    <Link
      to={to ? `admin.php?page=${to}` : '#'}
      className={`ej-link-tag ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default LinkTag;
