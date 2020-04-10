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

const options = [
  { value: 'easy', label: 'EASY' },
  { value: 'medium', label: 'MEDIUM' },
  { value: 'difficult', label: 'DIFFICULT' },
];

const AddNewTour = (props) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [difficulty, setDifficulty] = useState('Category...');
  const [openStartDatesModal, setOpenStartDatesModal] = useState();
  const [startDatesValid, setStartDatesValid] = useState();
  const [nrLocationsInput, setNrLocationsInput] = useState({
    configOptions: {
      type: 'number',
      placeholder: 'Number of Locations',
    },
    value: '',
    valid: false,
    touched: false,
    validRequirements: {
      required: true,
    },
  });
  const [nrLocationsInputValid, setNrLocationsInputValid] = useState();
  const [tourData, setTourData] = useState({
    name: {
      configOptions: {
        type: 'text',
        placeholder: 'Name of the tour',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 3,
      },
    },
    duration: {
      configOptions: {
        type: 'number',
        placeholder: 'Duration (days)',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        min: 1,
      },
    },
    maxGroupSize: {
      configOptions: {
        type: 'number',
        placeholder: 'Number of participants',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
      },
    },
    price: {
      configOptions: {
        type: 'number',
        placeholder: 'Price of the tour',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
      },
    },
    summary: {
      configOptions: {
        type: 'textarea',
        placeholder: 'Summary',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
        minlength: 15,
      },
    },
    description: {
      configOptions: {
        type: 'textarea',
        placeholder: 'Write a description for your agency (Min: 20 characters)',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {},
    },
    description: {
      configOptions: {
        type: 'textarea',
        placeholder: 'Write a description for your tour (Min: 20 characters)',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {},
    },
    nrStartDates: {
      configOptions: {
        type: 'number',
        placeholder: 'Number of start dates',
      },
      value: '',
      valid: false,
      touched: false,
      validRequirements: {
        required: true,
      },
    },
  });
  const [startDates, setStartDates] = useState([]);
  const [openStartLocationModal, setOpenStartLocationModal] = useState();
  const [openLocationsModal, setOpenLocationsModal] = useState();
  const [startLocation, setStartLocation] = useState({
    coordinates: [],
    address: '',
    description: '',
  });

  const [imageCover, setImageCover] = useState({
    value: null,
    isValid: false,
  });
  const [previewUrl, setPreviewUrl] = useState();
  const [formValid, setFormValid] = useState();
  const [locations, setLocations] = useState([]);
  const [confirmedStartDates, setConfirmedStartDates] = useState();
  const [confirmedStartLocation, setConfirmedStartLocation] = useState();
  const [confirmedNrLocations, setConfirmedNrLocations] = useState();
  const [openImagesModal, setOpenImagesModal] = useState();
  const [images, setImages] = useState([]);
  const [firstImage, setFirstImage] = useState({
    value: null,
    isValid: false,
  });
  const [secondImage, setSecondImage] = useState({
    value: null,
    isValid: false,
  });
  const [thirdImage, setThirdImage] = useState({
    value: null,
    isValid: false,
  });
  const [imagesValid, setImagesValid] = useState();
  const [firstUrl, setFirstUrl] = useState();
  const [secondUrl, setSecondUrl] = useState();
  const [thirdUrl, setThirdUrl] = useState();
  const [confirmedImages, setConfirmedImages] = useState();

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

    return isValid;
  };

  const inputHandler = (e, inputIdentifier) => {
    if (inputIdentifier === 'nrStartDates' && confirmedStartDates) {
      return;
    }
    const newUpdatedData = { ...tourData };
    const updatedIdentifier = { ...newUpdatedData[inputIdentifier] };

    updatedIdentifier.value = e.target.value;
    updatedIdentifier.touched = true;
    updatedIdentifier.valid = checkValidity(
      updatedIdentifier.value,
      updatedIdentifier.validRequirements
    );
    newUpdatedData[inputIdentifier] = updatedIdentifier;

    setTourData(newUpdatedData);

    let isFormValid = true;
    for (let key in newUpdatedData) {
      isFormValid = isFormValid && newUpdatedData[key].valid;
    }

    setFormValid(isFormValid);
  };

  const inputImageHandler = (value, isValid) => {
    setImageCover({
      value,
      isValid,
    });

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(value);
  };

  const inputImagesHandler = (type, value, isValid) => {
    if (type === 'first') {
      setFirstImage({
        value,
        isValid,
      });
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setFirstUrl(fileReader.result);
      };
      fileReader.readAsDataURL(value);
    } else if (type === 'second') {
      setSecondImage({
        value,
        isValid,
      });
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setSecondUrl(fileReader.result);
      };
      fileReader.readAsDataURL(value);
    } else if (type === 'third') {
      setThirdImage({
        value,
        isValid,
      });
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setThirdUrl(fileReader.result);
      };
      fileReader.readAsDataURL(value);
    }

    console.log(images);
  };

  const handleChange = (selectedOption) => {
    setDifficulty(selectedOption);
  };

  const handleError = (err) => {
    console.log(err);
  };

  const confirmStartDates = (e) => {
    e.preventDefault();
    if (tourData.nrStartDates.value >= 1) {
      setOpenStartDatesModal(true);
    } else {
      setError('Please specify the correct number of start dates');
    }
  };

  let formData = [];

  for (let key in tourData) {
    if (key === 'nrStartDates') {
      formData.push(
        <div>
          <Input
            value={tourData[key].value}
            valid={tourData[key].valid}
            touched={tourData[key].touched}
            configOptions={tourData[key].configOptions}
            onChange={(e) => inputHandler(e, key)}
          />
          <Button
            disabled={!tourData[key].valid || confirmedStartDates}
            type="success"
            clicked={confirmStartDates}
          >
            {confirmedStartDates ? 'CONFIRMED' : 'Confirm'}
          </Button>
        </div>
      );
    } else if (tourData[key].configOptions.type === 'textarea') {
      formData.push(
        <Textarea
          value={tourData[key].value}
          valid={tourData[key].valid}
          touched={tourData[key].touched}
          configOptions={tourData[key].configOptions}
          onChange={(e) => inputHandler(e, key)}
        />
      );
    } else if (
      tourData[key].configOptions.type === 'text' ||
      tourData[key].configOptions.type === 'number'
    ) {
      formData.push(
        <Input
          value={tourData[key].value}
          valid={tourData[key].valid}
          touched={tourData[key].touched}
          configOptions={tourData[key].configOptions}
          onChange={(e) => inputHandler(e, key)}
        />
      );
    } else if (tourData[key].configOptions.type === 'date') {
      formData.push(
        <div>
          <label>{tourData[key].configOptions.placeholder}</label>
          <Input
            value={tourData[key].value}
            valid={tourData[key].valid}
            touched={tourData[key].touched}
            configOptions={tourData[key].configOptions}
            onChange={(e) => inputHandler(e, key)}
          />
        </div>
      );
    }
  }

  const openStartLocationHandler = (e) => {
    e.preventDefault();
    setOpenStartLocationModal(true);
  };

  const openNumberOfLocations = (e) => {
    e.preventDefault();
    setOpenLocationsModal(true);
  };

  const confirmStartLocationHandler = (e) => {
    e.preventDefault();
    let isFormValid =
      document.querySelector('.coordinates').value.indexOf(',') >= 1;
    if (isFormValid) {
      const [lat, lng] = document
        .querySelector('.coordinates')
        .value.split(',');
      const address = document.querySelector('.address').value;

      console.log(lat, lng, address);
      if (
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180 ||
        address.length <= 2
      ) {
        setError('The values are not correct!!!');
      } else {
        setStartLocation({
          coordinates: [lng, lat],
          address,
          description: address,
        });
        setOpenStartLocationModal();
        setConfirmedStartLocation(true);
      }
    } else {
      setError('Your coordinates are in wrong format...');
    }
  };

  const confirmStartDatesHandler = () => {
    const allStartDates = Array.from(document.querySelectorAll('.start-date'));
    let isValid = true;
    allStartDates.forEach((el) => {
      isValid = isValid && new Date(el.value).getTime() > new Date().getTime();
    });
    console.log(isValid);
    if (!isValid) {
      setError('Control all the dates. Dates should be in the future...');
    } else {
      let updatedDates = [];
      allStartDates.forEach((el) => {
        updatedDates.push(el.value);
      });
      setStartDates(updatedDates);
      setConfirmedStartDates(true);
      setOpenStartDatesModal();
    }
  };

  const inputNrLocationsHandler = (e) => {
    if (confirmedNrLocations) return;
    const newUpdatedData = { ...nrLocationsInput };

    newUpdatedData.value = e.target.value;
    newUpdatedData.touched = true;
    newUpdatedData.valid = checkValidity(
      newUpdatedData.value,
      newUpdatedData.validRequirements
    );

    setNrLocationsInput(newUpdatedData);

    let isFormValid = true;
    for (let key in newUpdatedData) {
      isFormValid = isFormValid && newUpdatedData.valid;
    }

    setNrLocationsInputValid(isFormValid);
  };

  const confirmLocationsHandler = (e) => {
    e.preventDefault();

    let updatedLocations = [];

    const locations = Array.from(document.querySelectorAll('.location'));
    const addresses = Array.from(document.querySelectorAll('.addressLocation'));

    let isValid = true;
    locations.forEach((loc) => {
      if (loc.value.indexOf(',') === 0) {
        isValid = false;
        setError(
          'The format of location is wrong...Use something like this: 42.345,23.5674'
        );
      }
      console.log(loc.value.split(',')[0], loc.value.split(',')[1]);
      if (
        +loc.value.split(',')[0] < -90 ||
        +loc.value.split(',')[0] > 90 ||
        +loc.value.split(',')[1] < -180 ||
        +loc.value.split(',')[1] > 180
      ) {
        isValid = false;
      }
    });

    if (!isValid) {
      setError('The values are wrong...Lat: [-90, 90] Lng: [-180, 180]');
    }

    let isValidAddress = true;
    addresses.forEach((address) => {
      if (address.value.length < 3) {
        isValidAddress = false;
      }
    });

    if (!isValidAddress) {
      setError('Address must be more than 2 characters.');
    }

    if (isValid && isValidAddress) {
      for (let i = 0; i < locations.length; i++) {
        updatedLocations.push({
          coordinates: [
            locations[i].value.split(',')[1],
            locations[i].value.split(',')[0],
          ],
          address: addresses[i].value,
          description: addresses[i].value,
        });
      }
      setLocations(updatedLocations);
      setConfirmedNrLocations(true);
      setOpenLocationsModal();
    }
  };

  let startDatesForm = [];
  for (let i = 1; i <= +tourData.nrStartDates.value; i++) {
    startDatesForm.push(
      <input
        className="input- start-date"
        type="date"
        placeholder="Start Date (${i})"
      />
    );
  }

  let locationsForm = [];
  for (let i = 0; i < nrLocationsInput.value; i++) {
    locationsForm.push(
      <div>
        <input
          className="input- location"
          placeholder={`Location (${i + 1})`}
          type="text"
        />
        <input
          className="input- addressLocation"
          type="text"
          placeholder={`Address (${i + 1})`}
        />
      </div>
    );
  }

  const confirmImagesHandler = () => {
    let isValid = true;
    isValid =
      isValid &&
      firstImage.isValid &&
      secondImage.isValid &&
      thirdImage.isValid;

    let images = [];
    if (isValid) {
      images.push(firstImage);
      images.push(secondImage);
      images.push(thirdImage);
    } else {
      setError('Please complete all the images correctly!');
    }

    setImages(images);
    setOpenImagesModal(false);
    setConfirmedImages(true);
  };

  const saveTour = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const imageData = new FormData();
    for (let i = 0; i < images.length; i++) {
      imageData.append('image', images[i].value);
    }

    for (let key in startLocation) {
      if (key === 'coordinates') {
        formData.append(key, JSON.stringify(startLocation[key]));
      } else formData.append(key, startLocation[key]);
    }

    formData.set('name', tourData.name.value);
    formData.set('duration', +tourData.duration.value);
    formData.set('maxGroupSize', +tourData.maxGroupSize.value);
    formData.set('price', +tourData.price.value);
    formData.set('difficulty', difficulty.value);
    formData.set('summary', tourData.summary.value);
    formData.set('description', tourData.description.value);
    formData.append('imageCover', imageCover.value);
    formData.set('startDates', JSON.stringify(startDates));
    formData.append('locations', JSON.stringify(locations));
    formData.set('startLocation', startLocation);
    formData.set('agency', props.agency._id);

    try {
      setLoading(true);
      const tour = await axios.post(`/api/v1/tours`, formData);
      await axios.patch(
        `/api/v1/agencies/${props.agency._id}/tours/${tour.data.data.id}`,
        imageData
      );
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="add__new__tour__container">
        {loading && <LoadingSpinner asOverlay />}
        {openStartDatesModal && (
          <Modal
            header="START DATES"
            show
            onCancel={() => setOpenStartDatesModal()}
          >
            {startDatesForm.map((el) => el)}
            <Button type="success" clicked={confirmStartDatesHandler}>
              Confirm Start Dates
            </Button>
          </Modal>
        )}
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
        {openStartLocationModal && (
          <Modal
            header={'START LOCATION'}
            show
            onCancel={() => setOpenStartLocationModal()}
          >
            <input
              className="input- coordinates"
              type="text"
              placeholder="Geographical Coordinates e.g (41.341530, 19.803328)"
            />
            <input
              className="input- address"
              type="text"
              placeholder="Address"
            />
            <Button
              type="success"
              type="success"
              clicked={confirmStartLocationHandler}
            >
              Confirm the Start Location
            </Button>
            <div>
              <a
                target="blank"
                className="add__tour--link"
                href="https://www.google.com/maps"
              >
                Don't know how to set the Latitude and Longitude of a plce?
                Click on the location and get the coordinates on this format
                (41.341530, 19.803328)
              </a>
            </div>
          </Modal>
        )}
        {openLocationsModal && (
          <Modal
            header="LOCATIONS"
            show
            onCancel={() => setOpenLocationsModal()}
          >
            {locationsForm.map((el) => el)}
            <Button type="success" clicked={confirmLocationsHandler}>
              Confirm your Locations
            </Button>
          </Modal>
        )}
        <h1>ADD A NEW TOUR</h1>
        <div>
          {formData.map((el) => el)}
          DIFFICULTY:{' '}
          <Select
            className="select"
            value={difficulty}
            onChange={handleChange}
            options={options}
          />
          <Button
            disabled={confirmedStartLocation}
            className="add__start__location--btn"
            type="success"
            clicked={openStartLocationHandler}
          >
            {confirmedStartLocation ? 'ADDED' : 'Add the start Location'}
          </Button>
          <Input
            value={nrLocationsInput.value}
            valid={nrLocationsInput.valid}
            touched={nrLocationsInput.touched}
            configOptions={nrLocationsInput.configOptions}
            onChange={(e) => inputNrLocationsHandler(e, nrLocationsInput)}
          />
          <Button
            disabled={confirmedNrLocations}
            className=""
            type="success"
            clicked={openNumberOfLocations}
          >
            {confirmedNrLocations ? 'ADDED' : 'Add number of locations'}
          </Button>
          <div className="add_tour__img--container">
            {previewUrl && <img className="add__tour--img" src={previewUrl} />}
            <ImageUpload
              title={'Set Cover Image of the tour!'}
              onInput={inputImageHandler}
            />
          </div>
          <div>
            <Button
              disabled={confirmedImages}
              type="success"
              clicked={() => setOpenImagesModal(true)}
            >
              {confirmedImages
                ? 'SELECTED'
                : 'Set at least 3 images for the tour!'}
            </Button>
          </div>
          {openImagesModal && (
            <Modal
              header="IMAGES OF THE TOUR!"
              show
              onCancel={() => setOpenImagesModal()}
            >
              <div className="add__tour__images">
                <div>
                  {firstUrl && (
                    <img className="add__tour--img" src={firstUrl} />
                  )}
                  <ImageUpload
                    title={'Image 1'}
                    onInput={(value, isValid) =>
                      inputImagesHandler('first', value, isValid)
                    }
                  />
                </div>
                <div>
                  {secondUrl && (
                    <img className="add__tour--img" src={secondUrl} />
                  )}
                  <ImageUpload
                    title={'Image 2'}
                    onInput={(value, isValid) =>
                      inputImagesHandler('second', value, isValid)
                    }
                  />
                </div>
                <div>
                  {thirdUrl && (
                    <img className="add__tour--img" src={thirdUrl} />
                  )}
                  <ImageUpload
                    title={'Image 1'}
                    onInput={(value, isValid) =>
                      inputImagesHandler('third', value, isValid)
                    }
                  />
                </div>
              </div>
              <Button
                disabled={confirmedImages}
                type="danger"
                clicked={confirmImagesHandler}
              >
                {confirmedImages ? 'CONFIRMED' : 'Confirm the images'}{' '}
              </Button>
            </Modal>
          )}
          <Button type="pink" clicked={saveTour}>
            Save & Create the Tour
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddNewTour;
