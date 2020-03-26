const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const BookingFlight = require('../models/bookingFlightModel');
const Flight = require('../models/flightModel');
const factory = require('./factoryHandler');
const asyncWrapper = require('../utils/asyncWrapper');

const getBookings = type =>
  asyncWrapper(async (req, res, next) => {
    const bookings = await BookingFlight.find({ user: req.user.id });

    let finishedBookings = [];
    let futureBookings = [];

    const flightsPromise = bookings.map(async booking => {
      return await Flight.findById(booking.flight);
    });
    const flights = await Promise.all(flightsPromise);

    flights.forEach(flight => {
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
      data
    });
  });

exports.getCheckoutSession = asyncWrapper(async (req, res, next) => {
  const flight = await Flight.findById(req.params.flightId);

  if (!req.body.numPersons)
    return next(new AppError('Please specify number of persons', 400));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`, //succes url for the frontend!!!!
    cancel_url: `${req.protocol}://${req.get('host')}/`, // control for the frontend!!!!
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `Depart: ${flight.depart} - Return: ${flight.returnDate}`,
        description: `From: ${flight.from.description} - To: ${flight.to.description}`,
        // images: [
        //   `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}` //images single one
        // ],
        amount: flight.pricePerPerson,
        currency: 'usd',
        quantity: flight.pricePerPerson * req.body.numPersons
      }
    ]
  });

  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBooking = factory.createOne(BookingFlight);
exports.getFutureBookings = getBookings('future');
exports.getFinishedBookings = getBookings('finished');
