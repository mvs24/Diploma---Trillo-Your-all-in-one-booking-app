const Agency = require('../models/agencyModel');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/appError');

module.exports = category =>
  asyncWrapper(async (req, res, next) => {
    const agency = await Agency.findById(req.body.agency);

    if (!agency) {
      return next(new AppError('Agency not found', 404));
    }

    if (agency.category !== category) {
      return next(
        new AppError(
          `Category of the agency must be ${category} to complete this action`,
          400
        )
      );
    }

    next();
  });
