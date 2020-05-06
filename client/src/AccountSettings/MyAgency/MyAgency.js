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
import FinishedTours from './FinishedTours';
import FinishedFlights from './FinishedFlights';
import Empty from '../../assets/empty.jpg';
import Button from '../../shared/components/Button/Button';

const MyAgency = (props) => {
  const [myAgency, setMyAgency] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [myTours, setMyTours] = useState();
  const [myFlights, setMyFlights] = useState();
  const [finishedTours, setFinishedTours] = useState();
  const [display, setDisplay] = useState('agency');
  const [shouldUpdate, setShouldUpdate] = useState();
  const flightsRef = useRef()
  const tours = useRef();
  const editAgency = useRef();
  const agency = useRef();
  const addTour = useRef();
  const start = 0;
  const [end, setEnd] = useState(6);
  const [endFlight, setEndFlight] = useState(5);

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
        setError(err.response.data.message ? err.response.data.message : "Something went wrong");
      }
    };

    getMyAgency();
  }, [shouldUpdate]);

  const showMoreHandler = () => {
    setEnd((prev) => prev + 6);
  };

  const showMoreFlightsHandler = () => {
    setEndFlight((prev) => prev + 5);
  };

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

  const finishedToursHandler = (e) => {
    const links = Array.from(document.querySelectorAll('.border'));
    links.forEach((link) => link.classList.remove('border'));
    e.target.classList.add('border');
    setDisplay('finishedTours');
  };

  const finishedFlightsHandler = (e) => {
    const links = Array.from(document.querySelectorAll('.border'));
    links.forEach((link) => link.classList.remove('border'));
    e.target.classList.add('border');
    setDisplay('finishedFlights');
  };

  return (
    <div className="myAgency__container">
      <div className="myAgency__links">
        <h1 className="myAgency__heading" onClick={agencyHandler} ref={agency}>
          My Agency
        </h1>
        {myAgency.category === 'flights' && (
          <h1 ref={flightsRef} onClick={flightsHandler} className="myAgency__heading">
            Future Flights ({myFlights.length})
          </h1>
        )}
        {myAgency.category === 'flights' && (
          <h1 onClick={finishedFlightsHandler} className="myAgency__heading">
            Finished Flights
          </h1>
        )}
        {myAgency.category === 'tours' && (
          <h1 onClick={toursHandler} className="myAgency__heading" ref={tours}>
            Future Tours ({myTours.length})
          </h1>
        )}
        {myAgency.category === 'tours' && (
          <h1 onClick={finishedToursHandler} className="myAgency__heading">
            Finished Tours
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
            A new Tour?
          </h1>
        )}
        {myAgency.category === 'flights' && (
          <h1 onClick={addNewFlightHandler} className="myAgency__heading">
            A new Flight?
          </h1>
        )}
      </div>
      {myAgency.category === 'flights' && display === 'flights' && (
        <>
          <div className="my__agencyFlights">
            {myFlights.slice(start, endFlight).map((flight) => (
              <Flight updateAgency={updateAgency} owner flight={flight} />
            ))}
            <div className="showMoreFlightsHandler__btn---1">
              {' '}
              <Button
                type="pink"
                disabled={endFlight >= myFlights.length}
                clicked={showMoreFlightsHandler}
              >
                Show More
              </Button>
            </div>
          </div>
        </>
      )}
      {display === 'agency' && myAgency.category === 'tours' && (
        <Agency changeBcg agency={myAgency} />
      )}
      {display === 'agency' && myAgency.category === 'flights' && (
        <Agency flight changeBcg agency={myAgency} />
      )}
      {myAgency.category === 'tours' && display === 'tours' && (
        <div className="my__tours">
          <div className="tours__grid">
            {myTours.length > 0 ? (
              myTours.slice(start, end).map((tour) => <TourItem tour={tour} />)
            ) : (
              <div>
                <h1 className=" noTourFoundHeading">No Tour found!</h1>
              </div>
            )}
          </div>
          <div className="searchBtn--grid">
            {' '}
            <Button
              type="pink"
              disabled={end >= myTours.length}
              clicked={showMoreHandler}
            >
              Show More
            </Button>
          </div>
        </div>
      )}
      {display === 'edit' && (
        <EditAgency updateAgency={updateAgency} agency={myAgency} />
      )}
      {myAgency.category === 'flights' && display === 'addNewFlight' && (
        <AddNewFlight setDisplay={setDisplay} flightsRef={flightsRef}  updateAgency={updateAgency} agency={myAgency} />
      )}
      {myAgency.category === 'flights' && display === 'finishedFlights' && (
        <FinishedFlights agency={myAgency} />
      )}
      {myAgency.category === 'tours' && display === 'addNewTour' && (
        <AddNewTour
          addTourRef={addTour}
          agencyRef={agency}
          setDisplay={setDisplay}
          updateAgency={updateAgency}
          agency={myAgency}
        />
      )}
      {myAgency.category === 'tours' && display === 'finishedTours' && (
        <FinishedTours updateAgency={updateAgency} agency={myAgency} />
      )}
    </div>
  );
};

export default MyAgency;
