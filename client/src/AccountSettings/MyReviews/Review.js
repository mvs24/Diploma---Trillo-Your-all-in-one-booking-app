import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import axios from 'axios';
import TourItem from '../../components/TourItem/TourItem';

import '../MyWishlist/MyWishlist.css';

const Review = (props) => {
  const [tour, setTour] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { tourId } = props;

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
  }, []);

  if (!tour) return <LoadingSpinner asOverlay />;

  return (
    <div className="wishlist__container">
      {loading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal show onClear={() => setError()}>
          {error}
        </ErrorModal>
      )}
      <TourItem
        booked
        updateReview={true}
        reviewId={props.reviewId}
        tour={tour}
      />
    </div>
  );
};

export default Review;
