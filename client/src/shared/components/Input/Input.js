import React from 'react';

import './Input.css';

export default props => {
  let classNames = ['input'];
  
  if (props.touched && !props.valid) {
    classNames.push('invalid');
  }
  
  return (
    <input
      {...props.configOptions}
      className={classNames.join(' ')}
      onChange={props.onChange}
      value={props.value}
    />
  );
};
