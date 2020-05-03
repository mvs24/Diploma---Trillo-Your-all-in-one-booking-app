import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import Select from 'react-select';
import Modal from '../../shared/components/UI/Modal';
import { loadStripe } from '@stripe/stripe-js';
import Flight from './Flight';
import './FlightDetails.css';
import Button from '../../shared/components/Button/Button';
import ReviewFlightStatistics from './ReviewFlightStatistics';
import FlightMap from './FlightMap';
import Input from '../../shared/components/Input/Input';
import Textarea from '../../shared/components/Input/Textarea';
import moment from 'moment';

let options = [];
for (let i = 1; i <= 5; i++) {
  options.push({ value: i, label: i });
}

const FlightDetails = React.memo((props) => {
  const [flight, setFlight] = useState();
  const [myFlights, setMyFlights] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [agency, setAgency] = useState();
  const [loading, setLoading] = useState();
  const [openConfirmTickets, setOpenConfirmTickets] = useState();
  const [processBooking, setProcessBooking] = useState();
  const [booked, setBooked] = useState();
  const [page, setPage] = useState('info');
  const [error, setError] = useState();
  const [finishedFlights, setFinishedFlights] = useState();
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

  const [openPriceDiscountModal, setOpenPriceDiscountModal] = useState();
  const flightId = props.match.params.flightId;
  const { isAuthenticated } = props;
  useEffect(() => {
    const getFlight = async () => {
      let bookingRes;
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/flights/${flightId}`);
        const agencyRes = await axios.get(
          `/api/v1/agencies/${res.data.data.agency}`
        );
        const finishedRes = await axios.get(`/api/v1/flights/finishedFlights`);
        const finishedFlights = finishedRes.data.data.map((el) => el._id);
        setFinishedFlights(finishedFlights);
        if (props.isAuthenticated) {
          bookingRes = await axios.get(
            '/api/v1/bookings/flights/futureBookings'
          );
        }
        if (props.isAuthenticated) {
          setMyFlights(bookingRes.data.data);
          const myFlightsId = bookingRes.data.data.map((el) => el._id);
          if (myFlightsId.includes(flightId)) {
            setBooked(true);
          }
        }
        setLoading();
        setFlight(res.data.data);
        setAgency(agencyRes.data.data);
      } catch (err) {
        setLoading();
        setError(err.response.data.message);
      }
    };

    getFlight();
  }, [isAuthenticated]);

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

  if (!agency) return <LoadingSpinner asOverlay />;

  let ownerContent = null;
  if (isAuthenticated && agency.user === props.user.id) {
    ownerContent = (
      <Button type="pink" clicked={() => setOpenPriceDiscountModal(true)}>
        Make a Price Discount
      </Button>
    );
  }

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

  const openPage = (link) => {
    Array.from(document.querySelectorAll('.border__link')).forEach((el) =>
      el.classList.remove('border__link')
    );
    const links = Array.from(
      document.querySelectorAll('.flight__links__container li')
    );
    const selectedLink = links.filter((el) => el.dataset.link === link);
    selectedLink[0].classList.add('border__link');
    setPage(link);
  };

  if (loading) return <LoadingSpinner asOverlay />;
  if (!flight || !agency) return <h1>No flight found with that ID...</h1>;

  return (
    <div className="flightDetails__container">
      {error && (
        <ErrorModal show onClear={() => setError()}>
          {error}
        </ErrorModal>
      )}
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
      <div className="flight__container--1">
        <div className="flight__links__container">
          <li data-link="info" onClick={() => openPage('info')}>
            Info
          </li>
          <li data-link="reviews" onClick={() => openPage('reviews')}>
            Reviews
          </li>
          <li data-link="fromTo" onClick={() => openPage('fromTo')}>
            {' '}
            <span>From-To</span>
          </li>
        </div>
        {page === 'info' && (
          <div className="info__container">
            <div className="agency__info--1">
              <h2>Agency: {agency.name}</h2>
              <img src={`http://localhost:5000/${agency.image}`} />
              <Button
                type="success"
                clicked={() =>
                  props.history.push('/flights/agency/' + agency._id)
                }
              >
                Visit US!
              </Button>
            </div>
            <div className="agency__info--1">
              <h2>Type: {flight.variety}</h2>
              <h2>Depart: {moment(flight.depart).format('MMMM Do YYYY')}</h2>
              {flight.returnDate ? (
                <h2>
                  Return Date:{' '}
                  {moment(flight.returnDate).format('MMMM Do YYYY')}
                </h2>
              ) : (
                <h2>Return Date --- </h2>
              )}
            </div>
            <div className="agency__info--1">
              <h2>Booked by: {flight.numBought}</h2>
              <h2>Maximum Group Size: {flight.maxGroupSize}</h2>
              <h2>Package: {flight.package}</h2>
            </div>
            <div className="agency__info--1">
              {flight.priceDiscount ? (
                <h2 className="price__discount">
                  {flight.priceDiscountMessage ||
                    'We have made a price discount! Visit us to learn more!'}{' '}
                  ${flight.priceDiscount}
                </h2>
              ) : null}
              <h1 className="flight__price">
                Price/person:{' '}
                {flight.priceDiscount ? (
                  <strike>
                    ${flight.pricePerPerson + flight.priceDiscount}
                  </strike>
                ) : null}{' '}
                <strong>${flight.pricePerPerson}</strong>
              </h1>
              {finishedFlights.includes(flight._id) ? (
                <h1 className="finishedHeading">Finished</h1>
              ) : ownerContent ? (
                ownerContent
              ) : booked ? (
                <Button disabled={true}>Booked</Button>
              ) : (
                <Button type="blue" clicked={() => setOpenConfirmTickets(true)}>
                  Confirm Number of Tickets!
                </Button>
              )}
            </div>
          </div>
        )}
        {page === 'reviews' && (
          <div className="info__container">
            <ReviewFlightStatistics
              flightReviews={flight.reviews}
              flightId={flight._id}
            />
          </div>
        )}
        {page === 'fromTo' && (
          <FlightMap
            toLocation={flight.toLocation}
            fromLocation={flight.fromLocation}
          />
        )}
      </div>
    </div>
  );
});

const mapStateToProps = (state) => {
  return {
    user: state.user.userData,
    isAuthenticated: state.user.isAuthenticated,
  };
};

export default connect(mapStateToProps)(FlightDetails);
