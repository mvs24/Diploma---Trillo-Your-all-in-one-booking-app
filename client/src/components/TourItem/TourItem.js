import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import Button from '../../shared/components/Button/Button';
import { IconContext } from 'react-icons';
import {
  IoIosHeart,
  IoIosHeartEmpty,
  IoMdStar,
  IoIosStarOutline,
} from 'react-icons/io';
import { GoLocation } from 'react-icons/go';
import { MdDateRange } from 'react-icons/md';
import { MdPersonOutline } from 'react-icons/md';
import { FaRegFlag } from 'react-icons/fa';
import './TourItem.css';
import {
  addToWishlist,
  deleteError,
  removeFromWishlist,
  removeFromCart,
  getMyReviews,
  getToursInCart,
} from '../../store/actions/userActions';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Modal from '../../shared/components/UI/Modal';
import Textarea from '../../shared/components/Input/Textarea';
import axios from 'axios';

const StarCmp = (props) => (
  <IconContext.Provider
    value={{
      className: `icon__green tour__info--icon full star review--icon ${props.starName}`,
    }}
  >
    {props.children}
  </IconContext.Provider>
);

const TourItem = React.memo((props) => {
  const [isLiked, setIsLiked] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [outline, setOutline] = useState();
  const [stars, setStars] = useState();
  const [tricky, setTricky] = useState(0);
  const [openReviewModal, setOpenReviewModal] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [reviewed, setReviewed] = useState(false);
  const [myRating, setMyRating] = useState();
  const [myReview, setMyReview] = useState({
    configOptions: {
      type: 'text',
      placeholder: 'Your Review',
    },
    value: '',
    valid: true,
    touched: false,
    validRequirements: {},
  });
  const [myReviewValid, setMyReviewValid] = useState(true);
  const [reviewControlled, setReviewControlled] = useState(false);
  const [openUpdateReviewModal, setOpenUpdateReviewModal] = useState();
  const [reviewToUpdate, setReviewToUpdate] = useState(0);
  const [updateReviewStars, setUpdateReviewStars] = useState([]);
  const [reviewFilled, setReviewFilled] = useState();
  const [myReviewUpdate, setMyReviewUpdate] = useState({
    configOptions: {
      type: 'text',
      placeholder: 'Your Review',
    },
    value: '',
    valid: true,
    touched: false,
    validRequirements: {},
  });
  const history = useHistory();
  const [tour, setTour] = useState(props.tour);
  const { wishlist, isAuthenticated, reviews } = props;
  const [should, setShould] = useState();
  const {
    shouldUpdate,
    shouldTour,
    pageChanged,
    isTourLiked,
    removeTour,
    shouldUpdate2,
  } = props;

  useEffect(() => {
    setTour(props.tour);
  }, [shouldTour]);

  useEffect(() => {
    setShould(props.shouldUpdate);
  }, [shouldUpdate]);

  useEffect(() => {
    setTour(props.tour);

    if (props.isLiked) {
      setIsLiked(props.isLiked);
    }
  }, [pageChanged]);

  useEffect(() => {
    setIsLiked(isTourLiked);
  }, [isTourLiked]);

  useEffect(() => {
    setTour(props.tour);
    setIsLiked(isTourLiked);
  }, [shouldUpdate2]);

  useEffect(() => {
    let wishlistTours = []; //[ids]

    if (wishlist && isAuthenticated) {
      wishlist.data.forEach((el) => {
        wishlistTours.push(el.tour);
      });
    }

    if (wishlistTours.includes(tour._id)) {
      setIsLiked(true);
      setUpdated(true);
      setShould(false);
    } else {
      setIsLiked();
      setUpdated(true);
      setShould(false);
    }
  }, [shouldUpdate]);

  useEffect(() => {
    let wishlistTours = []; //[ids]

    if (wishlist && isAuthenticated) {
      wishlist.data.forEach((el) => {
        wishlistTours.push(el.tour);
      });
    }

    if (wishlistTours.includes(tour._id)) {
      setIsLiked(true);
      setUpdated(true);
      setShould(false);
    } else {
      setIsLiked();
      setUpdated(true);
      setShould(false);
    }
  }, [removeTour, wishlist]);

  // if (!updated || should ) {
  //   ///THIS WAS CRAZY!!!!!!!!!!!!!!!
  //   let wishlistTours = []; //[ids]

  //   if (wishlist && isAuthenticated) {
  //     wishlist.data.forEach((el) => {
  //       wishlistTours.push(el.tour);
  //     });
  //   }

  //   if (wishlistTours.includes(tour._id)) {
  //     setIsLiked(true);
  //     setUpdated(true);
  //     setShould(false)
  //   }  else {
  //      setIsLiked();
  //     setUpdated(true);
  //     setShould(false)
  //   }

  // }

  const addTourToWishlist = (tourId) => {
    props.addToWishlist(tourId);
    if (isAuthenticated) {
      setIsLiked(true);
    }
  };

  const removeTourFromWishlist = (tourId) => {
    props.removeFromWishlist(tourId);
    if (isAuthenticated) {
      setIsLiked(false);
    }
  };

  const detailsHandler = () => {
    history.push(`/tours/${tour.id}`);
  };

  const emptyStars = (allStars) => {
    let empties = 0;

    allStars.forEach((st) => {
      if (st.props.children.type.displayName === 'IoIosStarOutline') empties++;
    });

    return empties;
  };

  const reviewHandler = (e) => {
    let trickyReview;
    if (e.target.matches('path')) {
      trickyReview =
        e.target.parentElement.classList['value'][
          e.target.parentElement.classList['value'].length - 1
        ];
      setTricky(trickyReview);
    }

    if (!e.target.classList.contains('review--icon')) {
      e.target.classList.add('review--icon');
    }

    if (e.target.classList[e.target.classList.length - 1].startsWith('star-')) {
      e.target.classList.add(e.target.classList[e.target.classList.length - 1]);
    }

    if (e.target.classList[e.target.classList.length - 1].startsWith('star-')) {
      const review =
        e.target.classList[e.target.classList.length - 1].split('-')[1] * 1 + 1;

      if (emptyStars(stars) === 5) {
        setStars((prevState) => {
          for (let i = 0; i < 5; i++) {
            if (i < review) {
              prevState[i] = (
                <StarCmp starName={`star-${i}`}>
                  <IoMdStar onClick={reviewHandler} />
                </StarCmp>
              );
            }
          }
          let upd = [...prevState];
          return upd;
        });
        setOpenReviewModal(true);
      }
      if (review >= 5 - emptyStars(stars)) {
        setStars((prevState) => {
          for (let i = 5 - emptyStars(stars); i < review; i++) {
            prevState[i] = (
              <StarCmp starName={`star-${i}`}>
                <IoMdStar onClick={reviewHandler} />
              </StarCmp>
            );
          }
          let upd = [...prevState];
          return upd;
        });
        setOpenReviewModal(true);
      }
    }
  };

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

  const textInputHandler = (e) => {
    const updatedReview = { ...myReview };
    updatedReview.value = e.target.value;
    updatedReview.touched = true;
    updatedReview.valid = checkValidity(
      updatedReview.value,
      updatedReview.validRequirements
    );

    setMyReview(updatedReview);
    setMyReviewValid(updatedReview.valid);
  };

  const myReviewInputHandler = (e) => {
    const updatedReview = { ...myReviewUpdate };
    updatedReview.value = e.target.value;
    updatedReview.touched = true;
    updatedReview.valid = checkValidity(
      updatedReview.value,
      updatedReview.validRequirements
    );

    setMyReviewUpdate(updatedReview);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const reviewData = { review: myReview.value, rating: starContent.length };
    setLoading(true);
    const res = await axios.post(
      `/api/v1/tours/${tour._id}/reviews`,
      reviewData
    );
    const tourRes = await axios.get(`/api/v1/tours/${res.data.data.tour}`);
    setTour(tourRes.data.data);
    setLoading(false);
    setMyRating(reviewData.rating);
    setReviewed(true);
    setOpenReviewModal(false);
    props.getMyReviews();
  };

  const openUpdateModal = () => {
    setOpenUpdateReviewModal(true);
  };

  if (!outline) {
    let updatedStars = [];
    for (let i = 0; i < 5; i++) {
      updatedStars.push(
        <StarCmp starName={`star-${i}`}>
          <IoIosStarOutline />
        </StarCmp>
      );
    }
    setStars(updatedStars);
    setOutline(true);
  }

  if (!outline) return null;

  let starContent = [];
  if (openReviewModal) {
    const starsLength = 5 - emptyStars(stars);
    for (let i = 0; i < starsLength; i++) {
      starContent.push(
        <IconContext.Provider
          value={{
            className: `icon__green tour__info--icon full star`,
          }}
        >
          <IoMdStar />
        </IconContext.Provider>
      );
    }
  }

  if (isAuthenticated && !reviews) return null;

  if (isAuthenticated && !reviewControlled) {
    const reviewTourIds = reviews.map((el) => el.tour);
    if (reviewTourIds.includes(tour._id)) {
      setReviewed(true);

      const reviewForTour = reviews.find((review) => review.tour === tour._id);
      setMyRating(reviewForTour.rating);
      setReviewControlled(true);
    }
  }

  let reviewContent = null;
  if (props.booked && reviewed) {
    let myRatingContent = [];
    for (let i = 0; i < myRating; i++) {
      myRatingContent.push(
        <IconContext.Provider
          value={{
            className: `icon__green tour__info--icon full star`,
          }}
        >
          <IoMdStar />
        </IconContext.Provider>
      );
    }

    reviewContent = (
      <div className="leave__review--container">
        {' '}
        <h1 className="leave__review--heading">Your Rating</h1>
        <span style={{ marginRight: '.5rem' }}> {myRatingContent}</span>
      </div>
    );
  } else if (props.booked && !reviewed) {
    reviewContent = (
      <div className="leave__review--container">
        {' '}
        <h1 className="leave__review--heading">Leave a review</h1>
        <span onClick={reviewHandler}> {stars.map((star) => star)} </span>
      </div>
    );
  }

  if (!reviewFilled) {
    let updatedRevieww = [];
    for (let i = 1; i <= 5; i++) {
      updatedRevieww.push(
        <StarCmp starName={`star-${i}`}>
          <IoIosStarOutline />
        </StarCmp>
      );
    }

    setUpdateReviewStars(updatedRevieww);
    setReviewFilled(true);
  }

  const canelledReviewUpdate = [];
  for (let i = 1; i <= 5; i++) {
    canelledReviewUpdate.push(
      <StarCmp starName={`star-${i}`}>
        <IoIosStarOutline />
      </StarCmp>
    );
  }

  const getUpdatedReview = (e) => {
    let rating;

    if (
      e.target.matches('svg') &&
      e.target.classList.length &&
      e.target.classList[e.target.classList.length - 1].startsWith('star-')
    ) {
      e.target.classList.add(e.target.classList[e.target.classList.length - 1]);
    }

    if (
      e.target.matches('svg') &&
      e.target.classList &&
      e.target.classList[e.target.classList.length - 1].startsWith('star-')
    ) {
      rating = e.target.classList[e.target.classList.length - 1].split('-')[1];

      setUpdateReviewStars((prevState) => {
        for (let i = 0; i < rating; i++) {
          prevState[i] = (
            <IconContext.Provider
              value={{
                className: `icon__green tour__info--icon full star`,
              }}
            >
              <IoMdStar />
            </IconContext.Provider>
          );
        }
        const upd = [...prevState];
        return upd;
      });

      setReviewToUpdate(rating);
    }
  };

  const updateReviewHandler = async () => {
    let updatedRevieww = [];
    for (let i = 1; i <= 5; i++) {
      updatedRevieww.push(
        <StarCmp starName={`star-${i}`}>
          <IoIosStarOutline />
        </StarCmp>
      );
    }
    try {
      setLoading(true);
      const res = await axios.patch(
        `/api/v1/tours/${tour._id}/reviews/${props.reviewId}`,
        { review: myReviewUpdate.value, rating: reviewToUpdate }
      );
      const tourRes = await axios.get(`/api/v1/tours/${res.data.data.tour}`);
      setTour(tourRes.data.data);
      setLoading(false);
      setMyRating(reviewToUpdate);
      setReviewToUpdate(0);
      setUpdateReviewStars(updatedRevieww);
      setOpenUpdateReviewModal(false);
      props.getMyReviews();
    } catch (err) {
      setError(err.response.data);
    }
  };

  const removeFromCartHandler = async () => {
    try {
      setLoading(true);
      await props.removeFromCart(tour._id);
      props.getToursInCart();
      setLoading(false);
    } catch (err) {
      setLoading();
      setError(err.response.data.message);
    }
  };

  let filteredDates = tour.startDates.filter((el) => new Date(el) > Date.now());

  return (
    <>
      {loading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal show onCancel={() => setError(false)}>
          {error ? error : 'Something went wrong'}
        </ErrorModal>
      )}
      {openReviewModal && (
        <Modal
          onCancel={() => {
            setOpenReviewModal(false);
            setOutline(false);
          }}
          header={'FEEDBACK'}
          show
        >
          <div className="review__center">
            {' '}
            <h1 className="leave__review--heading your__review--heading">
              {' '}
              Your Rating:{' '}
            </h1>{' '}
            <p className="my__review--stars">
              {starContent.map((star) => star)} ({starContent.length})
            </p>
          </div>
          <div className="review__form" onSubmit={submitReview}>
            <Textarea
              touched={myReview.touched}
              valid={myReview.valid}
              configOptions={myReview.configOptions}
              onChange={textInputHandler}
            />
            <Button
              clicked={submitReview}
              disabled={!myReviewValid}
              type="success"
            >
              Leave your review!
            </Button>
          </div>
        </Modal>
      )}
      {props.error && (
        <ErrorModal show onClear={props.deleteError}>
          {props.error}
        </ErrorModal>
      )}
      <div className="tour">
        <img src={`${tour.imageCover}`} alt="Tour" className="tour__img" />
        {props.wishlistTourItem ? null : (
          <IconContext.Provider value={{ className: 'tour__like' }}>
            {isLiked ? (
              <IoIosHeart onClick={() => removeTourFromWishlist(tour._id)} />
            ) : (
              <IoIosHeartEmpty onClick={() => addTourToWishlist(tour._id)} />
            )}
          </IconContext.Provider>
        )}
        <h5 className="tour__name">{tour.name}</h5>
        <div className="tour__location">
          <IconContext.Provider value={{ className: 'icon__green' }}>
            <GoLocation />
          </IconContext.Provider>
          <p>{tour.startLocation.description}</p>
        </div>
        <div className="tour__location">
          <IconContext.Provider value={{ className: ' icon__green' }}>
            <MdDateRange />
          </IconContext.Provider>
          {props.finished ? (
            <p>Finished</p>
          ) : (
            <p>{moment(filteredDates[0]).format('MMM Do YYYY')}</p>
          )}
        </div>
        <div className="tour__location">
          <IconContext.Provider value={{ className: ' icon__green' }}>
            <MdPersonOutline />
          </IconContext.Provider>
          <p>{tour.maxGroupSize}</p>
        </div>
        <div className="tour__location">
          <IconContext.Provider value={{ className: ' icon__green' }}>
            <FaRegFlag />
          </IconContext.Provider>
          <p>{tour.locations.length} stops</p>
        </div>{' '}
        <div className="price__rating">
          {' '}
          <p>
            <strong>Price</strong>: ${tour.price}
          </p>
          <p>
            <strong>Rating </strong>: {tour.ratingsAverage} (
            {tour.ratingsQuantity})
          </p>
        </div>
        {props.finished ? (
          <Button clicked={detailsHandler} type="pink">
            Finished
          </Button>
        ) : (
          <Button
            className="detailsButton"
            clicked={detailsHandler}
            type="success"
          >
            Details
          </Button>
        )}
        {reviewContent}
        {props.updateReview && (
          <div className="update__review">
            {' '}
            <Button clicked={openUpdateModal} type="pink">
              UPDATE REVIEW
            </Button>{' '}
          </div>
        )}
        {props.cartItem && (
          <div className="update__review">
            {' '}
            <Button clicked={removeFromCartHandler} type="pink">
              REMOVE FROM CART
            </Button>{' '}
          </div>
        )}
        {openUpdateReviewModal && (
          <Modal
            show
            onCancel={() => {
              setOpenUpdateReviewModal(false);
              setUpdateReviewStars(canelledReviewUpdate);
            }}
            header="UPDATE YOUR REVIEW"
          >
            <div className="update__review--container">
              <span onClick={getUpdatedReview}>
                {updateReviewStars.map((el) => el)}
              </span>
              <Textarea
                touched={myReviewUpdate.touched}
                valid={myReviewUpdate.valid}
                configOptions={myReviewUpdate.configOptions}
                onChange={myReviewInputHandler}
              />
              <Button type="pink" clicked={updateReviewHandler}>
                UPDATE
              </Button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
});

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
  wishlist: state.user.wishlist,
  error: state.user.error,
  reviews: state.user.reviews,
});

export default connect(mapStateToProps, {
  addToWishlist,
  deleteError,
  removeFromWishlist,
  removeFromCart,
  getMyReviews,
  getToursInCart,
})(TourItem);
