import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '../../shared/components/Button/Button';
import { IconContext } from 'react-icons';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { GoLocation } from 'react-icons/go';
import { MdDateRange } from 'react-icons/md';
import { MdPersonOutline } from 'react-icons/md';
import { FaRegFlag } from 'react-icons/fa';
import './TourItem.css';
import {
  addToWishlist,
  deleteError,
  removeFromWishlist,
} from '../../store/actions/userActions';
import ErrorModal from '../../shared/components/UI/ErrorModal';

const TourItem = React.memo((props) => {
  const [isLiked, setIsLiked] = useState(false);
  const [updated, setUpdated] = useState(false);
  const history = useHistory();
  const { tour, wishlist, isAuthenticated } = props;

  if (!updated) {
    ///THIS WAS CRAZY!!!!!!!!!!!!!!!
    let wishlistTours = []; //[ids]

    if (wishlist && isAuthenticated) {
      wishlist.data.forEach((el) => {
        wishlistTours.push(el.tour);
      });
    }

    if (wishlistTours.includes(tour._id)) {
      setIsLiked(true);
      setUpdated(true);
    }
  }

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
  return (
    <>
      {props.error && (
        <ErrorModal show onClear={props.deleteError}>
          {props.error}
        </ErrorModal>
      )}
      <div className="tour">
        <img
          src={`http://localhost:5000/public/img/tours/${tour.imageCover}`}
          alt="Tour"
          className="tour__img"
        />
        <IconContext.Provider value={{ className: 'tour__like' }}>
          {isLiked ? (
            <IoIosHeart onClick={() => removeTourFromWishlist(tour._id)} />
          ) : (
            <IoIosHeartEmpty onClick={() => addTourToWishlist(tour._id)} />
          )}
        </IconContext.Provider>
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
          <p>{tour.startDates[0].split('T')[0]}</p>
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
        <Button clicked={detailsHandler} type="success">
          Details
        </Button>
      </div>
    </>
  );
});

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
  wishlist: state.user.wishlist,
  error: state.user.error,
});

export default connect(mapStateToProps, {
  addToWishlist,
  deleteError,
  removeFromWishlist,
})(TourItem);
