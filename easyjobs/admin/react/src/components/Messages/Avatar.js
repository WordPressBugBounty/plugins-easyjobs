import React from 'react';
import Icon from './icons';

const Avatar = ({ src, name, size = 40, className = '' }) => {
  const style = { width: size, height: size };
  if (src) {
    return (
      <img
        className={`ej-msg-avatar ${className}`}
        style={style}
        src={src}
        alt={name}
      />
    );
  }
  return (
    <span
      className={`ej-msg-avatar ej-msg-avatar--empty ${className}`}
      style={style}
      aria-hidden="true"
    >
      <Icon name="user" size={Math.round(size * 0.5)} />
    </span>
  );
};

export default Avatar;
