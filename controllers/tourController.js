const Tour = require("../models/tourModel");
const Agency = require("../models/agencyModel");
const factory = require("./factoryHandler");
const asyncWrapper = require("../utils/asyncWrapper");

// /agencies/:agencyId/tours
exports.createTour = async (req, res, next) => {
  try {
    const doc = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc
    });
  } catch (err) {
    const agency = await Agency.findById(req.body.agency);
    const numOptions = agency.numOptions;

    await Agency.findByIdAndUpdate(
      req.body.agency,
      { numOptions: numOptions - 1 },
      { new: true, runValidators: true }
    );
    res.status(400).json({
      status: "fail",
      message: "Something went wrong"
    });
  }
};
