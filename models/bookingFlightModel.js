const mongoose = require('mongoose');

const Agency = require('./agencyModel');
const Flight = require('./flightModel');
const AppError = require('../utils/appError');

const bookingFlightSchema = new mongoose.Schema({
  flight: {
    type: mongoose.Schema.ObjectId,
    ref: 'Flight'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  totalPrice: Number,
  numPersons: {
    type: Number,
    required: [' A booking must have number of persons specified!']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

bookingFlightSchema.index({ user: 1, flight: 1 }, { unique: true });

bookingFlightSchema.pre('save', async function(next) {
  const flight = await Flight.findById(this.flight);

  if (this.numPersons > flight.maxGroupSize) {
    return next(
      new AppError(
        'Number of persons must be smaller or equal than maximum group size',
        400
      )
    );
  }

  this.totalPrice = this.numPersons * flight.pricePerPerson;

  next();
});

bookingFlightSchema.post('save', async function(doc, next) {
  const flight = await Flight.findById(doc.flight);

  if (!flight) return next(new AppError('No flight found with that id', 404));

  const currentNumBought = flight.numBought;

  await Flight.findByIdAndUpdate(flight.id, {
    numBought: currentNumBought + 1
  });

  const agency = await Agency.findById(flight.agency);
  const currentNumOptionsBought = agency.numOptionsBought;

  await Agency.findByIdAndUpdate(agency.id, {
    numOptionsBought: currentNumOptionsBought + 1
  });

  next();
});

const BookingFlight = mongoose.model('BookingFlight', bookingFlightSchema);

module.exports = BookingFlight;
