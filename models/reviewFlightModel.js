const mongoose = require('mongoose');

const Flight = require('./flightModel');
const Agency = require('./agencyModel');

const reviewFlightSchema = new mongoose.Schema(
  {
    review: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have a rating']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    flight: {
      type: mongoose.Schema.ObjectId,
      ref: 'Flight'
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewFlightSchema.index({ flight: 1, user: 1 }, { unique: true });

const updateAgency = async document => {
  const flight = await Flight.findById(document.flight);

  const flightsOnAgency = await Flight.aggregate([
    {
      $match: { agency: flight.agency }
    },
    {
      $match: { ratingsQuantity: { $ne: 0 } }
    },
    {
      $group: {
        _id: '$agency',
        avgRating: { $avg: '$ratingsAverage' },
        nRating: { $sum: 1 }
      }
    }
  ]);

  let ratingsQuantity = 0;
  let ratingsAverage = 0.0;

  if (flightsOnAgency.length > 0) {
    ratingsAverage = flightsOnAgency[0].avgRating;
    ratingsQuantity = flightsOnAgency[0].nRating;
  }

  await Agency.findByIdAndUpdate(flightsOnAgency[0]._id, {
    ratingsAverage,
    ratingsQuantity
  });
};

reviewFlightSchema.statics.calcRatingsOnFlight = async function(flightId) {
  const stats = await this.aggregate([
    {
      $match: { flight: flightId }
    },
    {
      $group: {
        _id: '$flight',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  let ratingsAverage = 0.0;
  let ratingsQuantity = 0;

  if (stats.length > 0) {
    ratingsQuantity = stats[0].nRating;
    ratingsAverage = stats[0].avgRating;
  }

  await Flight.findByIdAndUpdate(flightId, {
    ratingsQuantity,
    ratingsAverage
  });
};

reviewFlightSchema.post('save', async function(doc, next) {
  await doc.constructor.calcRatingsOnFlight(doc.flight);

  await updateAgency(doc);

  next();
});

reviewFlightSchema.post(/^findOneAnd/, async function(doc, next) {
  await doc.constructor.calcRatingsOnFlight(doc.flight);

  await updateAgency(doc);

  next();
});

const ReviewFlight = mongoose.model('ReviewFlight', reviewFlightSchema);

module.exports = ReviewFlight;
