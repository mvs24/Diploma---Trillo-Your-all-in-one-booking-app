const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");
const asyncWrapper = require("../utils/asyncWrapper");

exports.getAll = Model =>
  asyncWrapper(async (req, res, next) => {
    const features = new ApiFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .select()
      .paginate();

    const docs = await features.query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs
    });
  });

exports.getOne = Model =>
  asyncWrapper(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return new AppError("This document does not exists", 404);
    }

    res.status(200).json({
      status: "success",
      data: doc
    });
  });

exports.deleteOne = Model =>
  asyncWrapper(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError("Document does not exists", 404));

    res.status(204).json({
      status: "success"
    });
  });

exports.createOne = Model =>
  asyncWrapper(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc
    });
  });
