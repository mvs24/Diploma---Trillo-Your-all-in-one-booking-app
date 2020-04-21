import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import axios from 'axios';
import TourItem from '../../components/TourItem/TourItem';

import '../MyWishlist/MyWishlist.css';

const CartItem = (props) => {
  const [tour, setTour] = useState();
  const [isLiked, setIsLiked] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { tourId, wishlist, isAuthenticated, removeTour } = props;

  useEffect(() => {
    const getTour = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/tours/${tourId}`);
        setTour(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.message);
      }
    };
    getTour();
  }, [tourId]);

  useEffect(() => {
    let wishlistTours = []; //[ids]

    wishlist.data.forEach((el) => {
      wishlistTours.push(el.tour);
    });

    if (wishlistTours.includes(tourId)) {
      setIsLiked(true);
    } else {
      setIsLiked();
    }
  }, [tourId, removeTour]);

  if (!tour) return <LoadingSpinner asOverlay />;
  if (!wishlist) return <LoadingSpinner asOverlay />;

  return (
    <div className="cart__container">
      {loading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal show onClear={() => setError()}>
          {error}
        </ErrorModal>
      )}
      <TourItem
        removed={props.removed}
        isTourLiked={isLiked}
        cartItem
        tour={tour}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  wishlist: state.user.wishlist,
});

export default connect(mapStateToProps)(CartItem);
