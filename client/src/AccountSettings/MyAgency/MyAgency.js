import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Agency from '../../components/Agency/Agency';
import TourItem from '../../components/TourItem/TourItem';
import './MyAgency.css';
import EditAgency from './EditAgency';
import AddNewTour from './AddNewTour';

const MyAgency = (props) => {
  const [myAgency, setMyAgency] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [myTours, setMyTours] = useState();
  const [display, setDisplay] = useState('agency');
  const [shouldUpdate, setShouldUpdate] = useState();
  const tours = useRef();
  const editAgency = useRef();
  const agency = useRef();
  const addTour = useRef();

  useEffect(() => {
    const getMyAgency = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/users/my/agency`);
        const tourRes = await axios.get(
          `/api/v1/agencies/${res.data.data._id}/tours`
        );
        setMyTours(tourRes.data.data);
        setMyAgency(res.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response.data);
        setLoading(false);
        setError(err.response.data.message);
      }
    };

    getMyAgency();
  }, [shouldUpdate]);

  if (error)
    return (
      <ErrorModal show onClear={() => props.history.push('/make-an-impact')}>
        {error}
      </ErrorModal>
    );
  if (!myAgency) return <LoadingSpinner asOverlay />;

  const toursHandler = () => {
    tours.current.classList.add('border');
    agency.current.classList.remove('border');
    editAgency.current.classList.remove('border');
    addTour.current.classList.remove('border');

    setDisplay('tours');
  };

  const agencyHandler = () => {
    agency.current.classList.add('border');
    tours.current.classList.remove('border');
    addTour.current.classList.remove('border');
    editAgency.current.classList.remove('border');
    setDisplay('agency');
  };

  const editAgencyHandler = () => {
    agency.current.classList.remove('border');
    tours.current.classList.remove('border');
    addTour.current.classList.remove('border');
    editAgency.current.classList.add('border');
    setDisplay('edit');
  };

  const addNewTourHandler = () => {
    agency.current.classList.remove('border');
    tours.current.classList.remove('border');
    addTour.current.classList.add('border');
    editAgency.current.classList.remove('border');
    setDisplay('addNewTour');
  };

  const updateAgency = () => {
    setShouldUpdate((prev) => !prev);
  };

  return (
    <div className="myAgency__container">
      <div className="myAgency__links">
        <h1 className="myAgency__heading" onClick={agencyHandler} ref={agency}>
          My Agency
        </h1>
        <h1 onClick={toursHandler} className="myAgency__heading" ref={tours}>
          My Tours
        </h1>
        <h1
          className="myAgency__heading"
          onClick={editAgencyHandler}
          ref={editAgency}
        >
          Edit Agency
        </h1>
        <h1
          className="myAgency__heading"
          onClick={addNewTourHandler}
          ref={addTour}
        >
          Maybe a new Tour?
        </h1>
      </div>
      {display === 'agency' && <Agency changeBcg agency={myAgency} />}
      {display === 'tours' && (
        <div className="my__tours">
          {' '}
          {myTours.map((tour) => (
            <TourItem tour={tour} />
          ))}{' '}
        </div>
      )}
      {display === 'edit' && <EditAgency agency={myAgency} />}
      {display === 'addNewTour' && (
        <AddNewTour updateAgency={updateAgency} agency={myAgency} />
      )}
    </div>
  );
};

export default MyAgency;
