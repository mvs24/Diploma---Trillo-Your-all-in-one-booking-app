import React, { useState, useEffect } from 'react';
import './TourDetails.css';
import axios from 'axios';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import { IconContext } from 'react-icons';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { GoLocation } from 'react-icons/go';
import { MdDateRange } from 'react-icons/md';
import { MdPeopleOutline, MdAccessTime } from 'react-icons/md';
import { FaRegFlag, FaLevelUpAlt } from 'react-icons/fa';
import Map from '../../Map';

const TourDetails = React.memo(props => {
  const [tour, setTour] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const tourId = props.match.params.tourId;

  useEffect(() => {
    const getTour = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/tours/${tourId}`);
        setLoading(false);
        setTour(res.data.data);
      } catch (err) {
        setError(err.response.data.message);
        setLoading(false);
      }
    };

    getTour();
  }, []);

  if (!tour) {
    return <LoadingSpinner asOverlay />;
  }

  if (error)
    return (
      <ErrorModal
        show
        onClear={() => {
          setError(false);
        }}
      >
        {error}
      </ErrorModal>
    );

  return (
    <div className="tour__container">
      <div
        className="tour__bcg"
        style={{
          backgroundImage: `url(http://localhost:5000/public/img/tours/${tour.imageCover})`
        }}
      >
        &nbsp;
      </div>
      <h4 className="heading">
        <span className="heading-span ">{tour.name}</span>
      </h4>
      <div className="tour__detail">
        <div className="tour__location">
          <IconContext.Provider
            value={{ className: ' icon__green tour__detail--icon' }}
          >
            <MdAccessTime />
          </IconContext.Provider>
          <p>{tour.locations.length} Stops</p>
        </div>
        <div className="tour__location ">
          <IconContext.Provider
            value={{ className: 'icon__green tour__detail--icon' }}
          >
            <GoLocation />
          </IconContext.Provider>
          <p>{tour.startLocation.description}</p>
        </div>
      </div>

      <section className="tour__info">
        <div className="quick__facts">
          <h1>QUICK FACTS</h1>

          <ul>
            <li>
              <IconContext.Provider
                value={{ className: 'icon__green tour__info--icon' }}
              >
                <MdDateRange />
              </IconContext.Provider>
              <p className="second">Next Date</p>
              <p className="data">April 2021</p>
            </li>
            <li>
              <IconContext.Provider
                value={{ className: 'icon__green tour__info--icon' }}
              >
                <FaLevelUpAlt />
              </IconContext.Provider>
              <p className="second">Difficulty</p>
              <p className="data">{tour.difficulty}</p>
            </li>
            <li>
              <IconContext.Provider
                value={{ className: 'icon__green tour__info--icon' }}
              >
                <MdPeopleOutline />
              </IconContext.Provider>
              <p className="second">Participants</p>
              <p className="data">{tour.maxGroupSize}</p>
            </li>
          </ul>
        </div>
        <div className="tour__about">
          <h1>ABOUT THE {tour.name}</h1>
          <p>{tour.description}</p>
        </div>
      </section>

      <div className="images__container">
        <div className="images">
          {tour.images.map(img => (
            <div key={img} className="image__container">
              <img src={`http://localhost:5000/public/img/tours/${img}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="map__container">
        <Map tour={tour} />
      </div>
    </div>
  );
});

export default TourDetails;
