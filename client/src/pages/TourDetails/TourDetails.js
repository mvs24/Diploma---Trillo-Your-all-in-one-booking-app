import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './TourDetails.css';
import axios from 'axios';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import Modal from '../../shared/components/UI/Modal';
import { IconContext } from 'react-icons';
import { GoLocation } from 'react-icons/go';
import { MdDateRange } from 'react-icons/md';
import { MdPeopleOutline, MdAccessTime } from 'react-icons/md';
import { FaLevelUpAlt } from 'react-icons/fa';
import Map from '../../Map';
import ReviewStatistics from './ReviewStatistics';
import Reviews from './Reviews';
import AgencyInfo from './AgencyInfo';
import Logo from '../../assets/logo.png';
import Button from '../../shared/components/Button/Button';
import { addToCart } from '../../store/actions/userActions';
import { loadStripe } from '@stripe/stripe-js';
import Input from '../../shared/components/Input/Input';

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
  const [owner, setOwner] = useState();
  const [openDiscountModal, setOpenDiscountModal] = useState();
  const [priceDiscountInput, setPriceDiscountInput] = useState({
    configOptions: {
      type: 'number',
      placeholder: '$ (Price Discount)',
    },
    value: '',
    valid: false,
    touched: false,
    validRequirements: {},
  });
  const [priceDiscountInputValid, setPriceDiscountInputValid] = useState();
  const [processingDiscount, setProcessingDiscount] = useState();
  const [reload, setReload] = useState();
  const [userId, setUserId] = useState();
  const [processBooking, setProcessBooking] = useState();
  const { cartTour, isAuthenticated } = props;

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

    if (isAuthenticated) {
      getMyBookings();
    }
  }, [tour, isAuthenticated]);

  useEffect(() => {
    const getTour = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/tours/${tourId}`);
        const agencyRes = await axios.get(
          '/api/v1/agencies/' + res.data.data.agency
        );
        if (isAuthenticated) {
          const userRes = await axios.get('/api/v1/users/loggedInUser');
          setUserId(userRes.data.data.id);
        }

        setLoading(false);
        setTour(res.data.data);
        setOwner(agencyRes.data.data.user);
      } catch (err) {
        setError(err.response.data.message);
        setLoading(false);
      }
    };

    getTour();
  }, []);

  window.addEventListener('resize', () => {
    if (window.innerWidth < 1013 && window.innerWidth > 736) {
      setResPerPage(2);
    } else if (window.innerWidth < 736) {
      setResPerPage(1);
    } else if (window.innerWidth >= 1013) {
      setResPerPage(3);
    }
  });

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
    if (isAuthenticated) {
      try {
        setAdding(true);

        await props.addToCart(tour._id);
        setAdding(false);
        setAdded(true);
      } catch (err) {
        setAdding();
        setError(err.response.data.message);
      }
    } else {
      setError('You are not logged in! Please log in!');
    }
  };

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API);

  const bookTour = async () => {
    try {
      if (isAuthenticated) {
        setProcessBooking(true);
      }
      const stripe = await stripePromise;
      const session = await axios(
        `/api/v1/bookings/tours/checkout-session/${tour._id}`
      );

      await stripe.redirectToCheckout({
        sessionId: session.data.session.id,
      });
      setProcessBooking(true);
    } catch (err) {
      setProcessBooking();
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

  const isOwner = owner === userId;

  const checkValidity = (value, requirements) => {
    let isValid = true;

    if (requirements.required) {
      isValid = isValid && value.trim().length !== 0;
    }
    if (requirements.minlength) {
      isValid = isValid && value.trim().length >= requirements.minlength;
    }
    if (requirements.isEmail) {
      isValid = isValid && /\S+@\S+\.\S+/.test(value);
    }

    return isValid;
  };

  const inputHandler = (e) => {
    const updatedData = { ...priceDiscountInput };
    updatedData.value = e.target.value;
    updatedData.touched = true;
    updatedData.valid = checkValidity(
      updatedData.value,
      updatedData.validRequirements
    );

    setPriceDiscountInput(updatedData);

    let isFormValid = true;
    for (let key in updatedData) {
      isFormValid = isFormValid && updatedData.valid;
    }

    setPriceDiscountInputValid(isFormValid);
  };

  const submitPriceDiscountHandler = async () => {
    try {
      setLoading(true);
      console.log(isAuthenticated);

      setProcessingDiscount(true);

      const res = await axios.post(`/api/v1/tours/${tourId}/price-discount`, {
        message: 'We just made a price discount! Enjoy it!! ',
        priceDiscount: priceDiscountInput.value,
      });
      setLoading(false);
      setOpenDiscountModal();
      setProcessingDiscount();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  let bookProcessing = (
    <Button className="bookNow" clicked={bookTour} type="success">
      BOOK NOW! ONLY{' '}
      {tour.priceDiscount ? (
        <strike>${tour.price + tour.priceDiscount}</strike>
      ) : null}{' '}
      ${tour.price}
    </Button>
  );

  if (processBooking) {
    bookProcessing = (
      <Button className="bookNow" disabled={true} type="success">
        PROCESSING...
      </Button>
    );
  }

  return (
    <div className="tour__container">
      {error && (
        <ErrorModal show onClear={() => setError(false)}>
          {error}
        </ErrorModal>
      )}
      <div className="tour__bcg">
        <img src={`http://localhost:5000/${tour.imageCover}`} />
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

      <section className="tour__info tour__info-1">
        <div className="quick__facts quick__facts-1">
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
        <div className="tour__about tour__about-1">
          <h1>ABOUT THE {tour.name}</h1>
          <p>{tour.description}</p>
        </div>
      </section>

      <div className="images__container">
        <div className="images">
          {tour.images.map((img) => (
            <div key={img} className="image__container">
              <img src={`http://localhost:5000/${img}`} />
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

      <div className={`${tour.reviews.length !== 0 ? 'reviews' : 'reviews2'}`}>
        <Reviews
          showMore={showMoreHandler}
          showLess={showLessHandler}
          reviewLength={tour.reviews.length}
          tourId={tour._id}
          page={page}
          limit={resPerPage}
          resPerPage={resPerPage}
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
                src={`http://localhost:5000/${img}`}
              />
            ))}
          </div>

          {isOwner ? (
            <div className="bookTour__info--1">
              <h1 style={{ fontSize: '1.6rem' }}>
                DO YOU WANT TO MAKE A PRICE DISCOUNT AS THE OWNER OF THIS TOUR?
                A Notification will be sent to different users!!
              </h1>
            </div>
          ) : (
            <div className="bookTour__info--1">
              <h1>WHAT ARE YOU WAITING FOR?</h1>
              <p>
                {tour.locations[tour.locations.length - 1].day} days. 1
                Adventure. Infinite Memories. Make it yours today
              </p>
              {tour.priceDiscount ? (
                <h1>Hurry Up! Price Discount: ${tour.priceDiscount}</h1>
              ) : null}
            </div>
          )}

          {!isOwner ? (
            <div className="bookTour__buttons">
              <Button
                disabled={added}
                className="addToCart"
                type="success"
                clicked={addToCartHandler}
              >
                {addContent}
              </Button>
              {isBooked && (
                <Button disabled className="bookNow">
                  BOOKED
                </Button>
              )}
              {!isBooked && bookProcessing}
            </div>
          ) : (
            <Button clicked={() => setOpenDiscountModal(true)} type="success">
              MAKE A PRICE DISCOUNT
            </Button>
          )}
          {openDiscountModal && (
            <Modal
              header={`Make a price discount`}
              show
              onCancel={() => setOpenDiscountModal()}
            >
              <Input
                value={priceDiscountInput.value}
                valid={priceDiscountInput.valid}
                touched={priceDiscountInput.touched}
                configOptions={priceDiscountInput.configOptions}
                onChange={(e) => inputHandler(e)}
              />
              <Button
                clicked={submitPriceDiscountHandler}
                disabled={!priceDiscountInputValid}
                type="success"
              >
                {processingDiscount
                  ? 'PROCESSING'
                  : 'Submit your Price Discount'}
              </Button>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
});

const mapStateToProps = (state) => ({
  cartTour: state.user.cartTour,
  isAuthenticated: state.user.isAuthenticated,
  userData: state.user.userData,
});

export default connect(mapStateToProps, { addToCart })(TourDetails);
