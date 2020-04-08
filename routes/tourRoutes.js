const express = require('express');

const Tour = require('../models/tourModel');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewTourRouter = require('../routes/reviewTourRoutes');
const setAgencyUserId = require('../globalMiddlewares/setAgencyUserId');
const controlTourCreator = require('../globalMiddlewares/controlTourCreator');
const filterBody = require('../globalMiddlewares/filterBody');
const controlCategory = require('../globalMiddlewares/controlCategory');

const router = express.Router({ mergeParams: true });

router.use('/:tourId/reviews', reviewTourRouter);
router.route('/finishedTours').get(tourController.getFinishedTours);
router.route('/mostPopular').get(tourController.getMostPopularTours);
router.route('/top-five').get(tourController.getTopFiveTours);
router.route('/:tourId/review-stats').get(tourController.getReviewStats);

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('agencyCreator'),
    setAgencyUserId,
    controlCategory('tours'),
    tourController.createTour
  )

  .get(tourController.getAllTours); //get all future tour / get all future tours for specific agency
router.get('/search', tourController.searchForTours);

router
  .route('/:id')
  .get(tourController.getTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'agencyCreator'),
    controlTourCreator(Tour),
    tourController.deleteTour
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'agencyCreator'),
    controlTourCreator(Tour),
    filterBody(['user', 'agency', 'ratingsAverage', 'ratingsQuantity']),
    tourController.updateTour
  );

router.get('/tour-stats', tourController.getTourStatistics); //konflikt me :id //////////
router.get('/find/category', tourController.getByCategory);
router.get(
  '/tours-within/:distance/center/:latlng/unit/:unit',
  tourController.getToursWithin
);

router.post(
  '/:id/price-discount',
  authController.protect,
  controlTourCreator(Tour),
  tourController.discountTour
);

module.exports = router;
