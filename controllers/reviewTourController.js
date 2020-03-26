const ReviewTour = require('../models/reviewTourModel');
const factory = require('./factoryHandler');

exports.createReview = factory.createOne(ReviewTour);
exports.getAllReviewOnTour = factory.getAll(ReviewTour); //can be done using VIRTUAL POPULATE!!!
exports.updateReview = factory.updateOne(ReviewTour);
exports.deleteReview = factory.deleteOne(ReviewTour);
