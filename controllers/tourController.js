const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const factory = require('./factoryHandler');
const ApiFeatures = require('../utils/apiFeatures');
const asyncWrapper = require('../utils/asyncWrapper');
const Agency = require('../models/agencyModel');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const multer = require('multer')
const sharp = require('sharp')


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
      .filterCategory()
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


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);


exports.resizeTourImages = asyncWrapper(async (req, res, next) => {
  if (!req.file.imageCover || !req.files.images) return next();

  // 1) Cover image
 
  await sharp(req.body.imageCover)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(req.body.imageCover);

  // 2) Images
  req.body.images = [];
  if (req.body.images) {
    await req.body.images.forEach(async file => {
       await sharp(file)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(file);

    })

  }

  next();
});


exports.createTour =  asyncWrapper(async (req, res, next) => {
    req.body.startDates = JSON.parse(req.body.startDates)
    req.body.locations = JSON.parse(req.body.locations);
     req.body.startLocation = {
      coordinates: JSON.parse(req.body.coordinates),
      address: req.body.address,
      description: req.body.description
    }
  req.body.coordinates = undefined;
  req.body.address = undefined;
  req.body.description = undefined;
  if (req.file) {
    req.body.imageCover = req.file.path
  }

    const doc = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc
    });
  });
exports.updateTour = factory.updateOne(Tour)
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

  let msg = 'We have made a price discount! Visit us to learn more!';

  if (req.body.message) {
    msg = req.body.message;
  }

  const notification = {
    message: msg,
    agency: agency._id,
    tour: tour._id,
    createdAt: Date.now(),
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

exports.getByCategory = asyncWrapper(async (req, res, next) => {
  const difficulties = req.query.difficulties.split(',');
  let tours;
  if (req.query.rating) {
    tours = await getTours('future', {
      difficulty: { $in: difficulties },
      ratingsAverage: { $gte: req.query.rating },
    });
  } else tours = await Tour.find({ difficulty: { $in: difficulties } });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = asyncWrapper(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

exports.getDistances = asyncWrapper(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

exports.searchForTours = asyncWrapper(async (req, res, next) => {
  const { searchInput } = req.query;

  const toursFound = await Tour.find({
    $or: [
      { name: new RegExp(searchInput, 'i') },
      { difficulty: new RegExp(searchInput, 'i') },
      { summary: new RegExp(searchInput, 'i') },
      { description: new RegExp(searchInput, 'i') },
      { startLocation: { description: new RegExp(searchInput, 'i') } },
      { startLocation: { address: new RegExp(searchInput, 'i') } },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: toursFound.length,
    data: toursFound,
  });
});
