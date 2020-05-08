import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import './Tours.css';
import TourItem from '../TourItem/TourItem';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import Button from '../../shared/components/Button/Button'

const Tours = React.memo((props) => {
  const [mostPopularTours, setMostPopularTours] = useState([]);
  const [topTours, setTopTours] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeLink, setActiveLink] = useState('top');
  const [finishedTours, setFinishedTours] = useState()
  const [mostPopularToursLoaded, setMostPopularToursLoaded] = useState(false);
  const [topToursLoaded, setTopToursLoaded] = useState(false);
  const topToursRef = useRef(null);
  const mostPopularToursRef = useRef();
  const startFinished = 0;
  const [endFinished, setEndFinished] = useState(3);

  const changeUIForTopTours = () => {
    setActiveLink('top');
    topToursRef.current.classList.add('active');
    mostPopularToursRef.current.classList.remove('active');
  };

  const changeUIForMostPopularTours = () => {
    setActiveLink('most');
    topToursRef.current.classList.remove('active');
    mostPopularToursRef.current.classList.add('active');
  };

  const getTopFiveTours = async () => {
    if (topToursLoaded) {
      changeUIForTopTours();
    } else {
      changeUIForTopTours();
      setTopToursLoaded(true);
      try {
        setLoading(true);
        const res = await axios.get('/api/v1/tours/top-five');
        setTopTours(res.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response.data.message);
      }
    }
  };

  const getMostPopularTours = async () => {
    if (mostPopularToursLoaded) {
      changeUIForMostPopularTours();
    } else {
      setMostPopularToursLoaded(true);
      changeUIForMostPopularTours();
      try {
        setLoading(true);
        const tours = await axios.get(
          `/api/v1/tours/mostPopular`
        );
        console.log(tours.data.data)
        setMostPopularTours(tours.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    getTopFiveTours();
  }, []);

  useEffect(() => { 
    const getFinishedTours = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/v1/tours/finishedTours`
        );
        setFinishedTours(res.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response.data.message);
      }
    }

    getFinishedTours()
  }, [])


  const showMoreHandler = () => {
    setEndFinished((prev) => prev + 3);
  };


  let topToursContent =
    activeLink === 'top'
      ? topTours.map((tour) => <TourItem key={tour._id} tour={tour} />)
      : mostPopularTours.map((tour) => <TourItem key={tour._id} tour={tour} />);
  let toursContent = (
    <div className="tours">
      {error && (
        <ErrorModal show onClear={() => setError(null)}>
          {error}
        </ErrorModal>
      )}
      <div className="types">
        <div ref={topToursRef} onClick={getTopFiveTours} className="type">
          Top Tours
        </div>
        <div
          ref={mostPopularToursRef}
          className="type"
          onClick={getMostPopularTours}
        >
          Most popular Tours
        </div>
      </div>
      {loading && <LoadingSpinner />}
      <div className="topToursContent">{topToursContent} </div>
      <div className='finishedTours'>
        {finishedTours ? <div >
            <h1 className='finished__heading'>FINISHED TOURS: ({finishedTours.length})</h1>
            <div className='finished__tours__container'>
            {finishedTours.slice(startFinished, endFinished).map(tour => <TourItem finished key={tour._id} tour={tour} />)}
         
          </div>
           <div className='finishedToursButton'>  <Button
          type="pink"
          disabled={endFinished >= finishedTours.length}
          clicked={showMoreHandler}
          
        >
          Show More
        </Button>
        </div>
           </div> :null} 
        
      </div>
    </div>
  );
  return toursContent;
});

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(Tours);
