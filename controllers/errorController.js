const AppError = require('../utils/appError');

const handleDuplicateError = (err) => new AppError('Duplicate key', 400);

const handleJWTError = () =>
  new AppError('Token is invalid! Please log in again!', 401);

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
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.code === 11000) error = handleDuplicateError(error);
    else if (error.name === 'ValidationError')
      error = handleValidationError(error);
    else if (error.name === 'JsonWebTokenError') error = handleJWTError();

    sendErrorProd(error, res);
  }
};
