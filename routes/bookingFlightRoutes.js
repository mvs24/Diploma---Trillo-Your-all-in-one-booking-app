const express = require('express');

const bookingFlightController = require('../controllers/bookingFlightController');
const authController = require('../controllers/authController');
const setFlightUserId = require('../globalMiddlewares/setFlightUserId');

const router = express.Router();

router
  .route('/control/numGroupSize')
  .get(bookingFlightController.controlNumberGroupSize);
router.post(
  '/checkout-session/:flightId',
  authController.protect,
  bookingFlightController.controlNumberGroupSize,
  bookingFlightController.getCheckoutSession
);

router
  .route('/finishedBookings')
  .get(authController.protect, bookingFlightController.getFinishedBookings);

router
  .route('/futureBookings')
  .get(authController.protect, bookingFlightController.getFutureBookings);

router.route('/:flightId').post(
  authController.protect,
  setFlightUserId,

  bookingFlightController.createBooking
);

module.exports = router;
