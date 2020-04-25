const mongoose = require('mongoose');

const AppError = require('../utils/appError');
const Agency = require('./agencyModel');

const flightSchema = new mongoose.Schema({
    from: {
      type: String,
    },
    fromLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: {
          values: ['Point'],
          message: 'Type must be Point',
        },
      },
      coordinates: [Number],
      description: String,
    },
    toLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: {
          values: ['Point'],
          message: 'Type must be Point',
        },
      },
      coordinates: [Number],
      description: String,
    },
    to: {
      type: String,
    },
    depart: {
      type: Date,
      required: [true, 'A flight must have depart specified'],
    },
    returnDate: Date,
    ratingsAverage: {
      type: Number,
      default: 0.0,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    package: {
      type: String,
      enum: {
        values: ['Economic', 'First Class'],
        message: 'Package must be either Economic or First Class',
      },
    },
    pricePerPerson: {
      type: Number,
      required: [true, 'A flight must have price per Person specified'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.pricePerPerson;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Maximum group size must not be empty'],
    },
    variety: {
      type: String,
      enum: {
        values: ['Round-Trip', 'One-Way'],
        message: 'Package must be either Economic or First Class',
      },
    },
    time: String,
    agency: {
      type: mongoose.Schema.ObjectId,
      ref: 'Agency',
    },
    numBought: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// // Virtual populate
flightSchema.virtual('reviews', {
  ref: 'ReviewFlight',
  foreignField: 'flight',
  localField: '_id',
});

// flightSchema.virtual('bookings', {
//   ref: 'BookingFlight',
//   foreignField: 'flight',
//   localField: '_id'
// });

// flightSchema.virtual('wishlists', {
//   ref: 'WishlistFlight',
//   foreignField: 'flight',
//   localField: '_id'
// });

flightSchema.pre(/^findOne/, function (next) {
  this.populate('reviews');

  next();
});

const updateAgencyOnTour = async (Model, agencyId, type, next) => {
  const agency = await Model.findById(agencyId);

  if (!agency) return next(new AppError('Agency not found', 404));

  const currentNumOptions = agency.numOptions;
  const newNumOptions =
    type === 'create' ? currentNumOptions + 1 : currentNumOptions - 1;

  await Agency.findByIdAndUpdate(agencyId, { numOptions: newNumOptions });
};

flightSchema.post('save', async function (doc, next) {
  await updateAgencyOnTour(Agency, doc.agency, 'create', next);

  next();
});

flightSchema.post(/^findOneAndDelete/, async function (doc, next) {
  await updateAgencyOnTour(Agency, doc.agency, 'delete', next);

  next();
});

flightSchema.pre('save', function (next) {
  if (this.variety !== 'Round-Trip') {
    this.returnDate = undefined;
  } else {
    if (!this.returnDate) {
      return next(new AppError('Please specify a return date', 400));
    }
    if (this.returnDate.getTime() <= this.depart.getTime()) {
      return next(
        new AppError('Please control the depart and return dates', 400)
      );
    }
  }

  next();
});

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
