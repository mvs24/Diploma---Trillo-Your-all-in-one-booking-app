const mongoose = require('mongoose');

const Agency = require('./agencyModel');
const Tour = require('./tourModel');
const AppError = require('../utils/appError');

const bookingTourSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

bookingTourSchema.index({ user: 1, tour: 1 }, { unique: true });

bookingTourSchema.post('save', async function (doc, next) {
  const tour = await Tour.findById(doc.tour);

  if (!tour) return next(new AppError('No tour found with that id', 404));

  const currentNumBought = tour.numBought;

  await Tour.findByIdAndUpdate(tour.id, { numBought: currentNumBought + 1 });

  const agency = await Agency.findById(tour.agency);
  const currentNumOptionsBought = agency.numOptionsBought;

  await Agency.findByIdAndUpdate(agency.id, {
    numOptionsBought: currentNumOptionsBought + 1,
  });

  next();
});

const BookingTour = mongoose.model('BookingTour', bookingTourSchema);

module.exports = BookingTour;
