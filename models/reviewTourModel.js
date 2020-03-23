const mongoose = require('mongoose');

const Tour = require('./tourModel');

const reviewTourSchema = new mongoose.Schema(
  {
    review: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have a rating']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour'
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewTourSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewTourSchema.statics.calcRatingsOnTour = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating
  });
};

reviewTourSchema.post('save', async function(doc, next) {
  await doc.constructor.calcRatingsOnTour(doc.tour);

  const tour = await Tour.findById(doc.tour);

  // const toursOnAgency = await Tour.find({ agency: tour.agency });

  const toursOnAgency = await Tour.aggregate([
    {
      $match: { agency: tour.agency }
    },
    {
      $group: {
        _id: '$agency',
        avgRating: { $avg: '$ratingsAverage' },
        nRating: { $sum: 1 }
      }
    }
  ]);
  
  // TODO CONTROLLING SOME VALUES AND UPDATE AGENCY!!!!

  console.log(toursOnAgency, toursOnAgency.length);

  next();
});

const ReviewTour = mongoose.model('ReviewTour', reviewTourSchema);

module.exports = ReviewTour;
