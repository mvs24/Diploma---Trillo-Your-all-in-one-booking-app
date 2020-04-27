import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

let options = [];
for (let i = 1; i <= 5; i++) {
  options.push({ value: i, label: i });
}

const FlightDetails = (props) => {
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
  const flightId = props.match.params.flightId;

  useEffect(() => {
    const getFlight = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/flights/${flightId}`);
        const agencyRes = await axios.get(
          `/api/v1/agencies/${res.data.data.agency}`
        );
        const bookingRes = await axios.get(
          '/api/v1/bookings/flights/futureBookings'
        );
        setMyFlights(bookingRes.data.data);
        const myFlightsId = bookingRes.data.data.map((el) => el._id);
        if (myFlightsId.includes(flightId)) {
          setBooked(true);
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
  }, []);

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
              <h2>Depart: {flight.depart}</h2>
              {flight.returnDate ? (
                <h2>Return Date: {flight.returnDate}</h2>
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
              <h1>
                Price/person: <strong>${flight.pricePerPerson}</strong>
              </h1>
              {booked ? (
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
            <ReviewFlightStatistics flightId={flight._id} />
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
};

export default FlightDetails;
