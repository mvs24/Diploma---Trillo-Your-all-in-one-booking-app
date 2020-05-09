import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Flight from './Flight';
import qs from 'qs';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import axios from 'axios';
import Button from '../../shared/components/Button/Button';

const RequestedFlights = (props) => {
  const [requestedFlights, setRequestedFlights] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [myFlights, setMyFlights] = useState();
  const [myFlightsIds, setMyFlightsIds] = useState();
  const start = 0;
  const [end, setEnd] = useState(4);
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
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      let myFlightsIds = [];
      if (myFlights) {
        myFlightsIds = myFlights.map((flight) => flight._id);
        setMyFlightsIds(myFlightsIds);
      }
    }
  }, [myFlights, isAuthenticated]);

  useEffect(() => {
    const getRequestedFlights = async () => {
      try {
        setLoading(true);
        const data = qs.parse(props.location.search.split('?')[1]);
        let str = '';

        if (!data.returnDate) {
          str = `/api/v1/flights/searchedFlights?variety=${data.variety}&from=${data.from}&to=${data.to}&depart=${data.depart}&package=${data.package}`;
        } else {
          str = `/api/v1/flights/searchedFlights?variety=${data.variety}&from=${data.from}&to=${data.to}&depart=${data.depart}&package=${data.package}&returnDate=${data.returnDate}`;
        }

        const res = await axios.get(str);
        setLoading();
        setRequestedFlights(res.data.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };

    getRequestedFlights();
  }, []);

  const showMoreHandler = () => {
    setEnd((prev) => prev + 4);
  };

  if (loading) return <LoadingSpinner asOverlay />;
  if (!requestedFlights) return <h1>No flights found...</h1>;
  if (isAuthenticated) {
    if (!myFlightsIds) return <LoadingSpinner asOverlay />;
  }

  if (!requestedFlights || requestedFlights.length === 0)
    return <h1>No flights found!</h1>;

  return (
    <div className="requestedFlights__container">
      {loading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal show onClear={() => setError()}>
          {error ? error : 'Something went wrong!'}
        </ErrorModal>
      )}
      <div className="all__flights">
        {requestedFlights.slice(start, end).map((flight) => (
          <Flight
            booked={isAuthenticated ? myFlightsIds.includes(flight._id) : false}
            flight={flight}
          />
        ))}
        <div className="finishedToursButton">
          <Button
            type="blue"
            disabled={end >= requestedFlights.length}
            clicked={showMoreHandler}
          >
            Show More
          </Button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(RequestedFlights);
