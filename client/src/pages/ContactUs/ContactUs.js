import React, {useState} from 'react'
import axios from 'axios'
import Textarea from '../../shared/components/Input/Textarea';
import Input from '../../shared/components/Input/Input';
import Button from '../../shared/components/Button/Button';
import './ContactUs.css'
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import Modal from '../../shared/components/UI/Modal';

const ContactUs = props => {
	const [messageSentPopup,setMessageSentPopup] = useState()
	const [loading, setLoading] = useState()
	const [error, setError] = useState()
	  const [data, setData] = useState({
		    email: {
		      configOptions: {
		        type: 'email',
		        placeholder: 'Your E-mail',
		      },
		      value: '',
		      valid: false,
		      touched: false,
		      validRequirements: {
		        required: true,
		        isEmail: true,
		      },
		    },
		    message: {
		      configOptions: {
		        type: 'text',
		        placeholder: 'Your Message (Min: 10 characters)',
		      },
		      value: '',
		      valid: false,
		      touched: false,
		      validRequirements: {
		        required: true,
		        minlength: 10
		      },
		    },
  });
	  const [formValid, setFormValid] = useState()



  const checkValidity = (value, requirements) => {
    let isValid = true;

    if (requirements.required) {
      isValid = isValid && value.trim().length !== 0;
    }
    if (requirements.minlength) {
      isValid = isValid && value.length >= requirements.minlength;
    }
    if (requirements.maxlength) {
      isValid = isValid && value.length <= requirements.maxlength;
    }
    if (requirements.isEmail) {
      isValid = isValid && /\S+@\S+\.\S+/.test(value);
    }

    return isValid;
  };


   const inputHandler = (e, inputIdentifier) => {
    const newUpdatedData = { ...data };
    const updatedIdentifier = { ...newUpdatedData[inputIdentifier] };

    updatedIdentifier.value = e.target.value;
    updatedIdentifier.touched = true;
    updatedIdentifier.valid = checkValidity(
      updatedIdentifier.value,
      updatedIdentifier.validRequirements
    );
    newUpdatedData[inputIdentifier] = updatedIdentifier;

    setData(newUpdatedData);

    let isFormValid = true;
    for (let key in newUpdatedData) {
      isFormValid = isFormValid && newUpdatedData[key].valid;
    }

    setFormValid(isFormValid);
  };

   let contactData = [];
  for (let key in data) {
    if (key === 'email') {
      contactData.push(
        <Input
          value={data[key].value}
          valid={data[key].valid}
          touched={data[key].touched}
          configOptions={data[key].configOptions}
          onChange={(e) => inputHandler(e, key)}
        />
      );
    } else if (key === 'message') {
      contactData.push(
        <Textarea
          value={data[key].value}
          valid={data[key].valid}
          touched={data[key].touched}
          configOptions={data[key].configOptions}
          onChange={(e) => inputHandler(e, key)}
        />
      );
    } 
  }

  const contactUsHandler = async e => {
  	e.preventDefault()
  	try {
		const contactData = {
		  		email: data.email.value,
		  		message: data.message.value
		  	}

		  	setLoading(true)

		  	await axios.post('/api/v1/users/contact-us', contactData)
		  	setLoading(false)
		  	setMessageSentPopup(true)
		  	setData(prev => {
		  		return {
		  			...prev, 
		  			email: {
		  				...prev.email,
		  				value: "",
		  				valid: false,

		      touched: false,
		  			},
		  			message: { 
		  				...prev.message,
		  				value: "",
		  				 valid: false,
		      touched: false,
		  			}
		  		}
		  	})
  	} catch(err) {
  		setLoading()
  		setError("Something went wrong. Try again later")
  	}

  	
  }

	return (
		<div>
		{loading && <LoadingSpinner asOverlay/>}
		{error &&  <ErrorModal show onClear={() => setError(false)}>
          {error ? error : 'Something went wrong. Try again later'}
        </ErrorModal> }
		{messageSentPopup && <Modal header='Message Sent' show onCancel={() => setMessageSentPopup()}>
          <h1 className='modal__heading'>Message sent to Marius Vasili.</h1>
          <h1 className='modal__heading'>We will contact you as soon as possible.</h1>
        <Button type='success' clicked={() => setMessageSentPopup()}>OK</Button>
        </Modal>}
			<div>
				<h1 className='contactHeading'>Contact Us</h1>
				<form className='contactForm' onSubmit={contactUsHandler}>
					{contactData.map(el => el)}
					<Button disabled={!formValid} type='success'  clicked={contactUsHandler}>Contact Us</Button>
				</form>
			</div>

		</div>
	)
}

export default ContactUs;