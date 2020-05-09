import React, { useState, useEffect } from 'react';
import axios from 'axios';

import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import Button from '../../shared/components/Button/Button';
import TourItem from '../../components/TourItem/TourItem';
import './EditAgency.css';
import './FinishedTours.css';

const FinishedTours = ({ agency }) => {
  const [finishedTours, setFinishedTours] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const start = 0;
  const [end, setEnd] = useState(6);

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

  const showMoreHandler = () => {
    setEnd((prev) => prev + 6);
  };

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
    <div className="my__tours__1">
      {loading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal show onClear={() => setError()}>
          {error ? error : 'Something went wrong'}
        </ErrorModal>
      )}
      <h1 className="finishedToursHeading1">
        Finished Tours ({finishedTours.length})
      </h1>
      <div className="finishedToursGrid">
        {finishedTours.slice(start, end).map((tour) => {
          return <TourItem finished tour={tour} />;
        })}
      </div>
      <div className="showMoreFinishedToursBtn">
        <Button
          type="pink"
          disabled={end >= finishedTours.length}
          clicked={showMoreHandler}
        >
          Show More
        </Button>
      </div>
    </div>
  );
};

export default FinishedTours;
