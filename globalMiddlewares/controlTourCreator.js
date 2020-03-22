const AppError = require('../utils/appError');

module.exports = Tour => async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) return next(new AppError('Tour not found', 404));

  if (tour.user.toString() !== req.user.id.toString()) {
    return next(new AppError('You can not delete this tour', 403));
  }

  next();
};
