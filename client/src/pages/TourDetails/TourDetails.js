import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './TourDetails.css';
import axios from 'axios';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import { IconContext } from 'react-icons';
import { GoLocation } from 'react-icons/go';
import { MdDateRange } from 'react-icons/md';
import { MdPeopleOutline, MdAccessTime } from 'react-icons/md';
import { FaLevelUpAlt } from 'react-icons/fa';
import Map from '../../Map';
import ReviewStatistics from './ReviewStatistics';
import Reviews from './Reviews';
import AgencyInfo from './AgencyInfo';
import Logo from '../../assets/logo.PNG';
import Button from '../../shared/components/Button/Button';
import { addToCart } from '../../store/actions/userActions';
import { loadStripe } from '@stripe/stripe-js';

const TourDetails = React.memo((props) => {
  const [tour, setTour] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [page, setPage] = useState(1);
  const [resPerPage, setResPerPage] = useState(3);
  const tourId = props.match.params.tourId;
  const [myBookings, setMyBookings] = useState();
  const [isBooked, setIsBooked] = useState();
  const [controlled, setControlled] = useState();
  const { cartTour } = props;

  useEffect(() => {
    const getMyBookings = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/v1/users/my/bookings');
        setLoading(false);
        setMyBookings(res.data.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    };

    getMyBookings();
  }, [tour]);

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

  useEffect(() => {
    if (tour) {
      const toursInCart = cartTour.map((el) => el.tour);
      if (toursInCart.includes(tour._id)) {
        setAdded(true);
      }
    }
  });

  const showMoreHandler = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const showLessHandler = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const addToCartHandler = async () => {
    try {
      setAdding(true);
      await props.addToCart(tour._id);
      setAdding(false);
      setAdded(true);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const stripePromise = loadStripe(
    'pk_test_zUIsJ0pP0ioBysHoQcStX9cC00X97vuB7d'
  );

  const bookTour = async () => {
    try {
      const stripe = await stripePromise;
      const session = await axios(
        `/api/v1/bookings/tours/checkout-session/${tour._id}`
      );

      await stripe.redirectToCheckout({
        sessionId: session.data.session.id,
      });
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  if (!tour) {
    return <LoadingSpinner asOverlay />;
  }

  let addContent = <span>ADD TO CART</span>;
  if (adding) {
    addContent = <span>ADDING...</span>;
  } else {
    if (added) {
      addContent = <span>ADDED</span>;
    } else {
      addContent = <span> ADD TO CART</span>;
    }
  }

  if (!controlled) {
    if (myBookings && tour) {
      const myBookingTours = myBookings.map((booking) => {
        return booking.tour._id;
      });
      if (myBookingTours.includes(tour._id)) {
        setIsBooked(true);
      }

      setControlled(true);
    }
  }

  return (
    <div className="tour__container">
      {error && (
        <ErrorModal show onClear={() => setError(false)}>
          {error}
        </ErrorModal>
      )}
      <div
        className="tour__bcg"
        style={{
          backgroundImage: `url(http://localhost:5000/public/img/tours/${tour.imageCover})`,
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
              <p className="data">{tour.startDates[0].split('T')[0]}</p>
            </li>

            <li>
              <IconContext.Provider
                value={{ className: 'icon__green tour__info--icon' }}
              >
                <MdDateRange />
              </IconContext.Provider>
              <p className="second">BOOKED BY</p>
              <p className="data">{tour.numBought}</p>
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
          {tour.images.map((img) => (
            <div key={img} className="image__container">
              <img src={`http://localhost:5000/public/img/tours/${img}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="map__container">
        <Map tour={tour} />
      </div>

      <section className="reviews__container">
        <ReviewStatistics tourId={tour._id} />
      </section>

      <div className="reviews">
        <Reviews
          showMore={showMoreHandler}
          showLess={showLessHandler}
          reviewLength={tour.reviews.length}
          tourId={tour._id}
          page={page}
          limit={resPerPage}
        />
      </div>

      <section className="agency__container">
        <AgencyInfo tour={tour} />
      </section>

      <div className="bookTour__container">
        <div className="bookTour__info">
          <div className="bookTour__images">
            <img className="bookTour__image" src={Logo} />
            {tour.images.map((img) => (
              <img
                className="bookTour__image"
                src={`http://localhost:5000/public/img/tours/${img}`}
              />
            ))}
          </div>
          <div className="bookTour__info--1">
            <h1>WHAT ARE YOU WAITING FOR?</h1>
            <p>
              {tour.locations[tour.locations.length - 1].day} days. 1 Adventure.
              Infinite Memories. Make it yours today
            </p>
          </div>
          <div className="bookTour__buttons">
            <Button
              disabled={added}
              className="addToCart"
              type="success"
              clicked={addToCartHandler}
            >
              {addContent}
            </Button>
            {isBooked ? (
              <Button disabled className="bookNow">
                BOOKED
              </Button>
            ) : (
              <Button className="bookNow" clicked={bookTour} type="success">
                BOOK NOW! ONLY ${tour.price}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

const mapStateToProps = (state) => ({
  cartTour: state.user.cartTour,
});

export default connect(mapStateToProps, { addToCart })(TourDetails);
