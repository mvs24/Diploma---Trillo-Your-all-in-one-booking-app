const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .delete(userController.deleteAllUsers);

router.route("/:id").delete(userController.deleteUser);

module.exports = router;
