const express = require('express');

const authController = require('../controllers/authController');
const wishlistFlightController = require('../controllers/wishlistFlightController');
const setFlightUserId = require('../globalMiddlewares/setFlightUserId');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protect,
    setFlightUserId,
    wishlistFlightController.addToWishlist
  );

router
  .route('/')
  .get(authController.protect, wishlistFlightController.getFlightsForUser);

module.exports = router;
