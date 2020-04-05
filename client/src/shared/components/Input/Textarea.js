import React from 'react';

import './Input.css';

export default (props) => {
  let classNames = ['textarea', props.className];

  if (props.touched && !props.valid) {
    classNames.push('invalid');
  }

  return (
    <textarea
      {...props.configOptions}
      className={classNames.join(' ')}
      onChange={props.onChange}
      value={props.value}
    />
  );
};
