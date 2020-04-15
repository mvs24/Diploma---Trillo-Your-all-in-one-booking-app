import React, {useState, useRef} from 'react';
import {connect} from 'react-redux';
import SeaImg from '../../assets/flight.webp'
import AirplaneImg from '../../assets/air.png'
import './Flights.css'
import Input from '../../shared/components/Input/Input'
import Button from '../../shared/components/Button/Button'
import Select from 'react-select';
import { IconContext } from 'react-icons';
import { IoIosAirplane } from 'react-icons/io';
import {MdDateRange} from 'react-icons/md'
import axios from 'axios'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import ErrorModal from '../../shared/components/UI/ErrorModal';
import {getRequestedFlights, deleteError} from '../../store/actions/flightsActions'

const options = [
  { value: 'Economic', label: 'Economic' },
  { value: 'First Class', label: "First-Class" }
];

const Flights = props => {
	const oneWay = useRef()
	const roundTrip = useRef()
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
	        required: true
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
	        required: true
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
	        required: true
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
	        required: true
	      },
	    }   
	})
	const [flightsInputValid, setFlightsInputValid] = useState(false)
	const [selectedOption, setSelectedOption] = useState()
	const [variety, setVariety] = useState()
	const [error, setError] = useState()
	
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
	}


	const searchFlightsHandler = async e => {
		e.preventDefault()

		let isValid = true;
		for (let key in flightsInput) {
			if (!flightsInput[key].valid) {
				isValid = false
			}
		}
		if (!selectedOption) isValid = false;

		if (!isValid) {
			setError("Control your data... Something is wrong!")
			return;
		}

		const data = {
			variety: oneWay.checked ? "One-Way": "Round-Trip",
			from: flightsInput.from.value, 
			to: flightsInput.to.value, 
			depart: flightsInput.depart.value, 
			package: selectedOption.value, 
			returnDate: flightsInput.returnDate.value
		}

		await props.getRequestedFlights(data);
		props.history.push('/requested/flights')
	}


	return (
		<div className='flights__container'>
			{props.loadingFlights && <LoadingSpinner asOverlay/>}
			{error && <ErrorModal show onClear={() => setError()}>{error}</ErrorModal>}
			{props.error && <ErrorModal show onClear={() => props.deleteError()}>{props.error}</ErrorModal>}
			<div className='flights__form'>
				<h1>Discover the world with our flights</h1>
				<div>
					<div className='label__container'>
						<div>
							<input name='check' ref={roundTrip} type='radio'/>
							<label>Round-Trip</label>
						</div>
						<div>
							<input name='check' ref={oneWay} type='radio'/>
							<label>One-Way</label>
						</div>
						<div className='select__class'>
							<Select
				              value={selectedOption}
				              onChange={handleChange}
				              options={options}
				            />
			            </div>
					</div> 
					<form className='flights__form' onSubmit={searchFlightsHandler}>
						<div className='input__container'>
							<Input
							  value={flightsInput['from'].value}
					          valid={flightsInput['from'].valid}
					          touched={flightsInput['from'].touched}
					          configOptions={flightsInput['from'].configOptions}
					          onChange={(e) => inputHandler(e, 'from')}
							/>
							<div className='icons__container'>
							<IconContext.Provider
					            value={{ className: ' icon__blue tour__detail--icon' }}
					         >
					            <IoIosAirplane />
					          </IconContext.Provider>
					          <IconContext.Provider
					            value={{ className: ' icon__blue tour__detail--icon icon--rotate' }}
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
						<div className='input__container'>
							<Input
							  value={flightsInput['depart'].value}
					          valid={flightsInput['depart'].valid}
					          touched={flightsInput['depart'].touched}
					          configOptions={flightsInput['depart'].configOptions}
					          onChange={(e) => inputHandler(e, 'depart')}
							/>
							<div className='icons__container'>
							<IconContext.Provider
					            value={{ className: ' icon__blue tour__detail--icon' }}
					         >
					            <MdDateRange />
					          </IconContext.Provider>
					          </div>
							<Input
							  value={flightsInput['returnDate'].value}
					          valid={flightsInput['returnDate'].valid}
					          touched={flightsInput['returnDate'].touched}
					          configOptions={flightsInput['returnDate'].configOptions}
					          onChange={(e) => inputHandler(e, 'returnDate')}
							/>
						</div>
						<Button type='blue'>Search</Button>
					</form>
				</div>
			</div> 
			<div className='sea__airplane__container'>
				<img className='seaImg' src={SeaImg}/>
				<img src={AirplaneImg} className='airplaneImg' />
			</div>
		</div>
	)
}

const mapStateToProps = state => ({
	error: state.flights.error,
	loadingFlights: state.flights.loadingFlights
})

export default connect(mapStateToProps, {getRequestedFlights, deleteError})(Flights)