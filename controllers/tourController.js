const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const factory = require('./factoryHandler');
const ApiFeatures = require('../utils/apiFeatures');
const asyncWrapper = require('../utils/asyncWrapper');
const Agency = require('../models/agencyModel');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

const getToursBy = (sortBy) =>
  asyncWrapper(async (req, res, next) => {
    let tours = await Tour.find().sort(sortBy);

    tours = tours.filter(
      (el) => el.startDates[el.startDates.length - 1].getTime() > Date.now()
    );

    let wantedTours = [];
    if (tours.length > 5) {
      wantedTours = tours.splice(0, 5);
    }

    res.status(200).json({
      status: 'success',
      results: wantedTours.length,
      data: wantedTours,
    });
  });

const getTours = (type) =>
  asyncWrapper(async (req, res, next) => {
    let filter = {};

    if (req.params.agencyId) {
      filter = { agency: req.params.agencyId };
    }

    const features = new ApiFeatures(Tour.find(filter), req.query)
      .filter()
      .sort()
      .select()
      .paginate();

    const tours = await features.query;

    let futureTours = [];
    let finishedTours = [];

    tours.forEach((tour) => {
      if (tour.startDates.length > 0) {
        const lastDate = tour.startDates[tour.startDates.length - 1];
        if (lastDate.getTime() > Date.now()) {
          futureTours.push(tour);
        } else {
          finishedTours.push(tour);
        }
      }
    });

    let results;
    let data;

    if (type === 'finished') {
      results = finishedTours.length;
      data = finishedTours;
    } else if (type === 'future') {
      results = futureTours.length;
      data = futureTours;
    }

    res.status(200).json({
      status: 'success',
      results,
      data,
    });
  });

// /agencies/:agencyId/tours

exports.getTour = factory.getOne(Tour);
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getFinishedTours = getTours('finished');
exports.getAllTours = getTours('future');

exports.getTopFiveTours = getToursBy('-ratingsAverage');
exports.getMostPopularTours = getToursBy('-bought');

exports.getTourStatistics = asyncWrapper(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsQuantity: { $ne: 0 } },
    },
    {
      $group: {
        _id: '$agency',
        avg: { $avg: '$ratingsAverage' },
      },
    },
  ]);

  console.log(stats);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

exports.getReviewStats = asyncWrapper(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  const totalReviews = tour.ratingsQuantity;
  const avgRating = tour.ratingsAverage;
  const tourId = mongoose.Types.ObjectId(req.params.tourId);

  const stats = await Tour.aggregate([
    {
      $match: {
        _id: { $in: [mongoose.Types.ObjectId(req.params.tourId.toString())] },
      },
    },
    {
      $lookup: {
        from: 'reviewtours',
        foreignField: 'tour',
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

exports.discountTour = asyncWrapper(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  const agency = await Agency.findById(tour.agency.toString());

  if (!req.body.priceDiscount)
    return next(new AppError('Please specify a price discount', 400));

  const userToNotify = [];
  agency.tours.forEach((tour) => {
    tour.bookings.forEach((booking) => {
      userToNotify.push(booking.user);
    });
  });

  const notification = {
    message: req.body.message,
    agency: agency._id,
    tour: tour._id,
  };

  for (let i = 0; i < userToNotify.length - 1; i++) {
    for (let j = i + 1; j < userToNotify.length; j++) {
      if (userToNotify[i].toString() == userToNotify[j].toString()) {
        userToNotify.splice(i, 1);
      }
    }
  }
  for (let i = 0; i < userToNotify.length - 1; i++) {
    for (let j = i + 1; j < userToNotify.length; j++) {
      if (userToNotify[i].toString() == userToNotify[j].toString()) {
        userToNotify.splice(i, 1);
      }
    }
  }

  const priceDiscount = req.body.priceDiscount;
  tour.priceDiscount = priceDiscount;
  tour.price = tour.price - priceDiscount;
  await tour.save();

  userToNotify.forEach(async (userId) => {
    const user = await User.findById(userId);
    if (user) {
      user.notifications.push(notification);
      await user.save();
    }
  });

  res.status(200).json({
    status: 'success',
    tour,
  });
});
