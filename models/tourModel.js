const mongoose = require('mongoose');
// const slugify = require('slugify');

const AppError = require('../utils/appError');
const Agency = require('./agencyModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [6, 'A tour name must have more or equal then 6 characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 0.0,
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    agency: {
      type: mongoose.Schema.ObjectId,
      ref: 'Agency'
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    numBought: {
      type: Number,
      default: 0
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// tourSchema.index({ price: 1, ratingsAverage: -1 });
// tourSchema.index({ slug: 1 });
// tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// // Virtual populate
// tourSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'tour',
//   localField: '_id'
// });

tourSchema.pre(/^find/, function(next) {
  this.populate({ path: 'guides', select: 'name lastname photo' });

  next();
});

const updateAgencyOnTour = async (Model, agencyId, type, next) => {
  // NEEDS TO BE CONTROLLED IN PRE SAVE TO CALL NEXT
  const agency = await Model.findById(agencyId);

  if (!agency) return next(new AppError('Agency not found', 404));

  const currentNumOptions = agency.numOptions;
  const newNumOptions =
    type === 'create' ? currentNumOptions + 1 : currentNumOptions - 1;

  await Agency.findByIdAndUpdate(
    agencyId,
    { numOptions: newNumOptions },
    { new: true, runValidators: true }
  );
};

tourSchema.post('save', async function(doc, next) {
  await updateAgencyOnTour(Agency, doc.agency, 'create', next);

  next();
});

tourSchema.pre(/^findOneAndDelete/, async function(next) {
  this.tour = await this.findOne();

  next();
});

tourSchema.post(/^findOneAndDelete/, async function(next) {
  await updateAgencyOnTour(Agency, this.tour.agency, 'delete', next);

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
