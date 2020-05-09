const ReviewFlight = require('../models/reviewFlightModel');
const factory = require('./factoryHandler');
const asyncWrapper = require('../utils/asyncWrapper');

exports.createReview = factory.createOne(ReviewFlight);
exports.updateReview = factory.updateOne(ReviewFlight);
exports.deleteReview = factory.deleteOne(ReviewFlight);

exports.getMyReviews = asyncWrapper(async (req, res, next) => {
  const myReviews = await ReviewFlight.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: myReviews.length,
    data: myReviews, 
  });
});
