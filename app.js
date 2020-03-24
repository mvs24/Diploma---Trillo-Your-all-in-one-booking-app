const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/userRoutes');
const agencyRouter = require('./routes/agencyRoutes');
const tourRouter = require('./routes/tourRoutes');
const bookingTourRouter = require('./routes/bookingTourRoutes');
const reviewTourRouter = require('./routes/reviewTourRoutes');
const wishlistTourRouter = require('./routes/wishlistTourRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// gzip & security

app.use(bodyParser.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/agencies', agencyRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/bookings/tours', bookingTourRouter);
app.use('/api/v1/reviews/tours', reviewTourRouter);
app.use('/api/v1/wishlists/tours', wishlistTourRouter);

app.all('*', (req, res, next) =>
  next(new AppError('This route is not yet defined', 404))
);

app.use(globalErrorHandler);

module.exports = app;
