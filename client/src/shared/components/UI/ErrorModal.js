import React from 'react';

import Modal from './Modal';
import Button from '../Button/Button';
import './ErrorModal.css';

const ErrorModal = props => {
  return (
    <Modal
      className="over"
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={props.show}
      headerClass="red"
      footer={
        <Button type="danger" clicked={props.onClear}>
          Okay
        </Button>
      }
    >
      <h3 className="errorText">{props.children}</h3>
    </Modal>
  );
};

export default ErrorModal;
