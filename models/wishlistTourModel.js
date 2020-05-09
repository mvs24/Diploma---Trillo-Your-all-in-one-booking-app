const mongoose = require('mongoose');

const wishlistTourSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

const WishlistTour = mongoose.model('WishlistTour', wishlistTourSchema);

module.exports = WishlistTour;
