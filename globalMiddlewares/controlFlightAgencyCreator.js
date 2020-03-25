const asyncWrapper = require('../utils/asyncWrapper');
const Flight = require('../models/flightModel');
const Agency = require('../models/agencyModel');
const AppError = require('../utils/appError');

module.exports = asyncWrapper(async (req, res, next) => {
  let agencyId;

  if (!req.params.agencyId) {
    const flight = await Flight.findOne({ _id: req.params.id });
    agencyId = flight.agency;
  } else {
    agencyId = req.params.agencyId;
  }

  const agency = await Agency.findById(agencyId);

  if (req.user.id.toString() !== agency.user.toString()) {
    return next(new AppError('You can not update this document', 403));
  }

  next();
});
