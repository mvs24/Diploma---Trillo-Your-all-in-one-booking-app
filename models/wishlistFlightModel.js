const mongoose = require('mongoose');

const Flight = require('./flightModel');

const wishlistFlightSchema = new mongoose.Schema({
  flight: {
    type: mongoose.Schema.ObjectId,
    ref: 'Flight',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  totalPrice: Number,
  numPersons: {
    type: Number,
    default: 1,
  },
});

wishlistFlightSchema.pre('save', async function (next) {
  const flight = await Flight.findById(this.flight);
  const pricePerPerson = flight.pricePerPerson;

  this.totalPrice = this.numPersons * pricePerPerson;

  next();
});

const WishlistFlight = mongoose.model('WishlistFlight', wishlistFlightSchema);

module.exports = WishlistFlight;
