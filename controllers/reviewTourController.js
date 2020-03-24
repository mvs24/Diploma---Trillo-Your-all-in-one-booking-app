const ReviewTour = require('../models/reviewTourModel');
const factory = require('./factoryHandler');
// const asyncWrapper = require('../utils/asyncWrapper');
// const AppError = require('../utils/appError');

exports.createReview = factory.createOne(ReviewTour);
exports.getAllReviewOnTour = factory.getAll(ReviewTour);
exports.updateReview = factory.updateOne(ReviewTour);
exports.deleteReview = factory.deleteOne(ReviewTour);
