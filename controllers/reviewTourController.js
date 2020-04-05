const ReviewTour = require('../models/reviewTourModel');
const factory = require('./factoryHandler');
const asyncWrapper = require('../utils/asyncWrapper');

exports.createReview = factory.createOne(ReviewTour);
exports.getAllReviewOnTour = factory.getAll(ReviewTour); //can be done using VIRTUAL POPULATE!!!
exports.updateReview = factory.updateOne(ReviewTour);
exports.deleteReview = factory.deleteOne(ReviewTour);

exports.getMyReviews = asyncWrapper(async (req, res, next) => {
  const myReviews = await ReviewTour.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: myReviews.length,
    data: myReviews,
  });
});
