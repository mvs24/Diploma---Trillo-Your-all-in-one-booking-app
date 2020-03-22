const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const User = require('../models/userModel');
const asyncWrapper = require('../utils/asyncWrapper');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

exports.signup = asyncWrapper(async (req, res, next) => {
  const { name, lastname, password, passwordConfirm, email } = req.body;

  const user = await User.create({
    name,
    lastname,
    password,
    passwordConfirm,
    email
  });

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: user
  });
});

exports.login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Complete all the fields!', 400));
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError('No user found with that email and password!', 404)
    );
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = asyncWrapper(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exists', 404)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Password changed after the token was released. Please log in again!',
        400
      )
    );
  }

  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError('You do not have permission to perform this action!', 403)
    );
  }

  next();
};
