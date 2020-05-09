const factory = require('./factoryHandler');
const WishlistTour = require('../models/wishlistTourModel');
const asyncWrapper = require('../utils/asyncWrapper');

exports.addToWishlist = factory.createOne(WishlistTour);
exports.removeFromWishlist = asyncWrapper(async (req, res, next) => {
  await WishlistTour.findOneAndDelete({
    tour: req.params.tourId,
    user: req.user.id,
  });

  res.status(204).json({
    status: 'success',
  });
});

exports.getToursForUser = asyncWrapper(async (req, res, next) => {
  const tours = await WishlistTour.find({ user: req.user.id }).select('+tour');

  const totalPrice = tours.reduce((acc, cur) => cur.tour.price + acc, 0);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    totalPrice,
    data: tours,
  });
});
