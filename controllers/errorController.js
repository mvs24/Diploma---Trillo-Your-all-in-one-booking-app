const AppError = require('../utils/appError');

const handleDuplicateError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(err)

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Token is invalid! Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const handleValidationError = (err) => {
  const errors = Object.values(err.errors);
  const newErr = errors.map((el) => el.message);

  return new AppError(newErr.join('. \n'), 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  // if (req.file) {
  //   fs.unlink(req.file.path, (err) => {
  //     console.log(err);
  //   });
  // }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
    console.log(err)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.code === 11000) error = handleDuplicateError(error);
     if (error.name === 'ValidationError')
      error = handleValidationError(error);
     if (error.name === 'CastError') error = handleCastErrorDB(error);
     if (error.name === 'JsonWebTokenError') error = handleJWTError();
     if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError();
 

    sendErrorProd(error, res);
  }
};
