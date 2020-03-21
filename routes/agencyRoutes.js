const express = require("express");

const Agency = require("../models/agencyModel");
const agencyController = require("../controllers/agencyController");
const authController = require("../controllers/authController");
const tourRouter = require("./tourRoutes");
const controlCreator = require("../globalMiddlewares/controlCreator");
const setUser = require("../globalMiddlewares/setUser");

const router = express.Router();

router.use("/:agencyId/tours", tourRouter);

router
  .route("/")
  .get(agencyController.getAllAgencies)
  .post(
    authController.protect,
    authController.restrictTo("agencyCreator"),
    setUser,
    agencyController.createAgency
  );

router
  .route("/:id")
  .get(agencyController.getAgency)
  .patch(
    authController.protect,
    controlCreator(Agency),
    agencyController.updateAgency
  )
  .delete(
    authController.protect,
    authController.restrictTo("agencyCreator", "admin"),
    controlCreator(Agency),
    agencyController.deleteAgency
  );

module.exports = router;
