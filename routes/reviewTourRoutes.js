const express = require('express');

const ReviewTour = require('../models/reviewTourModel');
const authController = require('../controllers/authController');
const reviewTourController = require('../controllers/reviewTourController');
const setTourUserId = require('../globalMiddlewares/setTourUserId');
const controlCreator = require('../globalMiddlewares/controlCreator');
const filterBody = require('../globalMiddlewares/filterBody');

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

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('user'),
    controlCreator(ReviewTour),
    filterBody(['tour', 'user']),
    reviewTourController.updateReview
  )
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    controlCreator(ReviewTour),
    filterBody(['tour', 'user']),
    reviewTourController.deleteReview
  );

module.exports = router;
