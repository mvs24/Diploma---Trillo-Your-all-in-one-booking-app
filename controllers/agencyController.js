const Agency = require("../models/agencyModel");
const AppError = require("../utils/appError");
const asyncWrapper = require("../utils/asyncWrapper");
const factory = require("./factoryHandler");
const filterObj = require("../utils/filterObj");

exports.getAllAgencies = factory.getAll(Agency);
exports.createAgency = factory.createOne(Agency);
exports.deleteAgency = factory.deleteOne(Agency);
exports.getAgency = factory.getOne(Agency);

exports.updateAgency = asyncWrapper(async (req, res, next) => {
  const filteredObj = filterObj(
    req.body,
    "category",
    "ratingsAverage",
    "ratingsQuantity",
    "numOptions",
    "numOptionsBought",
    "user"
  );

  const updatedAgency = await Agency.findByIdAndUpdate(
    req.params.id,
    filteredObj,
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedAgency) return next(new AppError("Agency does not exists", 404));

  res.status(200).json({
    status: "success",
    data: updatedAgency
  });
});
