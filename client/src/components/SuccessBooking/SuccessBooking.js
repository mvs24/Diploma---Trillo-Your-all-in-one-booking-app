import React, { useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const SuccessBooking = (props) => {
  useEffect(() => {
    const data = {
      tour: props.match.params.tourId,
      user: props.match.params.userId,
      price: props.match.params.price * 1,
    };
    axios
      .post('/api/v1/bookings/tours/' + data.tour, data)
      .then()
      .catch((err) => console.log(err.response.data));
  }, []);

  return <Redirect to="/" />;
};

export default SuccessBooking;
