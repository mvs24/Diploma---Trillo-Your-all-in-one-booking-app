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
const multipleUpload = require('../globalMiddlewares/multipleUpload');

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
    multipleUpload.array('image', 3),
    authController.protect,
    authController.restrictTo('admin', 'agencyCreator', 'user'),
    filterBody(['user', 'agency', 'ratingsAverage', 'ratingsQuantity']),
    async (req, res, next) => {
      let images = [];
      if (req.files) {
        await Promise.all(
          req.files.map(async (file, i) => {
            const filename = file.location;

            // await sharp(file.buffer)
            //   .resize(2000, 1333)
            //   .toFormat('jpeg')
            //   .jpeg({ quality: 90 })
            //   .toFile(`${filename}`);

            images.push(filename);
          })
        );
        req.body.images = [...images];
      }

      next();
    },
    // async (req, res, next) => {
    //   let images = [];
    //   console.log(req.file)
    //   if (req.files) {
    //     console.log(req.files)
    //     // await Promise.all(
    //     //   req.files.map(async (file, i) => {
    //     //     console.log(file)
    //     //     const filename = file.location;

    //     //     // await sharp(file.buffer)
    //     //     //   .resize(2000, 1333)
    //     //     //   .toFormat('jpeg')
    //     //     //   .jpeg({ quality: 90 })
    //     //     //   .toFile(`${filename}`);

    //     //     images.push(filename);
    //     //   })
    //     // );
    //     // req.body.images = [...images];
    //   }

    //   next();
    // },
    async (req, res, next) => {
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
