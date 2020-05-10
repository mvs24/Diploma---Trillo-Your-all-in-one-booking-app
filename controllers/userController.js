const User = require('../models/userModel');
const factory = require('./factoryHandler');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/appError');
const Agency = require('../models/agencyModel');
const Email = require('../utils/email');

exports.getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});

exports.getUser = factory.getOne(User);

exports.deleteAllUsers = asyncWrapper(async (req, res, next) => {
  await User.deleteMany();

  res.status(204).json({
    status: 'success',
  });
});

exports.deleteUser = asyncWrapper(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
  });
});

exports.updateMe = async (req, res, next) => {
  // upload()
  const { id } = req.user;

  if (req.file) {
    req.body.photo = req.file.location;
  }
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) return next(new AppError('User does not exists', 404));

  res.status(200).json({
    status: 'success',
    data: updatedUser
  });
}

exports.getUnReadNotifications = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);

  const unReadNotifications = user.notifications.filter(
    (not) => not.read === false
  );

  res.status(200).json({
    status: 'success',
    results: unReadNotifications.length,
    unReadNotifications,
  });
});

exports.getMyNotifications = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findOne({ _id: id });

  const sortedNotifications = user.notifications;

  res.status(200).json({
    status: 'success',
    data: sortedNotifications,
  });
});

exports.markNotificationsAsRead = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  user.notifications.forEach((notification) => {
    notification.read = true;
  });

  await user.save();

  res.status(200).json({
    status: 'success',
    notifications: user.notifications,
  });
});

exports.markNotificationAsRead = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const notification = user.notifications.find(
    (notification) => notification._id.toString() === req.params.notificationId
  );
  notification.read = true;

  await user.save();

  res.status(200).json({
    status: 'success',
    notifications: user.notifications,
  });
});

exports.getMyAgency = asyncWrapper(async (req, res, next) => {
  const agency = await Agency.findOne({ user: req.user.id });

  if (!agency)
    return res.status(404).json({
      status: 'success',
      message: 'You do not have an agency! Start by creating one!',
    });

  res.status(200).json({
    status: 'success',
    data: agency,
  });
});

exports.contactMe = asyncWrapper(async (req, res, next) => {
  try {
    let user = {
      to: 'Marius Vasili',
      email: 'Marius.Vasili@fti.edu.al',
    };
    await new Email(user, null, req.body.email).contactUs(
      req.body.message + '   Email: ' + req.body.email
    );

    res.status(200).json({
      status: 'success',
      message: 'Email sent',
    });
  } catch (err) {
    return res.status(400).json({
      status: 'fail',
      message: 'Something went wrong sending email...',
    });
  }
});
