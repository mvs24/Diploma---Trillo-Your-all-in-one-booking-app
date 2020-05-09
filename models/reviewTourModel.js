const mongoose = require('mongoose');

const Tour = require('./tourModel');
const Agency = require('./agencyModel');

const reviewTourSchema = new mongoose.Schema(
  {
    review: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have a rating'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewTourSchema.index({ tour: 1, user: 1 }, { unique: true });

const updateAgency = async (document) => {
  const tour = await Tour.findById(document.tour);

  const toursOnAgency = await Tour.aggregate([
    {
      $match: { agency: tour.agency },
    },
    {
      $match: { ratingsQuantity: { $ne: 0 } },
    },
    {
      $group: {
        _id: '$agency',
        avgRating: { $avg: '$ratingsAverage' },
        nRating: { $sum: 1 },
      },
    },
  ]);

  let ratingsQuantity = 0;
  let ratingsAverage = 0.0;

  if (toursOnAgency.length > 0) {
    ratingsAverage = toursOnAgency[0].avgRating;
    ratingsQuantity = toursOnAgency[0].nRating;
  }

  await Agency.findByIdAndUpdate(toursOnAgency[0]._id, {
    ratingsAverage,
    ratingsQuantity,
  });
};

reviewTourSchema.statics.calcRatingsOnTour = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  let ratingsAverage = 0.0;
  let ratingsQuantity = 0;

  if (stats.length > 0) {
    ratingsQuantity = stats[0].nRating;
    ratingsAverage = stats[0].avgRating;
  }

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity,
    ratingsAverage,
  });
};

reviewTourSchema.post('save', async function (doc, next) {
  await doc.constructor.calcRatingsOnTour(doc.tour);

  await updateAgency(doc);

  next();
});

reviewTourSchema.post(/^findOneAnd/, async function (doc, next) {
  await doc.constructor.calcRatingsOnTour(doc.tour);

  await updateAgency(doc);

  next();
});

const ReviewTour = mongoose.model('ReviewTour', reviewTourSchema);

module.exports = ReviewTour;
