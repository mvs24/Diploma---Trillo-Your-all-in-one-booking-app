const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Email = require('../utils/email');

const AppError = require('../utils/appError');
const User = require('../models/userModel');
const asyncWrapper = require('../utils/asyncWrapper');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.signup = asyncWrapper(async (req, res, next) => {
  const { name, lastname, password, passwordConfirm, email, photo } = req.body;

  if (!photo) req.body.photo = 'https://mariusfirstbucket.s3.eu-west-3.amazonaws.com/pexels-photo-814499-1589107552822.jpg';
  const user = await User.create({
    name,
    lastname,
    password,
    passwordConfirm,
    email,
    photo: req.body.photo,
  });
  try {
    const url = `${req.protocol}://${req.get('host')}/me`; // modify in production
    await new Email(user, url).sendWelcome();
  } catch (err) {}

  const token = signToken(user._id);

  const userPhoto = user.photo;

  res.status(201).json({
    status: 'success',
    token,
    data: { name, lastname, email, photo: userPhoto, id: user._id },
  });
});

exports.login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Complete all the fields',
    });
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(404).json({
      status: 'fail',
      message: 'No user found with that email and password!',
    });
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      photo: user.photo,
      id: user._id,
    },
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

  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError(
  //       'Password changed after the token was released. Please log in again!',
  //       400
  //     )
  //   );
  // }

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

exports.forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new AppError('Email is required', 400));

  const user = await User.findOne({ email });

  if (!user) return next(new AppError('No user found with that email', 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // const resetURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password?\n Copy your code: ${resetToken}`;

  try {
    await new Email(user, message).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = asyncWrapper(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  user.password = undefined;
  user.passwordConfirm = undefined;

  const token = signToken(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});

exports.getLoggedInUser = (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: 'success',
    data: {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      id: user.id,
      photo: user.photo,
    },
  });
};

exports.updatePassword = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return res.status(401).json({
      status: 'fail',
      message: 'Your current password is wrong.',
    });
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  const token = signToken(user._id);

  user.password = undefined;
  res.status(200).json({
    status: 'success',
    token,
    data: {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      photo: user.photo,
      id: user._id,
    },
  });
});
