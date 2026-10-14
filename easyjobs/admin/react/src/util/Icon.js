import React from 'react';

const Icon = function (props) {
  var id = props.id;
  var size = props.size || 16;
  var className = props.className || '';
  var style = props.style || {};
  return React.createElement(
    'svg',
    {
      width: size,
      height: size,
      className: className,
      style: style,
      'aria-hidden': 'true',
      focusable: 'false',
    },
    React.createElement('use', { href: '#' + id }),
  );
};

export default Icon;
