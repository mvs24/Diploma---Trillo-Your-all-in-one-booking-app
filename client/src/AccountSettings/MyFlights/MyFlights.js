import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import axios from 'axios';
import Flight from '../../pages/Flights/Flight';
import './MyFlights.css';

const MyBookings = (props) => {
  const [myFlights, setMyFlights] = useState([]);
  const [shouldFlightUpdate, setShouldFlightUpdate] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const { isAuthenticated } = props;

  useEffect(() => {
    const getMyFlights = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/v1/bookings/flights/futureBookings');
        setLoading(false);
        setMyFlights(res.data.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };

    if (isAuthenticated) {
      getMyFlights();
    }
  }, [isAuthenticated, shouldFlightUpdate]);

  if (loading) return <LoadingSpinner asOverlay />;

  if (myFlights.length === 0)
    return (
      <div className="wish__data">
        <h1>You have not booked a flight yet!</h1>
      </div>
    );

  const reviewUpdateHandler = () => {
    setShouldFlightUpdate((prev) => !prev);
  };

  return (
    <div className="my__flights">
      {error && <ErrorModal>{error}</ErrorModal>}
      {myFlights.map((flight) => (
        <Flight reviewUpdated={reviewUpdateHandler} myFlight flight={flight} />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(MyBookings);
