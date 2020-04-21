import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';

import Button from '../../shared/components/Button/Button';
import axios from 'axios';
import './Flight.css';
import Select from 'react-select';
import Modal from '../../shared/components/UI/Modal';
import { loadStripe } from '@stripe/stripe-js';

let options = [];
for (let i = 1; i <= 5; i++) {
  options.push({ value: i, label: i });
}

const Flight = (props) => {
  const { flight } = props;
  const [agency, setAgency] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [openConfirmTickets, setOpenConfirmTickets] = useState();
  const [processBooking, setProcessBooking] = useState();
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

  let returnDt;
  if (flight.returnDate) {
    returnDt = flight.returnDate.split('T')[0];
  }

  return (
    <div className="flight__container">
      {loading && <LoadingSpinner asOverlay />}
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

        <p>
          Price per person: <strong> ${flight.pricePerPerson}</strong>
        </p>
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
        <img
          className="flight__img"
          src={`http://localhost:5000${agency.image}`}
        />

        {!props.myFlight ? (
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
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(Flight);
