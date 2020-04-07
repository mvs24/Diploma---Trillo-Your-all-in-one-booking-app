import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { MdPeopleOutline } from 'react-icons/md';
import { GiDetour } from 'react-icons/gi';
import {
  IoIosStarOutline,
  IoMdHeartEmpty,
  IoMdNotificationsOutline,
  IoIosLogOut, 
} from 'react-icons/io';
import { FiShoppingCart } from 'react-icons/fi';
import Input from '../shared/components/Input/Input';
import LoadingSpinner from '../shared/components/UI/LoadingSpinner';
import './AccountSettings.css';
import ImageUpload from '../shared/components/ImageUpload/ImageUpload';
import Button from '../shared/components/Button/Button';
import axios from 'axios';
import {
  updateUserData,
  deleteError,
  logoutUser,
} from '../store/actions/userActions';
import ErrorModal from '../shared/components/UI/ErrorModal';

const AccountSettings = (props) => {
  const [updatedData, setUpdatedData] = useState({
    name: {
      configOptions: {
        type: 'text',
        placeholder: 'Your Name',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 2,
      },
    },
    lastname: {
      configOptions: {
        type: 'text',
        placeholder: 'Your Lastname',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 2,
      },
    },
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
  });

  const [passwordData, setPasswordData] = useState({
    passwordCurrent: {
      configOptions: {
        type: 'password',
        placeholder: 'Your Current Pasword',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 6,
      },
    },
    password: {
      configOptions: {
        type: 'password',
        placeholder: 'Your New Password',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 6,
      },
    },
    passwordConfirm: {
      configOptions: {
        type: 'password',
        placeholder: 'Confirm your new password',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 6,
      },
    },
  });
  const [userId, setUserId] = useState();
  const [image, setImage] = useState({
    value: null,
    isValid: false,
  });
  const [previewUrl, setPreviewUrl] = useState();
  const [updatedFormValid, setUpdatedFormValid] = useState(true);
  const [passwordFormValid, setPasswordFormValid] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { user } = props;

  useEffect(() => {
    if (user) {
      setUpdatedData((prevData) => {
        return {
          ...prevData,
          name: {
            ...prevData.name,
            value: user.name,
            valid: true,
          },
          lastname: {
            ...prevData.lastname,
            value: user.lastname,
            valid: true,
          },
          email: {
            ...prevData.email,
            value: user.email,
            valid: true,
          },
        };
      });
      setUserId(user.id);
      setImage({
        value: user.photo,
        isValid: true,
      });
    }
  }, [user]);

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
    const newUpdatedData = { ...updatedData };
    const updatedIdentifier = { ...newUpdatedData[inputIdentifier] };

    updatedIdentifier.value = e.target.value;
    updatedIdentifier.touched = true;
    updatedIdentifier.valid = checkValidity(
      updatedIdentifier.value,
      updatedIdentifier.validRequirements
    );
    newUpdatedData[inputIdentifier] = updatedIdentifier;

    setUpdatedData(newUpdatedData);

    let isFormValid = true;
    for (let key in newUpdatedData) {
      isFormValid = isFormValid && newUpdatedData[key].valid;
    }

    setUpdatedFormValid(isFormValid);
  };

  const inputPasswordHandler = (e, inputIdentifier) => {
    const updatedPasswordData = { ...passwordData };
    const updatedIdentifier = { ...updatedPasswordData[inputIdentifier] };

    updatedIdentifier.value = e.target.value;
    updatedIdentifier.touched = true;
    updatedIdentifier.valid = checkValidity(
      updatedIdentifier.value,
      updatedIdentifier.validRequirements
    );
    updatedPasswordData[inputIdentifier] = updatedIdentifier;

    setPasswordData(updatedPasswordData);

    let isFormValid = true;
    for (let key in updatedPasswordData) {
      isFormValid = isFormValid && updatedPasswordData[key].valid;
    }

    setPasswordFormValid(isFormValid);
  };

  const inputImageHandler = (value, isValid) => {
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

  const saveSettingsHandler = () => {
    const formData = new FormData();
    formData.set('email', updatedData.email.value);
    formData.set('name', updatedData.name.value);
    formData.set('lastname', updatedData.lastname.value);
    formData.append('photo', image.value);

    props.updateUserData(formData);
  };

  const changePasswordHandler = async () => {
    const data = {
      passwordCurrent: passwordData.passwordCurrent.value,
      password: passwordData.password.value,
      passwordConfirm: passwordData.passwordConfirm.value,
    };
    try {
      setLoading(true);
      await axios.post('/api/v1/users/updatePassword', data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response.data.message);
    }
  };

  const goToBookings = () => {
    history.push('/my-bookings');
  };

  const logoutHandler = () => {
    props.logoutUser();
    history.push('/');
  };

  if (!user) return <LoadingSpinner asOverlay />;

  return (
    <div className="settings__container">
      {loading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal show onClear={() => setError(false)}>
          {error}
        </ErrorModal>
      )}
      {props.error && (
        <ErrorModal show onClear={props.deleteError}>
          {props.error}
        </ErrorModal>
      )}
      <div className="settings__info">
        <div className="user__links">
          <li>
            <IconContext.Provider
              value={{ className: 'icon__white tour__info--icon' }}
            >
              <MdPeopleOutline />
            </IconContext.Provider>
            <p className="">SETTINGS</p>
          </li>
          <li onClick={goToBookings}>
            <IconContext.Provider
              value={{ className: 'icon__white tour__info--icon' }}
            >
              <GiDetour />
            </IconContext.Provider>
            <p className="">MY BOOKINGS (TOURS)</p>
          </li>{' '}
          <li onClick={() => history.push('/my-reviews')}>
            <IconContext.Provider
              value={{ className: 'icon__white tour__info--icon' }}
            >
              <IoIosStarOutline />
            </IconContext.Provider>
            <p className="">MY REVIEWS (TOURS)</p>
          </li>{' '}
          <li onClick={() => history.push('/my-wishlist')}>
            <IconContext.Provider
              value={{ className: 'icon__white tour__info--icon' }}
            >
              <IoMdHeartEmpty />
            </IconContext.Provider>
            <p className="">MY WISHLIST (TOURS)</p>
          </li>
          <li onClick={() => history.push('/my-cart')}>
            <IconContext.Provider
              value={{ className: 'icon__white tour__info--icon' }}
            >
              <FiShoppingCart />
            </IconContext.Provider>
            <p className="">MY SHOPPING CART (TOURS)</p>
          </li>
          <li
            onClick={() => history.push('/my-notifications')}
            className="list__item"
          >
            <IconContext.Provider
              value={{ className: 'icon__white tour__info--icon' }}
            >
              <IoMdNotificationsOutline />
            </IconContext.Provider>
            <p className="">MY NOTIFICATIONS</p>
          </li>
          <li onClick={logoutHandler} className="list__item">
            <IconContext.Provider
              value={{ className: 'icon__white tour__info--icon' }}
            >
              <IoIosLogOut />
            </IconContext.Provider>
            <p className="">LOG OUT</p>
          </li>
        </div>
        <div className="user__info">
          <h1>YOUR ACCOUNT SETTINGS</h1>
          <div className="user__info--fields">
            <span>Name</span>
            <Input
              className="user__info--input"
              value={updatedData['name'].value}
              valid={updatedData['name'].valid}
              touched={updatedData['name'].touched}
              configOptions={updatedData['name'].configOptions}
              onChange={(e) => inputHandler(e, 'name')}
            />
            <span>Lastname</span>
            <Input
              className="user__info--input"
              value={updatedData['lastname'].value}
              valid={updatedData['lastname'].valid}
              touched={updatedData['lastname'].touched}
              configOptions={updatedData['lastname'].configOptions}
              onChange={(e) => inputHandler(e, 'lastname')}
            />
            <span>E-mail</span>
            <Input
              className="user__info--input"
              value={updatedData['email'].value}
              valid={updatedData['email'].valid}
              touched={updatedData['email'].touched}
              configOptions={updatedData['email'].configOptions}
              onChange={(e) => inputHandler(e, 'email')}
            />
          </div>
          <div className="user__photo--container">
            {previewUrl ? (
              <img className="user__photo--image" src={previewUrl} />
            ) : (
              <img
                className="user__photo--image"
                src={`http://localhost:5000/${user.photo}`}
              />
            )}
            <ImageUpload onInput={inputImageHandler} />
          </div>
          <Button
            clicked={saveSettingsHandler}
            disabled={!updatedFormValid}
            className="save__btn"
            type="success"
          >
            SAVE SETTINGS
          </Button>
          <div className="passwordChange__container">
            <h1>PASSWORD CHANGE</h1>
            <div className="password__fields">
              <span>Current Password</span>
              <Input
                value={passwordData['passwordCurrent'].value}
                valid={passwordData['passwordCurrent'].valid}
                touched={passwordData['passwordCurrent'].touched}
                configOptions={passwordData['passwordCurrent'].configOptions}
                onChange={(e) => inputPasswordHandler(e, 'passwordCurrent')}
              />
              <span>New Password</span>
              <Input
                value={passwordData['password'].value}
                valid={passwordData['password'].valid}
                touched={passwordData['password'].touched}
                configOptions={passwordData['password'].configOptions}
                onChange={(e) => inputPasswordHandler(e, 'password')}
              />
              <span>Password Confirm</span>
              <Input
                value={passwordData['passwordConfirm'].value}
                valid={passwordData['passwordConfirm'].valid}
                touched={passwordData['passwordConfirm'].touched}
                configOptions={passwordData['passwordConfirm'].configOptions}
                onChange={(e) => inputPasswordHandler(e, 'passwordConfirm')}
              />
            </div>
          </div>
          <Button
            clicked={changePasswordHandler}
            disabled={!passwordFormValid}
            className="save__btn"
            type="danger"
          >
            SAVE SETTINGS
          </Button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.userData,
  error: state.user.error,
});

export default connect(mapStateToProps, {
  updateUserData,
  deleteError,
  logoutUser,
})(AccountSettings);
