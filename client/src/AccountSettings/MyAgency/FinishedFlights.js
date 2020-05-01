import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Button from '../../shared/components/Button/Button';
import './EditAgency.css';
import Flight from '../../pages/Flights/Flight';

const FinishedFlights = ({ agency }) => {
  const [finishedFlights, setFinishedFlights] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getFinishedFlights = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/v1/agencies/${agency._id}/flights/finishedFlights`
        );
        setFinishedFlights(res.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response.data.message);
      }
    };

    getFinishedFlights();
  }, []);

  if (!finishedFlights) return <LoadingSpinner asOverlay />;
  if (finishedFlights.length === 0)
    return (
      <div className="edit__agency--container">
        No finished Flights found! Keep going!
      </div>
    );

  return (
    <div className="edit__agency--container">
      {finishedFlights.map((flight) => (
        <Flight key={flight._id} flight={flight} />
      ))}
    </div>
  );
};

export default FinishedFlights;
