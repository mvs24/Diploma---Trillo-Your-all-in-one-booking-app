const mongoose = require('mongoose');

const cartTourSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

const CartTour = mongoose.model('CartTour', cartTourSchema);

module.exports = CartTour;
