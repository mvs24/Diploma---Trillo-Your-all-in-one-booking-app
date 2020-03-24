const express = require('express');

const wishlistTourController = require('../controllers/wishlistTourController');
const setTourUserId = require('../globalMiddlewares/setTourUserId');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/:tourId')
  .post(
    authController.protect,
    setTourUserId,
    wishlistTourController.addToWishlist
  );

router
  .route('/')
  .get(authController.protect, wishlistTourController.getToursForUser);

module.exports = router;
