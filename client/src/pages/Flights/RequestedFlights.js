import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Flight from './Flight';
import qs from 'qs';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import axios from 'axios';

const RequestedFlights = (props) => {
  const [requestedFlights, setRequestedFlights] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const getRequestedFlights = async () => {
      try {
        setLoading(true);
        const data = qs.parse(props.location.search.split('?')[1]);
        let str = '';

        if (data.returnDate == 'null') {
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

  if (!requestedFlights) return <h1>No flights found...</h1>;

  if (!requestedFlights || requestedFlights.length === 0)
    return <h1>No flights found!</h1>;

  return (
    <div className="requestedFlights__container">
      {loading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal show onClear={() => setError()}>
          {error}
        </ErrorModal>
      )}
      <div className="flight__filters">Filters</div>
      <div className="all__flights">
        {requestedFlights.map((flight) => (
          <Flight flight={flight} />
        ))}
      </div>
    </div>
  );
};

export default RequestedFlights;
