const BookingTour = require('../models/bookingTourModel');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/appError');

module.exports = asyncWrapper(async (req, res, next) => {
  const bookingTour = await BookingTour.findOne({
    user: req.body.user,
    tour: req.body.tour
  });

  if (!bookingTour)
    return next(
      new AppError('You need to book the tour to give a review!', 400)
    );

  next();
});
