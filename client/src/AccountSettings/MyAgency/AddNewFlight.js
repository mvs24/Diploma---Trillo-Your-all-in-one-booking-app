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
      placeholder: 'Coordinates (LATITUDE, LONGITUDE): (ex: -3.35,43.25)',
    },
    value: '',
    valid: false,
    touched: false,
    validRequirements: {
      required: true,
    },
  });
  const [fromAddress, setFromAddress] = useState({
    configOptions: {
      type: 'text',
      placeholder: 'Address',
    },
    value: '',
    valid: false,
    touched: false,
    validRequirements: {
      required: true,
      minlength: 2,
    },
  });
  const [toLocation, setToLocation] = useState({
    configOptions: {
      type: 'text',
      placeholder: 'Coordinates (LATITUDE, LONGITUDE): (ex: 2,-43.5)',
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
      minlength: 2,
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
  const [
    fromAddressLocationControlled,
    setFromAddressLocationControlled,
  ] = useState();
  const [
    toAddressLocationControlled,
    setToAddressLocationControlled,
  ] = useState();

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

    if (inputIdentifier === 'depart') {
      let isValid = new Date(updatedIdentifier.value) > Date.now();
      updatedIdentifier.valid = isValid;
    }

    setFlightData(newUpdatedData);

    let isFormValid = true;
    for (let key in newUpdatedData) {
      isFormValid = isFormValid && newUpdatedData[key].valid;
    }
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
      if (flightData[key].configOptions.placeholder === 'FROM Location') {
        flightFormData.push(
          <InlineButton
            clicked={() =>
              openFlightLocationModal(
                flightData[key].configOptions.locationType
              )
            }
            disabled={fromAddressLocationControlled}
            type="success"
            className="btnLocation"
          >
            {fromAddressLocationControlled
              ? 'FROM Location Saved'
              : flightData[key].configOptions.placeholder}
          </InlineButton>
        );
      } else if (flightData[key].configOptions.placeholder === 'TO Location') {
        flightFormData.push(
          <InlineButton
            clicked={() =>
              openFlightLocationModal(
                flightData[key].configOptions.locationType
              )
            }
            disabled={toAddressLocationControlled}
            type="success"
            className="btnLocation"
          >
            {toAddressLocationControlled
              ? 'TO Location Saved'
              : flightData[key].configOptions.placeholder}
          </InlineButton>
        );
      }
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
      //
      const updatedFromLocation = { ...fromLocation };

      if (
        e.target.value.indexOf(',') === -1 ||
        e.target.value.split(',')[0] === '' ||
        e.target.value.split(',')[1] === '' ||
        !+e.target.value.split(',')[1] ||
        !+e.target.value.split(',')[0]
      ) {
        updatedFromLocation.valid = false;
      } else if (e.target.value.indexOf(',') > 0) {
        if (
          +e.target.value.split(',')[0] < -90 ||
          +e.target.value.split(',')[0] > 90 ||
          +e.target.value.split(',')[1] < -180 ||
          +e.target.value.split(',')[1] > 180
        ) {
          updatedFromLocation.valid = false;
        } else {
          updatedFromLocation.valid = true;
        }
      }

      updatedFromLocation.touched = true;
      updatedFromLocation.value = e.target.value;

      setFromLocation(updatedFromLocation);
    } else if (type === 'to') {
      const updatedToLocation = { ...toLocation };

      if (
        e.target.value.indexOf(',') === -1 ||
        e.target.value.split(',')[0] === '' ||
        e.target.value.split(',')[1] === '' ||
        !+e.target.value.split(',')[1] ||
        !+e.target.value.split(',')[0]
      ) {
        updatedToLocation.valid = false;
      } else if (e.target.value.indexOf(',') > 0) {
        if (
          +e.target.value.split(',')[0] < -90 ||
          +e.target.value.split(',')[0] > 90 ||
          +e.target.value.split(',')[1] < -180 ||
          +e.target.value.split(',')[1] > 180
        ) {
          updatedToLocation.valid = false;
        } else {
          updatedToLocation.valid = true;
        }
      }

      updatedToLocation.touched = true;
      updatedToLocation.value = e.target.value;
      setToLocation(updatedToLocation);
    }
  };

  const saveFromLocation = () => {
    if (fromLocation.valid === false) {
      setError('The values are wrong...Lat: [-90, 90] Lng: [-180, 180] ');
      return;
    }
    if (fromLocation.value.toString().indexOf(',') === -1) {
      setError('The values are wrong...Lat: [-90, 90] Lng: [-180, 180]');
      return;
    } else {
      if (
        +fromLocation.value.split(',')[0] < -90 ||
        +fromLocation.value.split(',')[0] > 90 ||
        +fromLocation.value.split(',')[1] < -180 ||
        +fromLocation.value.split(',')[1] > 180
      ) {
        setError('The values are wrong...Lat: [-90, 90] Lng: [-180, 180]');
      } else {
        //correct
        if (fromAddress.valid) {
          setFlightLocationModal();
          setFromAddressLocationControlled(true);
        } else {
          setError('Control your data!');
        }
      }
    }
  };

  const saveToLocation = () => {
    if (toLocation.valid === false) {
      setError('The values are wrong...Lat: [-90, 90] Lng: [-180, 180]');
      return;
    }
    if (toLocation.value.toString().indexOf(',') === -1) {
      setError('The values are wrong...Lat: [-90, 90] Lng: [-180, 180]');
      return;
    } else {
      if (
        +toLocation.value.split(',')[0] < -90 ||
        +toLocation.value.split(',')[0] > 90 ||
        +toLocation.value.split(',')[1] < -180 ||
        +toLocation.value.split(',')[1] > 180
      ) {
        setError('The values are wrong...Lat: [-90, 90] Lng: [-180, 180]');
      } else {
        //correct
        if (toAddress.valid) {
          setFlightLocationModal();
          setToAddressLocationControlled(true);
        } else {
          setError('Control your data!');
        }
      }
    }
  };

  const inputAddressHandler = (e, type) => {
    if (type === 'from') {
      const newUpdatedData = { ...fromAddress };

      newUpdatedData.value = e.target.value;
      newUpdatedData.touched = true;
      newUpdatedData.valid = checkValidity(
        newUpdatedData.value,
        newUpdatedData.validRequirements
      );

      setFromAddress(newUpdatedData);
    } else if (type === 'to') {
      const newUpdatedData = { ...toAddress };

      newUpdatedData.value = e.target.value;
      newUpdatedData.touched = true;
      newUpdatedData.valid = checkValidity(
        newUpdatedData.value,
        newUpdatedData.validRequirements
      );

      setToAddress(newUpdatedData);
    }
  };

  const returnDateHandleChange = (e) => {
    const newUpdatedData = { ...inputReturnDate };

    newUpdatedData.value = e.target.value;
    newUpdatedData.touched = true;
    newUpdatedData.valid = checkValidity(
      newUpdatedData.value,
      newUpdatedData.validRequirements
    );

    newUpdatedData.valid = new Date(newUpdatedData.value) > Date.now();

    setInputReturnDate(newUpdatedData);
  };

  const saveFlightHandler = async () => {
    let fromLng = fromLocation.value.split(',')[1];
    if (fromLng === '') {
      fromLng = 0;
    }

    let toLng = toLocation.value.split(',')[1];
    if (toLng === '') {
      toLng = 0;
    }

    let isValid = true;
    for (let key in flightData) {
      if ((flightData[key].configOptions.type === 'button') === false) {
        isValid = isValid && flightData[key].valid;
      }
    }

    isValid = isValid && fromAddressLocationControlled;
    isValid = isValid && toAddressLocationControlled;

    isValid = isValid && flightPackage.value !== 'flightPackage';
    isValid = isValid && variety.value !== 'variety';

    if (variety.value === 'Round-Trip') {
      isValid = isValid && inputReturnDate.valid;
    }

    if (!isValid) {
      setError('Control your data. Something is not completed or is wrong!!!');
    } else {
      const data = {
        from: flightData['from'].value,
        to: flightData['to'].value,
        fromLocation: {
          coordinates: [fromLng, fromLocation.value.split(',')[0]],
          description: fromAddress.value,
        },
        toLocation: {
          coordinates: [toLng, fromLocation.value.split(',')[0]],
          description: toAddress.value,
        },
        depart: flightData.depart.value,
        returnDate:
          variety.value === 'Round-Trip' ? inputReturnDate.value : undefined,
        package: flightPackage.value,
        pricePerPerson: +flightData.pricePerPeson.value,
        maxGroupSize: +flightData.maxGroupSize.value,
        variety: variety.value,
      };

      try {
        setLoading(true);
        const res = await axios.post(
          `/api/v1/agencies/${props.agency._id}/flights`,
          data
        );
        setLoading(false);
        props.updateAgency();
        const links = Array.from(document.querySelectorAll('.border'));
        links.forEach((link) => link.classList.remove('border'));

        props.setDisplay('flights');

        props.flightsRef.current.classList.add('border');
        // document.querySelector(`.${props.futureClass}`).classList.add('border')
      } catch (err) {
        if (!err.response.data.message) {
          err.response.data.message =
            "Something went wrong. Control your flight's data!";
        }
        setError(err.response.data.message);
        setLoading();
      }
    }
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
        <Button type="blue" clicked={saveFromLocation}>
          Save FROM Location
        </Button>
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
        <Button type="blue" clicked={saveToLocation}>
          Save To Location
        </Button>
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
        <Button
          clicked={saveFlightHandler}
          className="save__flight"
          type="pink"
        >
          Save & Create the flight
        </Button>
      </div>
    </>
  );
};

export default AddNewFlight;
