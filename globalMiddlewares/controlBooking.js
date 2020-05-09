const BookingFlight = require('../models/bookingFlightModel');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/appError');

module.exports = asyncWrapper(async (req, res, next) => {
  const bookingFlight = await BookingFlight.findOne({
    user: req.body.user,
    flight: req.body.flight,
  });

  if (!bookingFlight)
    return next(
      new AppError('You need to book the flight to give a review!', 400)
    );

  next();
});
