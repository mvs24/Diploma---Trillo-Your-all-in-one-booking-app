import React from 'react';
import { connect } from 'react-redux';
import Flight from './Flight';

const RequestedFlights = (props) => {
  const { requestedFlights } = props;
  console.log(requestedFlights);
  if (!requestedFlights || requestedFlights.length === 0)
    return <h1>No flights found!</h1>;

  return (
    <div className="requestedFlights__container">
      <div className="flight__filters">Filters</div>
      <div className="all__flights">
        {requestedFlights.map((flight) => (
          <Flight flight={flight} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  requestedFlights: state.flights.requestedFlights,
});

export default connect(mapStateToProps)(RequestedFlights);
