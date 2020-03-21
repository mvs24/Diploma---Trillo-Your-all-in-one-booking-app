const express = require("express");

const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const setAgencyId = require("../globalMiddlewares/setAgencyId");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("agencyCreator"),
    setAgencyId,
    tourController.createTour
  );

module.exports = router;
