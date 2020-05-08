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
  const start = 0;
  const [end, setEnd] = useState(5);

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

  const showMoreHandler = () => {
    setEnd((prev) => prev + 5);
  };

  if (!finishedFlights) return <LoadingSpinner asOverlay />;
  if (finishedFlights.length === 0)
    return (
      <div className="my__agencyFlights"> <h1 className='finishedToursHeading1'>No Finished Flights found</h1></div> 
    );

  return (
    <div className="my__agencyFlights">
      <h1 className="my__wishlist--heading">
        FINISHED FLIGHTS ({finishedFlights.length}) 
      </h1>
      {finishedFlights.slice(start, end).map((flight) => (
        <Flight key={flight._id} flight={flight} />
      ))}
      <div className="showMoreFlightsHandler__btn---1">
        <Button
          type="pink"
          disabled={end >= finishedFlights.length}
          clicked={showMoreHandler}
        >
          Show More
        </Button>
      </div>
    </div>
  );
};

export default FinishedFlights;
