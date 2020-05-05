import React, { useState } from 'react';
import { connect } from 'react-redux';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Review from './Review';
import Button from '../../shared/components/Button/Button';

const MyReviews = (props) => {
  const { reviews, isAuthenticated } = props;
  const start = 0;
  const [end, setEnd] = useState(6);

  const showMoreHandler = () => {
    setEnd((prev) => prev + 6);
  };

  if (!isAuthenticated) return null;

  if (!reviews || props.loading) return <LoadingSpinner asOverlay />;
  if (reviews.length === 0)
    return (
      <div className="wish__data__heading">
        <h1 className="noFlightHeading">You haven't reviewed a tour yet!</h1>
      </div>
    );

  return (
    <>
      <h1 className="my__wishlist--heading">MY REVIEWS ({reviews.length})</h1>
      <div className="wishlist__container">
        {reviews.slice(start, end).map((review) => (
          <Review reviewId={review._id} tourId={review.tour} />
        ))}
      </div>
      <div className="searchBtn--grid">
        {' '}
        <Button
          type="blue"
          disabled={end >= reviews.length}
          clicked={showMoreHandler}
        >
          Show More
        </Button>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  reviews: state.user.reviews,
  isAuthenticated: state.user.isAuthenticated,
  loading: state.user.loading,
});

export default connect(mapStateToProps)(MyReviews);
