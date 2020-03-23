const express = require('express');

const bookingTourController = require('../controllers/bookingTourController');
const setTourUserId = require('../globalMiddlewares/setTourUserId');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingTourController.getCheckoutSession
);

router
  .route('/:tourId')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    setTourUserId,
    bookingTourController.createBooking
  )
  .get(bookingTourController.getBookingsForTour);

router.route('/').get(bookingTourController.getAllBookings);

module.exports = router;
