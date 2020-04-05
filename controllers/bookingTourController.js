const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const BookingTour = require('../models/bookingTourModel');
const Tour = require('../models/tourModel');
const factory = require('./factoryHandler');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/appError');

const getBookings = asyncWrapper(async (filter, res, next) => {
  const bookings = await BookingTour.find(filter).populate('tour');

  if (!bookings) return next(new AppError('No bookings found', 404));

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: bookings,
  });
});

exports.getCheckoutSession = asyncWrapper(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `http://localhost:3000/success/tours/${tour._id}/users/${req.user.id}/price/${tour.price}`, //succes url for the frontend!!!!
    cancel_url: `http://localhost:3000/tours/${tour._id}`,
    // success_url: `${req.protocol}://${req.get('host')}/`, //succes url for the frontend!!!!
    // cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`, // control for the frontend!!!!
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get('host')}/public/img/tours/${
            tour.imageCover
          }`,
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.getBookingsForTour = async (req, res, next) => {
  await getBookings({ tour: req.params.tourId }, res, next);
};

exports.getMyBookings = async (req, res, next) => {
  await getBookings({ user: req.user.id }, res, next);
};

exports.createBooking = factory.createOne(BookingTour);
exports.getAllBookings = factory.getAll(BookingTour);
