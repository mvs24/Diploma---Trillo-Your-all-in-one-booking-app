const AppError = require('../utils/appError');
const Agency = require('../models/agencyModel');

module.exports = (Tour) => async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  const agency = await Agency.findById(tour.agency);

  if (!tour) return next(new AppError('Tour not found', 404));

  if (agency.user.toString() !== req.user.id.toString()) {
    return next(new AppError('You can not manipulate this tour', 403));
  }

  next();
};
