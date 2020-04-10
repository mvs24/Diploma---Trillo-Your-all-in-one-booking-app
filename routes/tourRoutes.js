const express = require('express');

const Tour = require('../models/tourModel');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewTourRouter = require('../routes/reviewTourRoutes');
const setAgencyUserId = require('../globalMiddlewares/setAgencyUserId');
const controlTourCreator = require('../globalMiddlewares/controlTourCreator');
const filterBody = require('../globalMiddlewares/filterBody');
const fileUpload = require('../globalMiddlewares/file-upload-tours');
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
    fileUpload.single('imageCover'),
    authController.protect,
    authController.restrictTo('agencyCreator', 'user'),
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
    fileUpload.array('image', 3),
    authController.protect,
    authController.restrictTo('admin', 'agencyCreator', 'user'),
    // controlTourCreator(Tour),
    filterBody(['user', 'agency', 'ratingsAverage', 'ratingsQuantity']),
    (req, res, next) => {
      let images = [];
      if (req.files) {
        req.files.forEach((file) => {
          images.push(file.path);
        });
      }
      req.body.images = images;
      next();
    },
    // tourController.resizeTourImages,
    async (req, res, next) => {
      console.log(req.body);
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json({
        status: 'success',
        data: tour,
      });
    }
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
