const mongoose = require('mongoose');

const bookingTourSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const BookingTour = mongoose.model('BookingTour', bookingTourSchema);

module.exports = BookingTour;
