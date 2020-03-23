const express = require('express');

const authController = require('../controllers/authController');
const reviewTourController = require('../controllers/reviewTourController');
const setTourUserId = require('../globalMiddlewares/setTourUserId');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    setTourUserId,
    reviewTourController.createReview
  )
  .get(reviewTourController.getAllReviewOnTour);

module.exports = router;
