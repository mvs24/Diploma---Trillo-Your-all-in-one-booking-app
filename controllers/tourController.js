const Tour = require('../models/tourModel');
const factory = require('./factoryHandler');
const ApiFeatures = require('../utils/apiFeatures');
const asyncWrapper = require('../utils/asyncWrapper');

const getToursBy = sortBy =>
  asyncWrapper(async (req, res, next) => {
    let tours = await Tour.find().sort(sortBy);

    tours = tours.filter(
      el => el.startDates[el.startDates.length - 1].getTime() > Date.now()
    );

    let wantedTours = [];
    if (tours.length > 5) {
      wantedTours = tours.splice(0, 5);
    }

    res.status(200).json({
      status: 'success',
      results: wantedTours.length,
      data: wantedTours
    });
  });

const getTours = type =>
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

    tours.forEach(tour => {
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
      data
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
      $match: { ratingsQuantity: { $ne: 0 } }
    },
    {
      $group: {
        _id: '$agency',
        avg: { $avg: '$ratingsAverage' }
      }
    }
  ]);

  console.log(stats);

  res.status(200).json({
    status: 'success',
    data: stats
  });
});
