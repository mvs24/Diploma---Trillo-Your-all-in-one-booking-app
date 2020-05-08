const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const bookingTourController = require('../controllers/bookingTourController');
const reviewTourController = require('../controllers/reviewTourController');
const reviewFlightController = require('../controllers/reviewFlightController');
const filterBody = require('../globalMiddlewares/filterBody');
const fileUpload = require('../globalMiddlewares/file-upload');
const router = express.Router();

router.route('/contact-us').post(userController.contactMe)

router.get(
  '/loggedInUser',
  authController.protect,
  authController.getLoggedInUser
);
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.post(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .delete(userController.deleteAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

router.patch(
  '/updateMe',
  fileUpload.single('photo'),
  authController.protect,
  userController.updateMe
);

router.get(
  '/my/bookings',
  authController.protect,
  bookingTourController.getMyBookings
);

router.get(
  '/my/reviews/flights',
  authController.protect,
  reviewFlightController.getMyReviews
);

router.get(
  '/my/reviews',
  authController.protect,
  reviewTourController.getMyReviews
);

router.get(
  '/my/notifications',
  authController.protect,
  userController.getMyNotifications
);

router.get('/my/agency', authController.protect, userController.getMyAgency);

router.get(
  '/my/unReadNotifications',
  authController.protect,
  userController.getUnReadNotifications
);
router.patch(
  '/notifications/:notificationId/markAsRead',
  authController.protect,
  userController.markNotificationAsRead
);
router.get(
  '/notifications/markAsRead',
  authController.protect,
  userController.markNotificationsAsRead
);

module.exports = router;
