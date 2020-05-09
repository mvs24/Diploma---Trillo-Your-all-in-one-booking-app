import React from 'react';

import './InlineButton.css';

const InlineButton = (props) => {
  const classNames = ['btn__inline', props.className];
  if (props.disabled) {
    classNames.push('disabled');
  }
  return (
    <a
      className={classNames.join(' ')}
      onClick={props.disabled ? () => {} : props.clicked}
    >
      {props.children}
    </a>
  );
};

export default InlineButton;
