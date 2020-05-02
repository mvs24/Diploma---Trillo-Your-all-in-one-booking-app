import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Input from '../../shared/components/Input/Input';
import Textarea from '../../shared/components/Input/Textarea';
import Button from '../../shared/components/Button/Button';
import TourItem from '../../components/TourItem/TourItem';
import './EditAgency.css';

const FinishedTours = ({ agency }) => {
  const [finishedTours, setFinishedTours] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const getFinishedTours = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/v1/agencies/${agency._id}/tours/finishedTours`
        );
        setFinishedTours(res.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response.data.message);
      }
    };

    getFinishedTours();
  }, []);

  if (!finishedTours) return <LoadingSpinner asOverlay />;
  if (finishedTours.length === 0)
    return (
      <div className="edit__agency--container">
        <div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ marginBottom: '4rem' }}>No Finished Tour found!</h1>
          </div>
        </div>
      </div>
    );

  return (
    <div className="edit__agency--container">
      {finishedTours.map((tour) => (
        <TourItem key={tour._id} finished tour={tour} />
      ))}
    </div>
  );
};

export default FinishedTours;