const Flight = require('../models/flightModel');
const ApiFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/appError');
const factory = require('./factoryHandler');
const asyncWrapper = require('../utils/asyncWrapper');

const getFlightsForSingleAgency = type =>
  asyncWrapper(async (req, res, next) => {
    let filter = {};

    if (req.params.agencyId) {
      filter = { agency: req.params.agencyId };
    }

    const features = new ApiFeatures(Flight.find(filter), req.query)
      .filter()
      .sort()
      .select()
      .paginate();

    const flights = await features.query;

    let futureFlights = [];
    let finishedFlights = [];

    flights.forEach(el => {
      if (el.depart.getTime() > Date.now()) {
        futureFlights.push(el);
      } else {
        finishedFlights.push(el);
      }
    });

    let results;
    let data;

    if (type === 'finished') {
      results = finishedFlights.length;
      data = finishedFlights;
    } else if (type === 'future') {
      results = futureFlights.length;
      data = futureFlights;
    }

    res.status(200).json({
      status: 'success',
      results,
      data
    });
  });

exports.createFlight = factory.createOne(Flight);
exports.deleteFlight = factory.deleteOne(Flight);
exports.getFinishedFlights = getFlightsForSingleAgency('finished');
exports.getFutureFlights = getFlightsForSingleAgency('future');

exports.updateFlight = asyncWrapper(async (req, res, next) => {
  const flight = await Flight.findById(req.params.id);

  if (!flight) return next(new AppError('Flight not found', 404));

  Object.keys(req.body).forEach(el => {
    flight[el] = req.body[el];
  });

  const updatedFlight = await flight.save();

  res.status(200).json({
    status: 'success',
    data: updatedFlight
  });
});
