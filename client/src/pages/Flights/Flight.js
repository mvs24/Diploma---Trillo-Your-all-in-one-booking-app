import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import { IconContext } from 'react-icons';
import {
  IoMdStar,
  IoIosStarOutline,
  IoIosStarHalf,
  IoMdStarOutline,
} from 'react-icons/io';
import Button from '../../shared/components/Button/Button';
import axios from 'axios';
import './Flight.css';
import Select from 'react-select';
import Modal from '../../shared/components/UI/Modal';
import { loadStripe } from '@stripe/stripe-js';
import Textarea from '../../shared/components/Input/Textarea';
import Input from '../../shared/components/Input/Input';

let options = [];
for (let i = 1; i <= 5; i++) {
  options.push({ value: i, label: i });
}

const StarCmp = (props) => (
  <IconContext.Provider
    value={{
      className: `icon__green tour__info--icon full star review--icon ${props.starName}`,
    }}
  >
    {props.children}
  </IconContext.Provider>
);

const Flight = (props) => {
  const [agency, setAgency] = useState();
  const [flight, setFlight] = useState(props.flight);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [openConfirmTickets, setOpenConfirmTickets] = useState();
  const [processBooking, setProcessBooking] = useState();
  const [review, setReview] = useState();
  const [openReviewModal, setOpenReviewModal] = useState();
  const [reviewed, setReviewed] = useState();
  const [reviewId, setReviewId] = useState();
  const [openPriceDiscountModal, setOpenPriceDiscountModal] = useState();
  const [inputPriceDiscount, setInputPriceDiscount] = useState({
    configOptions: {
      type: 'number',
      placeholder: 'Price Discount',
    },
    value: '',
    valid: true,
    touched: false,
    validRequirements: {
      required: true,
      minValue: 1,
    },
  });
  const [messageDiscount, setMessageDiscount] = useState({
    configOptions: {
      type: 'text',
      placeholder:
        'This message will go to all the users who has booked one of your flight as a notification! If you do not send a message we will provide a message for you. (Max: 35 characters)',
    },
    value: '',
    valid: true,
    touched: false,
    validRequirements: {},
  });
  const [myReview, setMyReview] = useState({
    configOptions: {
      type: 'text',
      placeholder: 'Your Review',
    },
    value: '',
    valid: true,
    touched: false,
    validRequirements: {},
  });
  const history = useHistory();
  const { isAuthenticated } = props;

  useEffect(() => {
    const getAgency = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/agencies/${flight.agency}`);
        setAgency(res.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response.data.message);
      }
    };

    getAgency();
  }, [flight]);

  useEffect(() => {
    const getMyReviews = async () => {
      const res = await axios.get(`/api/v1/users/my/reviews/flights`);
      const flightIds = res.data.data.map((flight) => flight.flight);

      if (flightIds.includes(flight._id)) {
        const myRev = res.data.data.find((el) => el.flight === flight._id);
        setReviewed(true);
        setReview(myRev.rating);
        setReviewId(myRev._id);
      }
    };

    getMyReviews();
  }, [flight]);

  if (!agency) return <LoadingSpinner asOverlay />;

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API);

  const bookFlight = async () => {
    const nrTickes = selectedOption.value;
    try {
      if (props.isAuthenticated) {
        setProcessBooking(true);
      }
      const stripe = await stripePromise;
      const session = await axios.post(
        `/api/v1/bookings/flights/checkout-session/${flight._id}`,
        { numPersons: nrTickes }
      );

      await stripe.redirectToCheckout({
        sessionId: session.data.session.id,
      });

      setProcessBooking(true);
    } catch (err) {
      setProcessBooking();
      setError(err.response.data.message);
    }
  };

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const visitAgencyHandler = () => {
    history.push(`/flights/agency/${flight.agency}`);
  };

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

    if (requirements.minValue) {
      isValid = isValid && value >= requirements.minValue;
    }
    if (requirements.maxValue) {
      isValid = isValid && value <= requirements.maxValue;
    }

    return isValid;
  };

  const textInputHandler = (e) => {
    const updatedReview = { ...myReview };
    updatedReview.value = e.target.value;
    updatedReview.touched = true;
    updatedReview.valid = checkValidity(
      updatedReview.value,
      updatedReview.validRequirements
    );

    setMyReview(updatedReview);
  };

  let returnDt;
  if (flight.returnDate) {
    returnDt = flight.returnDate.split('T')[0];
  }

  let reviewToUpdate = [];
  if (!review) {
    for (let i = 1; i <= 5; i++) {
      reviewToUpdate.push(
        <StarCmp starName={`star-${i}`}>
          <IoIosStarOutline data-review={`${i}`} />
        </StarCmp>
      );
    }
  } else {
    for (let i = 1; i <= 5; i++) {
      if (i <= review) {
        reviewToUpdate.push(
          <StarCmp starName={`star-${i}`}>
            <IoMdStar data-review={`${i}`} />
          </StarCmp>
        );
      } else {
        reviewToUpdate.push(
          <StarCmp starName={`star-${i}`}>
            <IoIosStarOutline data-review={`${i}`} />
          </StarCmp>
        );
      }
    }
  }

  const reviewHandler = (e) => {
    if (e.target.closest('svg')) {
      const review = e.target.closest('svg').getAttribute('data-review');
      setReview(review);
      setOpenReviewModal(true);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const data = {
      review: myReview.value,
      rating: review,
    };

    try {
      let res;
      if (!reviewed) {
        res = await axios.post(`/api/v1/flights/${flight._id}/reviews`, data);
        setReviewId(res.data.data._id);
      } else {
        res = await axios.patch(
          `/api/v1/flights/${flight._id}/reviews/${reviewId}`,
          data
        );
        setReviewId(res.data.data._id);
      }
      props.reviewUpdated();
      setReviewed(true);
      setOpenReviewModal(false);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const visitFlightHandler = () => {
    history.push('/flights/' + flight._id);
  };

  const priceDiscountHandler = (e) => {
    const updatedData = { ...inputPriceDiscount };

    updatedData.value = e.target.value;
    updatedData.touched = true;
    updatedData.valid = checkValidity(
      updatedData.value,
      updatedData.validRequirements
    );

    setInputPriceDiscount(updatedData);
  };

  const priceDiscountMessageHandler = (e) => {
    const updatedData = { ...messageDiscount };

    updatedData.value = e.target.value;
    updatedData.touched = true;
    updatedData.valid = checkValidity(
      updatedData.value,
      updatedData.validRequirements
    );

    setMessageDiscount(updatedData);
  };

  const makePriceDiscountHandler = async () => {
    const data = {
      priceDiscount: +inputPriceDiscount.value,
      message: messageDiscount.value,
    };
    try {
      setLoading(true);
      const res = await axios.patch(
        `/api/v1/flights/${flight._id}/price-discount`,
        data
      );
      setFlight(res.data.data);
      setOpenPriceDiscountModal();
      setLoading();
    } catch (err) {
      setLoading();
      setError(err.response.data.message);
    }
  };

  const dec = +flight.ratingsAverage.toFixed(2).toString().substring(0, 1);
  const fr = +flight.ratingsAverage.toFixed(2).toString().substring(2, 3);
  let nrFr = +fr;

  let halfStar = (
    <IconContext.Provider
      value={{
        className: 'icon__green tour__info--icon full star flight__star',
      }}
    >
      <IoIosStarHalf />
    </IconContext.Provider>
  );
  if (nrFr === 0) {
    halfStar = null;
  } else if (nrFr.toFixed(1) > 7) {
    halfStar = (
      <IconContext.Provider
        value={{
          className: 'icon__green tour__info--icon full star flight__star',
        }}
      >
        <IoMdStar />
      </IconContext.Provider>
    );
  } else if (nrFr.toFixed(1) < 2.5) {
    halfStar = (
      <IconContext.Provider
        value={{
          className: 'icon__green tour__info--icon full star flight__star',
        }}
      >
        <IoMdStarOutline />
      </IconContext.Provider>
    );
  }

  let stars = [];
  for (let i = 0; i < dec; i++) {
    stars.push(
      <IconContext.Provider
        value={{
          className: 'icon__green tour__info--icon full star flight__star',
        }}
      >
        <IoMdStar />
      </IconContext.Provider>
    );
  }

  let flightOwnerContent = null;

  let myFlightContent = null;
  if (!props.myFlight) {
    myFlightContent = (
      <Button
        disabled={props.booked}
        clicked={() => {
          if (props.isAuthenticated) {
            setOpenConfirmTickets(true);
          } else {
            setError('You need to be logged in to book a flight!');
          }
        }}
        type="blue"
      >
        {props.booked ? 'Booked' : 'Confirm number of tickets'}
      </Button>
    );
  } else {
    myFlightContent = (
      <div className="review__flight">
        {reviewed ? <h5>Update your Review</h5> : <h5>Leave a review</h5>}
        {reviewed ? (
          <p onClick={reviewHandler}>{reviewToUpdate.map((el) => el)}</p>
        ) : (
          <p onClick={reviewHandler}>{reviewToUpdate.map((el) => el)}</p>
        )}
      </div>
    );
  }

  if (!agency) return <LoadingSpinner asOverlay />;

  if (props.isAuthenticated && agency.user === props.user.id) {
    flightOwnerContent = null;
  } else {
    flightOwnerContent = myFlightContent;
  }

  return (
    <div className="flight__container">
      {loading && <LoadingSpinner asOverlay />}
      {openPriceDiscountModal && (
        <Modal
          onCancel={() => setOpenPriceDiscountModal()}
          show
          header="Make a Price Discount"
        >
          <Input
            value={inputPriceDiscount.value}
            valid={inputPriceDiscount.valid}
            touched={inputPriceDiscount.touched}
            configOptions={inputPriceDiscount.configOptions}
            onChange={(e) => priceDiscountHandler(e)}
          />
          <Textarea
            className="flight__text__discount"
            value={messageDiscount.value}
            valid={messageDiscount.valid}
            touched={messageDiscount.touched}
            configOptions={messageDiscount.configOptions}
            onChange={(e) => priceDiscountMessageHandler(e)}
          />
          <Button clicked={makePriceDiscountHandler} type="pink">
            Make a Price Discount
          </Button>
        </Modal>
      )}
      {openReviewModal && (
        <Modal
          onCancel={() => {
            setOpenReviewModal(false);
          }}
          header={'FEEDBACK'}
          show
        >
          <div className="review__center">
            {' '}
            <h1 className="leave__review--heading your__review--heading">
              {' '}
              Your Rating:{' '}
            </h1>{' '}
            <p onClick={reviewHandler} className="my__review--stars">
              {reviewToUpdate.map((el) => el)}
            </p>
          </div>
          <div className="review__form" onSubmit={submitReview}>
            <Textarea
              touched={myReview.touched}
              valid={myReview.valid}
              configOptions={myReview.configOptions}
              onChange={textInputHandler}
            />
            <Button clicked={submitReview} type="success">
              Leave your review!
            </Button>
          </div>
        </Modal>
      )}
      {error && (
        <ErrorModal show onClear={() => setError()}>
          {error}
        </ErrorModal>
      )}
      {openConfirmTickets && (
        <Modal
          show
          header="Confirm Number of Tickets"
          onCancel={() => setOpenConfirmTickets()}
        >
          <div>
            <Select
              value={selectedOption}
              onChange={handleChange}
              options={options}
            />
            <Button
              disabled={processBooking}
              type="success"
              className="bookNow__btn"
              clicked={bookFlight}
            >
              {processBooking ? 'Processing' : 'Book Now'}
            </Button>
          </div>
        </Modal>
      )}
      <div className="flight__info">
        <p>Agency: {agency.name}</p>
        <p className="flight__rating__container">
          {' '}
          <span>Average Rating: </span>
          <span>
            {' '}
            {stars.map((star) => star)}
            {halfStar}
          </span>{' '}
          ({flight.ratingsAverage})
        </p>

        <p>Type: {flight.variety}</p>
        <p>
          <span> Depart: {flight.depart.split('T')[0]} </span>
          {flight.time ? <strong>:{flight.time}</strong> : null}
        </p>
        <p>
          {returnDt ? (
            <span>Return Date:{returnDt} </span>
          ) : (
            <span>Return Date: ---</span>
          )}{' '}
        </p>
      </div>
      <div className="from__to">
        <p>{flight.package}</p>

        <p>FROM: {flight.from}</p>
        <p>TO: {flight.to}</p>

        {flight.priceDiscount ? (
          <p className="flight__price">
            Price/person:{' '}
            {flight.priceDiscount ? (
              <strike>${flight.pricePerPerson + flight.priceDiscount}</strike>
            ) : null}{' '}
            <strong>${flight.pricePerPerson}</strong>
          </p>
        ) : (
          <p>
            Price/person:{' '}
            {flight.priceDiscount ? (
              <strike className="flight__price">
                ${flight.pricePerPerson + flight.priceDiscount}
              </strike>
            ) : null}{' '}
            <strong>${flight.pricePerPerson}</strong>
          </p>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1.5rem',
        }}
      >
        <Button type="success" clicked={visitAgencyHandler}>
          VISIT AGENCY
        </Button>
        {!props.flightDetails && (
          <Button type="blue" clicked={visitFlightHandler}>
            VISIT FLIGHT
          </Button>
        )}
        <img
          className="flight__img"
          src={`http://localhost:5000/${agency.image}`}
        />

        {props.owner ? (
          <Button clicked={() => setOpenPriceDiscountModal(true)} type="pink">
            Make a price discount
          </Button>
        ) : null}
        {flightOwnerContent}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
  user: state.user.userData,
});

export default connect(mapStateToProps)(Flight);
