const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');

const BookingFlight = require('../models/bookingFlightModel');
const Flight = require('../models/flightModel');
const factory = require('./factoryHandler');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/AppError');

const getBookings = (type) =>
  asyncWrapper(async (req, res, next) => {
    const bookings = await BookingFlight.find({ user: req.user.id });

    let finishedBookings = [];
    let futureBookings = [];

    const flightsPromise = bookings.map(async (booking) => {
      return await Flight.findById(booking.flight);
    });
    const flights = await Promise.all(flightsPromise);

    flights.forEach((flight) => {
      if (flight.depart.getTime() < Date.now()) {
        finishedBookings.push(flight);
      } else {
        futureBookings.push(flight);
      }
    });

    let results;
    let data;

    if (type === 'finished') {
      results = finishedBookings.length;
      data = finishedBookings;
    } else if (type === 'future') {
      results = futureBookings.length;
      data = futureBookings;
    }

    res.status(200).json({
      status: 'success',
      results,
      data,
    });
  });

exports.getCheckoutSession = asyncWrapper(async (req, res, next) => {
  const flight = await Flight.findById(req.params.flightId);

  if (!req.body.numPersons)
    return next(new AppError('Please specify number of persons', 400));

  const name = flight.returnDate
    ? `Depart: ${moment(flight.depart, 'YYYY-MM-DD')}  - Return: ${moment(
        flight.returnDate,
        'YYYY-MM-DD'
      )}`
    : `Depart: ${moment(flight.depart, 'YYYY-MM-DD ')}`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/success/flights/${
      flight._id
    }/users/${req.user.id}/price/${
      flight.pricePerPerson * req.body.numPersons
    }/persons/${req.body.numPersons}`, //succes url for the frontend!!!!
    cancel_url: `${req.protocol}://${req.get('host')}/categories/flights/`,
    customer_email: req.user.email,
    client_reference_id: req.params.flightId,
    line_items: [
      {
        name,
        description: `From: ${flight.from} - To: ${flight.to}`,
        amount: flight.pricePerPerson * 100,
        currency: 'usd',
        quantity: +req.body.numPersons,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.controlNumberGroupSize = asyncWrapper(async (req, res, next) => {
  const flight = await Flight.findOne({ _id: req.params.flightId });
  if (flight.numBought >= flight.maxGroupSize) {
    return next(
      new AppError('This flight has reached maximum number of persons...', 400)
    );
  }

  next();
});

exports.createBooking = factory.createOne(BookingFlight);
exports.getFutureBookings = getBookings('future');
exports.getFinishedBookings = getBookings('finished');
