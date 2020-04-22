import React, { useState, useEffect } from 'react';

const FlightDetails = (props) => {
  const [flight, setFlight] = useState();
  const flightId = props.match.params.flightId;

  useEffect(() => {
    // get flight and give the datails
  }, []);
  return <div></div>;
};

export default FlightDetails;
