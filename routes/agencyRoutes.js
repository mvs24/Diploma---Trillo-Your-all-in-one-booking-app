const express = require('express');

const Agency = require('../models/agencyModel');
const agencyController = require('../controllers/agencyController');
const authController = require('../controllers/authController');
const tourRouter = require('./tourRoutes');
const flightRouter = require('./flightRoutes');
const controlCreator = require('../globalMiddlewares/controlCreator');
const setUser = require('../globalMiddlewares/setUser');
const filterBody = require('../globalMiddlewares/filterBody');
const fileUpload = require('../globalMiddlewares/file-upload-agencies');

const router = express.Router();

router.use('/:agencyId/tours', tourRouter);
router.use('/:agencyId/flights', flightRouter);

router.get('/category-stats', agencyController.getAgencyStatistics);
router.get('/most-popular', agencyController.getMostPopularAgencies);

router
  .route('/')
  .get(agencyController.getAllAgencies)
  .post(
    fileUpload.single('image'),
    authController.protect,
    setUser,
    (req, res, next) => {
      if (req.file) {
        req.body.image = req.file.location;
      }
      next();
    },
    agencyController.createAgency
  );

router
  .route('/:id')
  .get(agencyController.getAgency)
  .patch(
    fileUpload.single('image'),
    authController.protect,
    authController.restrictTo('agencyCreator', 'user'),
    controlCreator(Agency),
    (req, res, next) => {
      if (req.file) {
        req.body.image = req.file.location;
      }
      next();
    },
    filterBody([
      'category',
      'ratingsAverage',
      'ratingsQuantity',
      'numOptions',
      'numOptionsBought',
      'user',
    ]),
    agencyController.updateAgency
  )
  .delete(
    authController.protect,
    authController.restrictTo('agencyCreator', 'admin'),
    controlCreator(Agency),
    agencyController.deleteAgency
  );

module.exports = router;
