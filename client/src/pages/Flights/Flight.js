import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Button from '../../shared/components/Button/Button';
import axios from 'axios';
import './Flight.css';

const Flight = ({ flight }) => {
  console.log(flight);
  const [agency, setAgency] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const getAgency = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/agencies/${flight.agency}`);
        setAgency(res.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response.data.message);
      }
    };

    getAgency();
  }, [flight]);

  if (!agency) return <LoadingSpinner asOverlay />;

  return (
    <div className="flight__container">
      {loading && <LoadingSpinner asOverlay />}
      <div className="flight__info">
        <img src={`http://localhost:5000${agency.image}`} />
        <p>Agency: {agency.name}</p>
        <p>{flight.package}</p>
        <p>Depart: {flight.time}</p>
        <p>Price per person: ${flight.pricePerPerson}</p>
      </div>
      <Button type="blue">Confirm number of tickets</Button>
    </div>
  );
};

export default Flight;
