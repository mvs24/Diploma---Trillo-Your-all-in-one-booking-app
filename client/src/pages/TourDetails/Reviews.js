import React from 'react';
import ReviewItem from './ReviewItem';

const Reviews = props => {
  const { reviews } = props;

  return reviews.map(review => <ReviewItem review={review} />);
};

export default Reviews;
