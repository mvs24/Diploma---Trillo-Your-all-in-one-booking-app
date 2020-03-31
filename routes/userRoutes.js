const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const bookingTourController = require('../controllers/bookingTourController');

const router = express.Router();

router.get(
  '/loggedInUser',
  authController.protect,
  authController.getLoggedInUser
);
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router
  .route('/')
  .get(
    authController.protect,
    // authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .delete(userController.deleteAllUsers);

router
  .route('/:id')
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

router.get(
  '/my-bookings',
  authController.protect,
  authController.restrictTo('user'),
  bookingTourController.getMyBookings
);

module.exports = router;
