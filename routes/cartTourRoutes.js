const express = require('express');

const cartTourController = require('../controllers/cartTourController');
const setTourUserId = require('../globalMiddlewares/setTourUserId');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/:tourId')
  .post(authController.protect, setTourUserId, cartTourController.addToCart)
  .delete(authController.protect, cartTourController.removeFromCart);

router
  .route('/')
  .get(authController.protect, cartTourController.getToursForUser);

module.exports = router;
