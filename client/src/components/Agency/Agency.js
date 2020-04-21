import React from 'react';

export default (props) => {
  const { agency, flight } = props;
  if (!agency) return null;
  let image = `http://localhost:5000/${agency.image}`;
  if (flight) image = `http://localhost:5000${agency.image}`;

  return (
    <div
      className={`${
        props.changeBcg ? 'agency__change__bcg' : 'agency__details--info'
      } `}
    >
      <div className="agency__name">
        <h1>AGENCY: {agency.name.toUpperCase()}</h1>
        <span>
          <img src={image} />
        </span>
        <h1>CATEGORY: {agency.category.toUpperCase()}</h1>
      </div>
      <div className="inline__info">
        <h1 className="total__tours">
          <p>Total {flight ? 'Flights' : 'Tours'}</p>
          <p> {flight ? agency.flights.length : agency.tours.length}</p>
        </h1>
        <h1 className="total__tours">
          <p>BOOKED BY</p>
          <p>{agency.numOptionsBought}</p>
        </h1>
        <h1 className="total__tours">
          <p>RATING: </p>
          <p>{agency.ratingsAverage.toFixed(2)}</p>
        </h1>
      </div>

      <div className="agency__about--info">
        <h1>ABOUT US</h1>
        <p>{agency.description}</p>
      </div>
    </div>
  );
};
