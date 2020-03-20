const Agency = require("../models/agencyModel");
const AppError = require("../utils/appError");
const asyncWrapper = require("../utils/asyncWrapper");
const ApiFeatures = require("../utils/apiFeatures");
const filterObj = require("../utils/filterObj");

exports.getAllAgencies = asyncWrapper(async (req, res, next) => {
  const features = new ApiFeatures(Agency.find(), req.query)
    .filter()
    .sort()
    .select()
    .paginate();

  const agencies = await features.query;

  res.status(200).json({
    status: "success",
    results: agencies.length,
    data: agencies
  });
});

exports.createAgency = asyncWrapper(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const agency = await Agency.create(req.body);

  res.status(201).json({
    status: "success",
    data: agency
  });
});

exports.updateAgency = asyncWrapper(async (req, res, next) => {
  const agency = await Agency.findById(req.params.id);

  // TODO CREATE A MIDDLEWARE FOR THIS
  if (req.user.id.toString() !== agency.user.toString()) {
    return next(new AppError("You can not update this agency!", 400));
  }

  const filteredObj = filterObj(req.body, "category");

  const updatedAgency = await Agency.findByIdAndUpdate(
    req.params.id,
    filteredObj
  );

  res.status(200).json({
    status: "success",
    data: updatedAgency
  });
});
