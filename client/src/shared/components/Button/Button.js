import React from 'react';

import './Button.css';

const Button = props => {
  const classNames = ['btn', props.type];

  return (
    <button className={classNames.join(' ')} onClick={props.clicked}>
      {props.children}
    </button>
  );
};

export default Button;
