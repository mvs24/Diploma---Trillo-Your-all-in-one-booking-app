import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
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

  const stripePromise = loadStripe(
    'pk_test_zUIsJ0pP0ioBysHoQcStX9cC00X97vuB7d'
  );

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

  return (
    <div className="flight__container">
      {loading && <LoadingSpinner asOverlay />}
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
              type="success"
              className="bookNow__btn"
              clicked={bookFlight}
            >
              Book Now
            </Button>
          </div>
        </Modal>
      )}
      <div className="flight__info">
        <img src={`http://localhost:5000${agency.image}`} />
        <p>Agency: {agency.name}</p>
        <p>{flight.package}</p>
        <p>Depart: {flight.time}</p>
        <p>Price per person: ${flight.pricePerPerson}</p>
      </div>
      <Button clicked={() => setOpenConfirmTickets(true)} type="blue">
        Confirm number of tickets
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(Flight);
