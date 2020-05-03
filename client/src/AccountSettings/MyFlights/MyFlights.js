import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import axios from 'axios';
import Flight from '../../pages/Flights/Flight';
import './MyFlights.css';
import Button from '../../shared/components/Button/Button';

const MyBookings = (props) => {
  const [myFlights, setMyFlights] = useState();
  const [shouldFlightUpdate, setShouldFlightUpdate] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const start = 0;
  const [end, setEnd] = useState(5);
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

  if (!myFlights) return <LoadingSpinner asOverlay />;
  if (loading) return <LoadingSpinner asOverlay />;

  const showMoreHandler = () => {
    setEnd((prev) => prev + 5);
  };

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
    <>
      <div className="my__flights">
        {error && <ErrorModal>{error}</ErrorModal>}
        {myFlights.slice(start, end).map((flight) => (
          <Flight
            reviewUpdated={reviewUpdateHandler}
            myFlight
            flight={flight}
          />
        ))}
      </div>
      <div className="searchBtn--grid">
        {' '}
        <Button
          type="pink"
          disabled={end >= myFlights.length}
          clicked={showMoreHandler}
        >
          Show More
        </Button>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(MyBookings);
