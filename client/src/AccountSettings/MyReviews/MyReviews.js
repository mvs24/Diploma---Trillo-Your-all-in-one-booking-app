import React from 'react';
import { connect } from 'react-redux';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Review from './Review';

const MyReviews = (props) => {
  const { reviews, isAuthenticated } = props;
  if (!isAuthenticated) return null;

  if (!reviews) return <LoadingSpinner asOverlay />;
  if (reviews.length === 0)
    return (
      <div className="wish__data">
        <h1>You haven't booked a tour yet!</h1>
      </div>
    );

  return (
    <>
      <h1 className="my__wishlist--heading">MY REVIEWS</h1>
      <div className="wishlist__container">
        {reviews.map((review) => (
          <Review reviewId={review._id} tourId={review.tour} />
        ))}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  reviews: state.user.reviews,
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps)(MyReviews);
