const express = require("express");

const agencyController = require("../controllers/agencyController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(agencyController.getAllAgencies)
  .post(
    authController.protect,
    authController.restrictTo("agencyCreator"),
    agencyController.createAgency
  );

router
  .route("/:id")
  .patch(authController.protect, agencyController.updateAgency);

module.exports = router;
