import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Input from '../../shared/components/Input/Input';
import Textarea from '../../shared/components/Input/Textarea';
import ImageUpload from '../../shared/components/ImageUpload/ImageUpload';
import Button from '../../shared/components/Button/Button';

import './EditAgency.css';

const EditAgency = ({ agency }) => {
  const [agencyData, setAgencyData] = useState({
    name: {
      configOptions: {
        type: 'text',
        placeholder: 'Name of your agency',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 2,
      },
    },
    description: {
      configOptions: {
        type: 'text',
        placeholder: 'Write a description for your agency (Min: 20 characters)',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 20,
      },
    },
  });
  const [image, setImage] = useState({
    value: null,
    isValid: false,
  });
  const [previewUrl, setPreviewUrl] = useState();
  const [formValid, setFormValid] = useState(true);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    setAgencyData((prevState) => {
      return {
        ...prevState,
        name: {
          ...prevState.name,
          value: agency.name,
          valid: true,
          touched: false,
        },
        description: {
          ...prevState.description,
          value: agency.description,
          valid: true,
          touched: false,
        },
      };
    });
    setImage({ value: image.value, isValid: true });
  }, []);

  const checkValidity = (value, requirements) => {
    let isValid = true;

    if (requirements.required) {
      isValid = isValid && value.trim().length !== 0;
    }
    if (requirements.minlength) {
      isValid = isValid && value.trim().length >= requirements.minlength;
    }
    if (requirements.isEmail) {
      isValid = isValid && /\S+@\S+\.\S+/.test(value);
    }

    return isValid;
  };

  const inputHandler = (e, inputIdentifier) => {
    const newUpdatedData = { ...agencyData };
    const updatedIdentifier = { ...newUpdatedData[inputIdentifier] };

    updatedIdentifier.value = e.target.value;
    updatedIdentifier.touched = true;
    updatedIdentifier.valid = checkValidity(
      updatedIdentifier.value,
      updatedIdentifier.validRequirements
    );
    newUpdatedData[inputIdentifier] = updatedIdentifier;

    setAgencyData(newUpdatedData);

    let isFormValid = true;
    for (let key in newUpdatedData) {
      isFormValid = isFormValid && newUpdatedData[key].valid;
    }

    setFormValid(isFormValid);
  };

  const inputImageHandler = (value, isValid) => {
    if (isValid) {
    }
    setImage({
      value,
      isValid,
    });

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(value);
  };

  let formData = [];
  for (let key in agencyData) {
    if (key === 'name') {
      formData.push(
        <div className="input__data">
          <label>{key.toUpperCase()}</label>
          <Input
            value={agencyData[key].value}
            valid={agencyData[key].valid}
            touched={agencyData[key].touched}
            configOptions={agencyData[key].configOptions}
            onChange={(e) => inputHandler(e, key)}
          />
        </div>
      );
    } else if (key === 'description') {
      formData.push(
        <div className="input__data">
          <label>{key.toUpperCase()}</label>
          <Textarea
            value={agencyData[key].value}
            valid={agencyData[key].valid}
            touched={agencyData[key].touched}
            configOptions={agencyData[key].configOptions}
            onChange={(e) => inputHandler(e, key)}
          />
        </div>
      );
    }
  }

  const saveChangesHandler = async () => {
    const formData = new FormData();
    formData.set('name', agencyData.name.value);
    formData.set('description', agencyData.description.value);
    formData.append('image', image.value);

    try {
      setLoading(true);
      const updatedAgency = await axios.patch(
        `/api/v1/agencies/${agency._id}`,
        formData
      );
      setLoading();
    } catch (err) {
      setError(err.response.data);
      setLoading();
    }
  };

  let agencyImg = `http://localhost:5000/${agency.image}`;

  return (
    <div className="edit__agency--container">
      {loading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal show onClear={() => setError()}>
          {error}
        </ErrorModal>
      )}
      <h1>Edit Agency</h1>
      <div className="edit__agency--form">
        {formData}
        <div className="edit__agency--form--img">
          {previewUrl ? (
            <img className="edit__img" src={previewUrl} />
          ) : (
            <img className="edit__img" src={agencyImg} />
          )}

          <ImageUpload
            title={'Logo of your agency'}
            onInput={inputImageHandler}
          />
        </div>
        <Button
          disabled={!formValid}
          type="danger"
          className="save__changes"
          clicked={saveChangesHandler}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditAgency;
