const ReviewFlight = require('../models/reviewFlightModel');
const factory = require('./factoryHandler');

exports.createReview = factory.createOne(ReviewFlight);
exports.updateReview = factory.updateOne(ReviewFlight);
exports.deleteReview = factory.deleteOne(ReviewFlight);
// exports.getAllReviewOnTour = factory.getAll(ReviewTour);
