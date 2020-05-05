const Agency = require('../models/agencyModel');
const factory = require('./factoryHandler');
const asyncWrapper = require('../utils/asyncWrapper');

exports.getAllAgencies = factory.getAll(Agency);
exports.createAgency = factory.createOne(Agency);
exports.deleteAgency = factory.deleteOne(Agency);
exports.getAgency = factory.getOne(Agency);
exports.updateAgency = factory.updateOne(Agency);

exports.getAgencyStatistics = asyncWrapper(async (req, res, next) => {
  const agencyStatistics = await Agency.aggregate([
    {
      $match: { ratingsQuantity: { $ne: 0 } }
    },
    {
      $group: {
        _id: 'categories',
        avg: { $avg: '$ratingsAverage' },
        nAgencies: { $sum: 1 },
        maxRating: { $max: '$ratingsAverage' },
        minRating: { $min: '$ratingsAverage' }
      }
    }
  ]);


  res.status(200).json({
    status: 'success',
    data: agencyStatistics
  });
});

exports.getMostPopularAgencies = asyncWrapper(async (req, res, next) => {
  const mostPopularAgencies = await Agency.aggregate([
    {
      $group: {
        _id: '$numOptionsBought',
        name: { $push: '$name' },
        agencyId: { $push: '$_id' }
      }
    },
    {
      $addFields: { number: '$_id' }
    },
    {
      $sort: { _id: -1 }
    }
  ]);

  let names = [];
  let ids = [];

  mostPopularAgencies.forEach(el => {
    el.name.forEach(name => {
      names.push({ name, number: el.number });
    });
    el.agencyId.forEach(id => {
      ids.push(id);
    });
  });


  res.status(200).json({
    status: 'success',
    data: mostPopularAgencies
  });
});
