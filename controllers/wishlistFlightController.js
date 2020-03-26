const factory = require('./factoryHandler');
const WishlistFlight = require('../models/wishlistFlightModel');
const asyncWrapper = require('../utils/asyncWrapper');

exports.addToWishlist = factory.createOne(WishlistFlight);

exports.getFlightsForUser = asyncWrapper(async (req, res, next) => {
  const flights = await WishlistFlight.find({ user: req.user.id })
    .select('+flight')
    .populate({ path: 'flight', select: 'from to' });

  const totalPrice = flights.reduce((acc, cur) => cur.totalPrice + acc, 0);

  res.status(200).json({
    status: 'success',
    results: flights.length,
    totalPrice,
    data: flights
  });
});
