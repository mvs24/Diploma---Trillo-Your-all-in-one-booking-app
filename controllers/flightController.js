const mongoose = require('mongoose');
const Flight = require('../models/flightModel');
const ApiFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/appError');
const factory = require('./factoryHandler');
const asyncWrapper = require('../utils/asyncWrapper');

const getFlightsForSingleAgency = (type) =>
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

    flights.forEach((el) => {
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
      data,
    });
  });

exports.getFlight = factory.getOne(Flight);
exports.createFlight = factory.createOne(Flight);
exports.deleteFlight = factory.deleteOne(Flight);
exports.getFinishedFlights = getFlightsForSingleAgency('finished');
exports.getFutureFlights = getFlightsForSingleAgency('future');

exports.updateFlight = asyncWrapper(async (req, res, next) => {
  const flight = await Flight.findById(req.params.id);

  if (!flight) return next(new AppError('Flight not found', 404));

  Object.keys(req.body).forEach((el) => {
    flight[el] = req.body[el];
  });

  const updatedFlight = await flight.save();

  res.status(200).json({
    status: 'success',
    data: updatedFlight,
  });
});

exports.getSearchedFlights = asyncWrapper(async (req, res, next) => {
  const { from, to, depart, package, returnDate } = req.query;

  const flights = await Flight.find({
    from: new RegExp(from, 'i'),
    to: new RegExp(to, 'i'),
    depart,
    package,
    returnDate,
  });

  res.status(200).json({
    status: 'success',
    results: flights.length,
    data: flights,
  });
});

exports.getReviewStats = asyncWrapper(async (req, res, next) => {
  const flight = await Flight.findById(req.params.flightId);
  const totalReviews = flight.ratingsQuantity;
  const avgRating = flight.ratingsAverage;
  const flightId = mongoose.Types.ObjectId(req.params.flightId);

  const stats = await Flight.aggregate([
    {
      $match: {
        _id: { $in: [mongoose.Types.ObjectId(req.params.flightId.toString())] },
      },
    },
    {
      $lookup: {
        from: 'reviewflights',
        foreignField: 'flight',
        localField: '_id',
        as: 'reviews',
      },
    },
    {
      $unwind: '$reviews',
    },

    {
      $group: {
        _id: '$reviews.rating',
        nReviews: { $sum: 1 },
      },
    },
    {
      $addFields: { rating: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $addFields: {
        percentage: {
          $multiply: [{ $divide: ['$nReviews', totalReviews] }, 100],
        },
      },
    },
    {
      $sort: { rating: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: stats,
    totalReviews,
    avgRating,
  });
});
