import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import Flight from '../Flights/Flight';
import './AllFlights.css';
import Button from '../../shared/components/Button/Button';
import { IconContext } from 'react-icons';
import { MdFilterList } from 'react-icons/md';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import {
  IoIosStarHalf,
  IoMdStar,
  IoMdStarOutline,
  IoIosStarOutline,
  IoIosArrowBack,
  IoIosArrowForward,
} from 'react-icons/io';
import Select from 'react-select';

const options = [
  { value: 'mostReviewed', label: 'Most Reviewed' },
  { value: 'highestRated', label: 'Highest Rated' },
  { value: 'lowestPrice', label: 'Lowest Price' },
  { value: 'highestPrice', label: 'Highest Price' },
  { value: 'maxGroupSize', label: 'Maximum Participants' },
  { value: 'mostPopular', label: 'Most popular' },
];

const AllFlights = (props) => {
  const [flights, setFlights] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [end, setEnd] = useState(10);
  const [selectedOption, setSelectedOption] = useState(null);
  const [openRatings, setOpenRatings] = useState();
  const [totalFlights, setTotalFlights] = useState();
  const [checkedIn, setCheckedIn] = useState([]);
  const [radioValue, setRadioValue] = useState();
  const [selectedRating, setSelectedRating] = useState();

  const start = 0;

  useEffect(() => {
    const getFlights = async () => {
      setLoading(true);
      let res;
      if (selectedRating) {
        res = await axios.get(
          `/api/v1/flights?ratingsAverage[gte]=${selectedRating}`
        );
      } else {
        res = await axios.get('/api/v1/flights');
      }
      setLoading();
      setTotalFlights(res.data.results);
      setFlights(res.data.data);
      setEnd(10);
    };

    getFlights();
  }, [selectedRating]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    const selectedValue = selectedOption.value;

    switch (selectedValue) {
      case 'mostReviewed':
        sortBySelection('-ratingsQuantity');
        break;
      case 'highestRated':
        sortBySelection('-ratingsAverage');
        break;
      case 'lowestPrice':
        sortBySelection('pricePerPerson');
        break;
      case 'highestPrice':
        sortBySelection('-pricePerPerson');
        break;
      case 'maxGroupSize':
        sortBySelection('-maxGroupSize');
        break;
      case 'mostPopular':
        sortBySelection('-numBought');
        break;
      default:
        sortBySelection('pricePerPerson');
    }
  };

  const sortBySelection = async (selectedType) => {
    let res;
    if (selectedRating) {
      setLoading(true);
      res = await axios.get(
        `/api/v1/flights?ratingsAverage[gte]=${selectedRating}&sort=${selectedType}`
      );
      setLoading();
      setTotalFlights(res.data.results);
      setFlights(res.data.data);
    } else {
      setLoading(true);
      res = await axios.get(`/api/v1/flights?sort=${selectedType}`);
      setLoading();
      setTotalFlights(res.data.results);
      setFlights(res.data.data);
    }
  };

  const showMoreHandler = () => {
    setEnd((prev) => prev + 10);
  };

  const openRatingsHandler = () => {
    setOpenRatings((prevState) => !prevState);
  };

  if (loading) return <LoadingSpinner asOverlay />;
  if (!flights) return <LoadingSpinner asOverlay />;
  if (flights && flights.length === 0)
    return <h1>No flights found at this moment...</h1>;

  let firstStars = [];
  for (let i = 0; i < 5; i++) {
    if (i < 4) {
      firstStars.push(
        <IconContext.Provider
          value={{ className: 'blue__review tour__info--icon full star' }}
        >
          <IoMdStar />
        </IconContext.Provider>
      );
    } else {
      firstStars.push(
        <IconContext.Provider
          value={{ className: 'blue__review tour__info--icon full star' }}
        >
          <IoIosStarHalf />
        </IconContext.Provider>
      );
    }
  }

  let secondStars = [];
  for (let i = 0; i < 5; i++) {
    if (i < 4) {
      secondStars.push(
        <IconContext.Provider
          value={{ className: 'blue__review tour__info--icon full star' }}
        >
          <IoMdStar />
        </IconContext.Provider>
      );
    } else {
      secondStars.push(
        <IconContext.Provider
          value={{ className: 'blue__review tour__info--icon full star' }}
        >
          <IoIosStarOutline />
        </IconContext.Provider>
      );
    }
  }

  let thirdStars = [];
  for (let i = 0; i < 5; i++) {
    if (i < 3) {
      thirdStars.push(
        <IconContext.Provider
          value={{ className: 'blue__review tour__info--icon full star' }}
        >
          <IoMdStar />
        </IconContext.Provider>
      );
    } else if (i === 3) {
      thirdStars.push(
        <IconContext.Provider
          value={{ className: 'blue__review tour__info--icon full star' }}
        >
          <IoIosStarHalf />
        </IconContext.Provider>
      );
    } else {
      thirdStars.push(
        <IconContext.Provider
          value={{ className: 'blue__review tour__info--icon full star' }}
        >
          <IoIosStarOutline />
        </IconContext.Provider>
      );
    }
  }

  const radioHandler = async (e) => {
    const rating = +e.target.value;
    setSelectedRating(rating);
  };

  console.log(start, end);

  const allFlights = flights.slice(start, end);
  console.log(allFlights);
  return (
    <div className="all__flights__container">
      <h1 className="all__flights__heading">
        All Future Flights ({totalFlights})
      </h1>
      <div className="all__flights__filter">
        <div onClick={openRatingsHandler} className=" allFlights__filter">
          <div className="filter__flex">
            <p className="second">Filter by Ratings</p>
            <IconContext.Provider
              value={{ className: 'blue__review tour__info--icon' }}
            >
              {!openRatings ? <FaArrowDown /> : <FaArrowUp />}
            </IconContext.Provider>
          </div>
        </div>
        {openRatings && (
          <div className="">
            <div className="input__flex">
              <input
                name="radioGroup"
                onChange={radioHandler}
                type="radio"
                value="4.5"
                checked={selectedRating === 4.5}
              />
              <label>{firstStars.map((el) => el)} 4.5 & up</label>
            </div>
            <div className="input__flex">
              {' '}
              <input
                name="radioGroup"
                onChange={radioHandler}
                type="radio"
                value="4"
                checked={selectedRating === 4}
              />
              <label>{secondStars.map((el) => el)} 4 & up</label>
            </div>
            <div className="input__flex">
              {' '}
              <input
                name="radioGroup"
                onChange={radioHandler}
                type="radio"
                value="3.5"
                checked={selectedRating === 3.5}
              />
              <label>{thirdStars.map((el) => el)} 3.5 & up</label>
            </div>
            <div className="input__flex">
              {' '}
              <input
                name="radioGroup"
                onChange={radioHandler}
                type="radio"
                value="0"
                checked={selectedRating === 0}
              />
              <label>{thirdStars.map((el) => el)} 0.0 & up</label>
            </div>
          </div>
        )}
        <Select
          value={selectedOption}
          onChange={handleChange}
          options={options}
          className="select__flights"
        />
      </div>

      <div className="all__flights__item">
        {error && (
          <ErrorModal show onClear={() => setError()}>
            {error}
          </ErrorModal>
        )}
        {allFlights.map((flight) => (
          <Flight flight={flight} />
        ))}
      </div>
      <div className="allFlights__btn__container">
        <Button
          disabled={totalFlights <= end}
          className="showMore__button"
          type="blue"
          clicked={showMoreHandler}
        >
          Show More
        </Button>
      </div>
    </div>
  );
};

export default AllFlights;
