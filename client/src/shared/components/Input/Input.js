import React from 'react';

import './Input.css';

export default props => {
  return <input {...props} className="input" onChange={props.onChange} />;
};
