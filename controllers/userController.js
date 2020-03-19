const User = require("../models/userModel");
const asyncWrapper = require("../utils/asyncWrapper");

exports.getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: users
  });
});

exports.deleteAllUsers = asyncWrapper(async (req, res, next) => {
  await User.deleteMany();

  res.status(204).json({
    status: "success"
  });
});

exports.deleteUser = asyncWrapper(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success"
  });
});
