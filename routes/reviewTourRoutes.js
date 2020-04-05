const express = require('express');

const ReviewTour = require('../models/reviewTourModel');
const authController = require('../controllers/authController');
const reviewTourController = require('../controllers/reviewTourController');
const setTourUserId = require('../globalMiddlewares/setTourUserId');
const controlCreator = require('../globalMiddlewares/controlCreator');
const controlBookingTour = require('../globalMiddlewares/controlBookingTour');
const filterBody = require('../globalMiddlewares/filterBody');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    setTourUserId,
    controlBookingTour,
    reviewTourController.createReview
  )
  .get((req, res, next) => {
    if (req.params.tourId) req.tourReviews = req.params.tourId;
    next();
  }, reviewTourController.getAllReviewOnTour);

router.use(
  authController.protect,
  authController.restrictTo('user'),
  controlCreator(ReviewTour),
  filterBody(['tour', 'user']),
  controlBookingTour
);

router
  .route('/:id')
  .patch(reviewTourController.updateReview)
  .delete(reviewTourController.deleteReview);

module.exports = router;
