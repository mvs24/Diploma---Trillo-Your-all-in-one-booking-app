import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Agency from '../../components/Agency/Agency';
import TourItem from '../../components/TourItem/TourItem';
import './MyAgency.css';
import EditAgency from './EditAgency';
import AddNewTour from './AddNewTour';
import Flight from '../../pages/Flights/Flight';
import AddNewFlight from './AddNewFlight';

const MyAgency = (props) => {
  const [myAgency, setMyAgency] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [myTours, setMyTours] = useState();
  const [myFlights, setMyFlights] = useState();
  const [display, setDisplay] = useState('agency');
  const [shouldUpdate, setShouldUpdate] = useState();
  const tours = useRef();
  const editAgency = useRef();
  const agency = useRef();
  const addTour = useRef();

  useEffect(() => {
    const getMyAgency = async () => {
      try {
        let tourFlightRes;
        setLoading(true);
        const res = await axios.get(`/api/v1/users/my/agency`);
        if (res.data.data.category === 'tours') {
          tourFlightRes = await axios.get(
            `/api/v1/agencies/${res.data.data._id}/tours`
          );
          setMyTours(tourFlightRes.data.data);
        } else if (res.data.data.category === 'flights') {
          tourFlightRes = await axios.get(
            `/api/v1/agencies/${res.data.data._id}/flights`
          );
          setMyFlights(tourFlightRes.data.data);
        }

        setMyAgency(res.data.data);
        setLoading(false);
      } catch (err) {
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

  const toursHandler = (e) => {
    const links = Array.from(document.querySelectorAll('.border'));
    links.forEach((link) => link.classList.remove('border'));
    tours.current.classList.add('border');
    setDisplay('tours');
  };

  const agencyHandler = (e) => {
    if (myAgency.category === 'tours') {
      const links = Array.from(document.querySelectorAll('.border'));
      links.forEach((link) => link.classList.remove('border'));

      e.target.classList.add('border');
      setDisplay('agency');
    } else {
      const links = Array.from(document.querySelectorAll('.border'));
      links.forEach((link) => link.classList.remove('border'));

      e.target.classList.add('border');
      setDisplay('agency');
    }
  };

  const editAgencyHandler = (e) => {
    if (myAgency.category === 'tours') {
      const links = Array.from(document.querySelectorAll('.border'));
      links.forEach((link) => link.classList.remove('border'));

      e.target.classList.add('border');
      setDisplay('edit');
    } else {
      const links = Array.from(document.querySelectorAll('.border'));
      links.forEach((link) => link.classList.remove('border'));

      e.target.classList.add('border');
      setDisplay('edit');
    }
  };

  const addNewTourHandler = (e) => {
    if (myAgency.category === 'tours') {
      const links = Array.from(document.querySelectorAll('.border'));
      links.forEach((link) => link.classList.remove('border'));

      addTour.current.classList.add('border');
      setDisplay('addNewTour');
    } else {
      const links = Array.from(document.querySelectorAll('.border'));
      links.forEach((link) => link.classList.remove('border'));
    }
  };

  const updateAgency = () => {
    setShouldUpdate((prev) => !prev);
  };

  const flightsHandler = (e) => {
    const links = Array.from(document.querySelectorAll('.border'));
    links.forEach((link) => link.classList.remove('border'));
    e.target.classList.add('border');
    setDisplay('flights');
  };

  const addNewFlightHandler = (e) => {
    const links = Array.from(document.querySelectorAll('.border'));
    links.forEach((link) => link.classList.remove('border'));
    e.target.classList.add('border');
    setDisplay('addNewFlight');
  };

  return (
    <div className="myAgency__container">
      <div className="myAgency__links">
        <h1 className="myAgency__heading" onClick={agencyHandler} ref={agency}>
          My Agency
        </h1>
        {myAgency.category === 'flights' && (
          <h1 onClick={flightsHandler} className="myAgency__heading">
            My Flights
          </h1>
        )}
        {myAgency.category === 'tours' && (
          <h1 onClick={toursHandler} className="myAgency__heading" ref={tours}>
            My Tours
          </h1>
        )}
        <h1
          className="myAgency__heading"
          onClick={editAgencyHandler}
          ref={editAgency}
        >
          Edit Agency
        </h1>
        {myAgency.category === 'tours' && (
          <h1
            className="myAgency__heading"
            onClick={addNewTourHandler}
            ref={addTour}
          >
            Maybe a new Tour?
          </h1>
        )}
        {myAgency.category === 'flights' && (
          <h1 onClick={addNewFlightHandler} className="myAgency__heading">
            Maybe a new Flight?
          </h1>
        )}
      </div>
      {myAgency.category === 'flights' && display === 'flights' && (
        <div className="my__agencyFlights">
          {myFlights.map((flight) => (
            <Flight owner flight={flight} />
          ))}
        </div>
      )}
      {display === 'agency' && myAgency.category === 'tours' && (
        <Agency changeBcg agency={myAgency} />
      )}
      {display === 'agency' && myAgency.category === 'flights' && (
        <Agency flight changeBcg agency={myAgency} />
      )}
      {myAgency.category === 'tours' && display === 'tours' && (
        <div className="my__tours">
          {' '}
          {myTours.map((tour) => (
            <TourItem tour={tour} />
          ))}{' '}
        </div>
      )}
      {display === 'edit' && <EditAgency agency={myAgency} />}
      {myAgency.category === 'flights' && display === 'addNewFlight' && (
        <AddNewFlight updateAgency={updateAgency} agency={myAgency} />
      )}
      {myAgency.category === 'tours' && display === 'addNewTour' && (
        <AddNewTour updateAgency={updateAgency} agency={myAgency} />
      )}
    </div>
  );
};

export default MyAgency;
