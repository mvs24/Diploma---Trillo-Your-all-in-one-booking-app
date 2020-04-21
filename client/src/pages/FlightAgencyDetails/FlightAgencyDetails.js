import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import Agency from '../../components/Agency/Agency';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Flight from '../../pages/Flights/Flight';

const FlightAgencyDetails = (props) => {
  const [agency, setAgency] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [myFlights, setMyFlights] = useState();
  const [myFlightsIds, setMyFlightsIds] = useState();
  const { isAuthenticated } = props;

  useEffect(() => {
    const agencyId = props.match.params.agencyId;
    const getAgency = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/agencies/${agencyId}`);
        setAgency(res.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response.data.message);
      }
    };

    getAgency();
  }, []);

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
    let myFlightsIds = [];
    if (myFlights) {
      myFlightsIds = myFlights.map((flight) => flight._id);
      setMyFlightsIds(myFlightsIds);
    }
  }, [myFlights]);

  if (!agency) return <LoadingSpinner asOverlay />;
  if (!myFlightsIds) return <LoadingSpinner />;

  return (
    <>
      {loading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal show onClear={() => setError(false)}>
          {error}
        </ErrorModal>
      )}
      <div className="agency__details--container">
        <Agency agency={agency} flight />
        <div>
          {agency.flights.map((flight) => (
            <Flight
              booked={myFlightsIds.includes(flight._id)}
              white
              flight={flight}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(FlightAgencyDetails);
