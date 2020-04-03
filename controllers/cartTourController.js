const factory = require('./factoryHandler');
const CartTour = require('../models/cartTourModel');
const asyncWrapper = require('../utils/asyncWrapper');

exports.addToCart = factory.createOne(CartTour);

exports.removeFromCart = asyncWrapper(async (req, res, next) => {
  await CartTour.findOneAndDelete({
    tour: req.params.tourId,
    user: req.user.id
  }); 

  res.status(204).json({
    status: 'success'
  });
});

exports.getToursForUser = asyncWrapper(async (req, res, next) => {
  const tours = await CartTour.find({ user: req.user.id }).select('+tour');
  // .populate({ path: 'tour', select: 'name price imageCover summary' });

  const totalPrice = tours.reduce((acc, cur) => cur.tour.price + acc, 0);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    totalPrice,
    data: tours
  });
});
