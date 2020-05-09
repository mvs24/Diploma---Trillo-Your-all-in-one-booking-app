import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import './Flights.css';
import Input from '../../shared/components/Input/Input';
import Button from '../../shared/components/Button/Button';
import Select from 'react-select';
import { IconContext } from 'react-icons';
import { IoIosAirplane } from 'react-icons/io';
import { MdDateRange } from 'react-icons/md';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import {
  getRequestedFlights,
  deleteError,
} from '../../store/actions/flightsActions';

const options = [
  { value: 'Economic', label: 'Economic' },
  { value: 'First Class', label: 'First-Class' },
];

const Flights = (props) => {
  const oneWay = useRef();
  const roundTrip = useRef();
  const [flightsInput, setFlightsInput] = useState({
    from: {
      configOptions: {
        type: 'text',
        placeholder: 'Airport-Take off',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
      },
    },
    to: {
      configOptions: {
        type: 'text',
        placeholder: 'Airport-Arrival',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
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
    returnDate: {
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
    },
  });
  const [flightsInputValid, setFlightsInputValid] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    value: null,
    label: 'Package',
  });
  const [error, setError] = useState();
  const [selectedWay, setSelectedWay] = useState('roundTrip');

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
    const newUpdatedData = { ...flightsInput };
    const updatedIdentifier = { ...newUpdatedData[inputIdentifier] };

    updatedIdentifier.value = e.target.value;
    updatedIdentifier.touched = true;
    updatedIdentifier.valid = checkValidity(
      updatedIdentifier.value,
      updatedIdentifier.validRequirements
    );
    newUpdatedData[inputIdentifier] = updatedIdentifier;

    setFlightsInput(newUpdatedData);

    let isFormValid = true;
    for (let key in newUpdatedData) {
      isFormValid = isFormValid && newUpdatedData[key].valid;
    }

    setFlightsInputValid(isFormValid);
  };

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const searchFlightsHandler = async (e) => {
    e.preventDefault();

    if (selectedWay === 'oneWay') {
      delete flightsInput['returnDate'];
    }

    let isValid = true;
    for (let key in flightsInput) {
      if (!flightsInput[key].valid) {
        isValid = false;
      }
    }
    if (!selectedOption.value) isValid = false;

    if (!isValid) {
      setError('Control your data... Something is wrong!');
      return;
    }

    let data = {
      variety: oneWay.current.checked ? 'One-Way' : 'Round-Trip',
      from: flightsInput.from.value,
      to: flightsInput.to.value,
      depart: flightsInput.depart.value,
      package: selectedOption.value,
    };

    if (data.variety === 'Round-Trip') {
      data.returnDate = flightsInput.returnDate.value;
    }

    if (data.returnDate) {
      props.history.push(
        `/requested/flights?variety=${data.variety}&from=${data.from}&to=${data.to}&depart=${data.depart}&package=${data.package}&returnDate=${data.returnDate}`
      );
    } else {
      props.history.push(
        `/requested/flights?variety=${data.variety}&from=${data.from}&to=${data.to}&depart=${data.depart}&package=${data.package}`
      );
    }
  };

  const checkBoxHandler = (e) => {
    if (e.target.value === 'One-Way') {
      setSelectedWay('oneWay');
    } else {
      setSelectedWay('roundTrip');
    }
  };

  return (
    <div className="flights__container">
      {props.loadingFlights && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal show onClear={() => setError()}>
          {error ? error : 'Something went wrong'}
        </ErrorModal>
      )}
      {props.error && (
        <ErrorModal show onClear={() => props.deleteError()}>
          {props.error}
        </ErrorModal>
      )}
      <div className="flights__form">
        <h1>Discover the world with our flights</h1>
        <div>
          <div className="label__container">
            <div className="input__checkbox__container">
              <input
                value="Round-Trip"
                onChange={checkBoxHandler}
                checked={selectedWay === 'roundTrip'}
                name="check"
                ref={roundTrip}
                type="radio"
                id="round"
              />
              <label htmlFor={'round'}>Round-Trip</label>
            </div>
            <div className="input__checkbox__container">
              <input
                value="One-Way"
                onChange={checkBoxHandler}
                checked={selectedWay === 'oneWay'}
                name="check"
                ref={oneWay}
                type="radio"
                id="radio__"
              />
              <label htmlFor="radio__">One-Way</label>
            </div>
            <div className="select__class">
              <Select
                value={selectedOption}
                onChange={handleChange}
                options={options}
              />
            </div>
          </div>
          <form className="flights__form" onSubmit={searchFlightsHandler}>
            <div className="input__container">
              <Input
                value={flightsInput['from'].value}
                valid={flightsInput['from'].valid}
                touched={flightsInput['from'].touched}
                configOptions={flightsInput['from'].configOptions}
                onChange={(e) => inputHandler(e, 'from')}
              />
              <div className="icons__container">
                <IconContext.Provider
                  value={{ className: ' icon__blue tour__detail--icon' }}
                >
                  <IoIosAirplane />
                </IconContext.Provider>
                <IconContext.Provider
                  value={{
                    className: ' icon__blue tour__detail--icon icon--rotate',
                  }}
                >
                  <IoIosAirplane />
                </IconContext.Provider>
              </div>

              <Input
                value={flightsInput['to'].value}
                valid={flightsInput['to'].valid}
                touched={flightsInput['to'].touched}
                configOptions={flightsInput['to'].configOptions}
                onChange={(e) => inputHandler(e, 'to')}
              />
            </div>

            <div className="input__container">
              <>
                <label className="dep__label">Depart</label>
                <Input
                  value={flightsInput['depart'].value}
                  valid={flightsInput['depart'].valid}
                  touched={flightsInput['depart'].touched}
                  configOptions={flightsInput['depart'].configOptions}
                  onChange={(e) => inputHandler(e, 'depart')}
                />
              </>
              <div className="icons__container">
                <IconContext.Provider
                  value={{ className: ' icon__blue tour__detail--icon' }}
                >
                  <MdDateRange />
                </IconContext.Provider>
              </div>

              {selectedWay === 'roundTrip' ? (
                <>
                  <label className="ret__label">Return Date</label>
                  <Input
                    value={flightsInput['returnDate'].value}
                    valid={flightsInput['returnDate'].valid}
                    touched={flightsInput['returnDate'].touched}
                    configOptions={flightsInput['returnDate'].configOptions}
                    onChange={(e) => inputHandler(e, 'returnDate')}
                  />
                </>
              ) : null}
            </div>

            <div className="flights__btns">
              <Button type="blue">Search</Button>
              <Button
                clicked={() => props.history.push('/all-flights')}
                className="all__flights__btn"
                type="pink"
              >
                All Flights
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  error: state.flights.error,
  loadingFlights: state.flights.loadingFlights,
});

export default connect(mapStateToProps, { getRequestedFlights, deleteError })(
  Flights
);
