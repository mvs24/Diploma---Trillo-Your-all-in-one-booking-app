import React, { useState, useEffect } from 'react';
import ReviewItem from './ReviewItem';
import axios from 'axios';

const Reviews = (props) => {
  const [reviews, setReviews] = useState();
  const { page, limit } = props;

  useEffect(() => {
    const getAllReviewsOnTour = async () => {
      const res = await axios.get(
        `/api/v1/tours/${props.tourId}/reviews?page=${page}&limit=${limit}`
      );

      setReviews(res.data.data);
    };
    getAllReviewsOnTour();
  }, [page, limit]);

  if (!reviews) return null;

  return reviews.map((review, i) => (
    <ReviewItem
      key={review._id}
      index={i}
      page={props.page}
      limit={limit}
      review={review}
      reviewLength={props.reviewLength}
      showMore={props.showMore}
      showLess={props.showLess}
    />
  ));
};

export default Reviews;
