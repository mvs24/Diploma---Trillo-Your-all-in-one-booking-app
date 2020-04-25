import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import Textarea from '../../shared/components/Input/Textarea';
import Input from '../../shared/components/Input/Input';
import Button from '../../shared/components/Button/Button';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import Modal from '../../shared/components/UI/Modal';
import './AddNewTour.css';
import PlaceInput from './PlaceInput';
import ImageUpload from '../../shared/components/ImageUpload/ImageUpload';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import InlineButton from '../../shared/components/InlineButton/InlineButton';

import './AddNewFlight.css';

const packageOptions = [
  { value: 'Economic', label: 'Economic' },
  { value: 'First Class', label: 'First Class' },
];

const varietyOptions = [
  { value: 'Round-Trip', label: 'Round-Trip' },
  { value: 'One-Way', label: 'One-Way' },
];

const AddNewFlight = (props) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [flightData, setFlightData] = useState({
    from: {
      configOptions: {
        type: 'text',
        placeholder: 'FROM',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 2,
      },
    },
    fromLocation: {
      configOptions: {
        type: 'button',
        placeholder: 'FROM Location',
        locationType: 'FROM Location',
      },
    },
    to: {
      configOptions: {
        type: 'text',
        placeholder: 'TO',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 2,
      },
    },
    toLocation: {
      configOptions: {
        type: 'button',
        placeholder: 'TO Location',
        locationType: 'TO Location',
      },
    },
    maxGroupSize: {
      configOptions: {
        type: 'number',
        placeholder: 'Number of maximum participants',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minValue: 1,
        maxValue: 200,
      },
    },
    pricePerPeson: {
      configOptions: {
        type: 'number',
        placeholder: 'Price per Peson',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minValue: 20,
        maxValue: 10000,
      },
    },
    depart: {
      configOptions: {
        type: 'date',
        placeholder: 'Depart',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
      },
    },
  });
  const [fromLocation, setFromLocation] = useState({
    configOptions: {
      type: 'text',
      placeholder: 'Coordinates (LNG, LAT): (ex: -32.345,43.2345)',
    },
    value: '',
    valid: false,
    touched: false,
    validRequirements: {
      required: true,
    },
  });
  const [fromAddress, setDromAddress] = useState({
    configOptions: {
      type: 'text',
      placeholder: 'Address',
    },
    value: '',
    valid: false,
    touched: false,
    validRequirements: {
      required: true,
    },
  });
  const [toLocation, setToLocation] = useState({
    configOptions: {
      type: 'text',
      placeholder: 'Coordinates (LNG, LAT): (ex: -32.345,43.2345)',
    },
    value: '',
    valid: false,
    touched: false,
    validRequirements: {
      required: true,
    },
  });
  const [toAddress, setToAddress] = useState({
    configOptions: {
      type: 'text',
      placeholder: 'Address',
    },
    value: '',
    valid: false,
    touched: false,
    validRequirements: {
      required: true,
    },
  });
  const [flightPackage, setFlightPackage] = useState({
    value: 'flightPackage',
    label: 'Flight Package',
  });
  const [variety, setVariety] = useState({ value: 'type', label: 'Type' });
  const [formValid, setFormValid] = useState();
  const [flightLocationModal, setFlightLocationModal] = useState();
  const [flightType, setFlightType] = useState();
  const [returnDate, setReturnDate] = useState();
  const [inputReturnDate, setInputReturnDate] = useState({
    configOptions: {
      type: 'date',
      placeholder: 'Return Date',
    },
    value: '',
    valid: false,
    touched: false,
    validRequirements: {
      required: true,
    },
  });

  const [overallFormIsValid, setOverallFormIsValid] = useState();

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
    if (requirements.min) {
      isValid = isValid && value.trim().length >= requirements.min;
    }
    if (requirements.moreThan) {
      isValid = isValid && new Date(value).getTime() > new Date().getTime();
    }
    if (requirements.minValue) {
      isValid = isValid && +value >= requirements.minValue;
    }
    if (requirements.maxValue) {
      isValid = isValid && +value <= requirements.maxValue;
    }

    return isValid;
  };

  const inputHandler = (e, inputIdentifier) => {
    const newUpdatedData = { ...flightData };
    const updatedIdentifier = { ...newUpdatedData[inputIdentifier] };

    updatedIdentifier.value = e.target.value;
    updatedIdentifier.touched = true;
    updatedIdentifier.valid = checkValidity(
      updatedIdentifier.value,
      updatedIdentifier.validRequirements
    );
    newUpdatedData[inputIdentifier] = updatedIdentifier;

    setFlightData(newUpdatedData);

    let isFormValid = true;
    for (let key in newUpdatedData) {
      isFormValid = isFormValid && newUpdatedData[key].valid;
    }

    setFormValid(isFormValid);
  };

  const openFlightLocationModal = (type) => {
    setFlightLocationModal(true);
    setFlightType(type);
  };

  let flightFormData = [];
  for (let key in flightData) {
    if (flightData[key].configOptions.type === 'date') {
      flightFormData.push(
        <div className="depart__flight">
          <label>{flightData[key].configOptions.placeholder}</label>
          <Input
            value={flightData[key].value}
            valid={flightData[key].valid}
            touched={flightData[key].touched}
            configOptions={flightData[key].configOptions}
            onChange={(e) => inputHandler(e, key)}
          />
        </div>
      );
    } else if (flightData[key].configOptions.type === 'button') {
      flightFormData.push(
        <InlineButton
          clicked={() =>
            openFlightLocationModal(flightData[key].configOptions.locationType)
          }
          type="success"
          className="btnLocation"
        >
          {flightData[key].configOptions.placeholder}
        </InlineButton>
      );
    } else {
      flightFormData.push(
        <Input
          value={flightData[key].value}
          valid={flightData[key].valid}
          touched={flightData[key].touched}
          configOptions={flightData[key].configOptions}
          onChange={(e) => inputHandler(e, key)}
        />
      );
    }
  }

  const inputLocationHandler = (e, type) => {
	  	
	if (type === 'from') {
		// TODO
	  	
  	} else if (type === 'to') {
  		// TODO
  	}
   
  };

  const inputAddressHandler = (e, type) => {

  };

  const returnDateHandleChange = (e) => {

  };

  let flightLocationContent = null;

  if (flightLocationModal && flightType === 'FROM Location') {
    flightLocationContent = (
      <Modal header={flightType} show onCancel={() => setFlightLocationModal()}>
        <Input
          value={fromLocation.value}
          valid={fromLocation.valid}
          touched={fromLocation.touched}
          configOptions={fromLocation.configOptions}
          onChange={(e) => inputLocationHandler(e, 'from')}
        />
        <Input
          value={fromAddress.value}
          valid={fromAddress.valid}
          touched={fromAddress.touched}
          configOptions={fromAddress.configOptions}
          onChange={(e) => inputAddressHandler(e, 'from')}
        />
      </Modal>
    );
  } else if (flightLocationModal && flightType === 'TO Location') {
    flightLocationContent = (
      <Modal header={flightType} show onCancel={() => setFlightLocationModal()}>
        <Input
          value={toLocation.value}
          valid={toLocation.valid}
          touched={toLocation.touched}
          configOptions={toLocation.configOptions}
          onChange={(e) => inputLocationHandler(e, 'to')}
        />
        <Input
          value={toAddress.value}
          valid={toAddress.valid}
          touched={toAddress.touched}
          configOptions={toAddress.configOptions}
          onChange={(e) => inputAddressHandler(e, 'to')}
        />
      </Modal>
    );
  }

  const handleVarietyChange = (selectedOption) => {
    setVariety(selectedOption);
    if (selectedOption.value === 'Round-Trip') {
      setReturnDate(true);
    } else {
      setReturnDate(null);
    }
  };

  const handlePackageChange = (selectedOption) => {
    setFlightPackage(selectedOption);
  };

  let returnDateContent = null;

  if (returnDate) {
    returnDateContent = (
      <div className="depart__flight">
        <label>Return Date</label>
        <Input
          value={inputReturnDate.value}
          valid={inputReturnDate.valid}
          touched={inputReturnDate.touched}
          configOptions={inputReturnDate.configOptions}
          onChange={(e) => returnDateHandleChange(e)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="add__new__tour__container">
        {loading && <LoadingSpinner asOverlay />}
        {error && (
          <ErrorModal
            show
            onClear={() => {
              setError(null);
            }}
          >
            {error}
          </ErrorModal>
        )}
        {flightLocationContent}
        <h1>Add a new Flight!</h1>
        <div>
          {flightFormData.map((el) => el)}
          <div style={{ margin: '.3rem' }}>&nbsp;</div>
          <Select
            className="select2"
            value={variety}
            onChange={handleVarietyChange}
            options={varietyOptions}
          />
          {returnDateContent}
          <Select
            className="select2"
            value={flightPackage}
            onChange={handlePackageChange}
            options={packageOptions}
          />
        </div>
        <Button className="save__flight" type="pink">
          Save & Create the flight
        </Button>
      </div>
    </>
  );
};

export default AddNewFlight;
