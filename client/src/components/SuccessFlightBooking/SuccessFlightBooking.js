import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const SuccessFlightBooking = (props) => {
  useEffect(() => {
    const data = {
      flight: props.match.params.flightId,
      numPersons: props.match.params.numPersons,
    };
    axios
      .post('/api/v1/bookings/flights/' + data.flight, {
        numPersons: data.numPersons,
      })
      .then()
      .catch((err) => console.log(err.response.data));
  }, []);

  return <Redirect to="/my-flights" />;
};

export default SuccessFlightBooking;
