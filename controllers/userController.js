const User = require('../models/userModel');
const factory = require('./factoryHandler');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/appError');

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

exports.updateMe = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;

  console.log(req);
  if (req.file) {
    req.body.photo = req.file.path;
  }
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) return next(new AppError('User does not exists', 404));

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});
