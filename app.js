const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

const userRouter = require('./routes/userRoutes');
const agencyRouter = require('./routes/agencyRoutes');
const tourRouter = require('./routes/tourRoutes');
const bookingTourRouter = require('./routes/bookingTourRoutes');
const reviewTourRouter = require('./routes/reviewTourRoutes');
const reviewFlightRouter = require('./routes/reviewFlightRoutes');
const wishlistTourRouter = require('./routes/wishlistTourRoutes');
const wishlistFlightRouter = require('./routes/wishlistFlightRoutes');
const cartTourRouter = require('./routes/cartTourRoutes');
const flightRouter = require('./routes/flightRoutes');
const bookingFlightRouter = require('./routes/bookingFlightRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//*****************
//gzip & security
//*****************
app.use(compression());
// Set security HTTP Headers
app.use(helmet());
// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
      'pricePerPerson',
    ],
  })
);
// Parse req.body
app.use(bodyParser.json());
// Data Sanitization against NoSQL Query Injection
app.use(mongoSanitize());
//  Data Sanitization against XSS (Bad HTML Code!!!)
app.use(xss()); 
//***************//////////

app.use(
  '/public/img/tours',
  express.static(path.join('public', 'img', 'tours'))
);
app.use(
  '/public/img/users',
  express.static(path.join('public', 'img', 'users'))
);
app.use(
  '/public/img/agencies',
  express.static(path.join('public', 'img', 'agencies'))
);

app.use(express.static(path.join('client/build')))

app.use('/api/v1/users', userRouter);
app.use('/api/v1/agencies', agencyRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/bookings/tours', bookingTourRouter);
app.use('/api/v1/bookings/flights', bookingFlightRouter);
app.use('/api/v1/reviews/tours', reviewTourRouter);
app.use('/api/v1/reviews/flights', reviewFlightRouter);
app.use('/api/v1/wishlist/tours', wishlistTourRouter);
app.use('/api/v1/wishlist/flights', wishlistFlightRouter);
app.use('/api/v1/cart/tours', cartTourRouter);
app.use('/api/v1/flights', flightRouter);

if (process.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))

})

}

// app.all('*', (req, res, next) =>
//   next(new AppError('This route is not yet defined', 404))
// );

app.use(globalErrorHandler);

module.exports = app;
