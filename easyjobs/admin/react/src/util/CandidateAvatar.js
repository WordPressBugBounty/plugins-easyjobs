import React, { useState } from 'react';
import { getInitials, getAvatarGradient } from './helper';

var CandidateAvatar = function (props) {
  var name = props.name || '';
  var src = props.src;
  var size = props.size || 54;
  var className = props.className || '';

  var _useState = useState(false);
  var imgError = _useState[0];
  var setImgError = _useState[1];

  var initials = getInitials(name);
  var gradient = getAvatarGradient(name);

  if (src && !imgError) {
    return React.createElement('img', {
      src: src,
      alt: name,
      width: size,
      height: size,
      className: 'ej-avatar-img ' + className,
      // width/height in style overrides .easy-page-body header img { width: 170px } in _global.scss
      style: {
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'block',
        flexShrink: 0,
      },
      onError: function () {
        setImgError(true);
      },
    });
  }

  return React.createElement(
    'div',
    {
      className: 'ej-avatar-initials ' + className,
      style: {
        width: size,
        height: size,
        borderRadius: '50%',
        background: gradient,
        display: 'grid',
        placeItems: 'center',
        color: '#fff',
        fontWeight: 600,
        fontSize: Math.round(size * 0.33),
        flexShrink: 0,
      },
    },
    initials || '?',
  );
};

export default CandidateAvatar;
