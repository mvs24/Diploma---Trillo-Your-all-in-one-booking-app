const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An agency must have a name'],
      minlength: [2, 'Name must be at least 2 characters'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'An agency must have a description'],
      minlength: [10, 'Description must be at least 10 characters'],
    },
    category: {
      type: String,
      required: [true, 'An agency must be part of a category'],
      enum: {
        values: ['flights', 'tours', 'hotels'],
        message: 'Category must be either: flights or tours',
      },
    },
    image: String,
    ratingsAverage: {
      type: Number,
      default: 0.0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    numOptions: {
      type: Number,
      default: 0,
    },
    numOptionsBought: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

agencySchema.virtual('tours', {
  ref: 'Tour',
  foreignField: 'agency',
  localField: '_id',
});

agencySchema.virtual('flights', {
  ref: 'Flight',
  foreignField: 'agency',
  localField: '_id',
});

agencySchema.pre(/^findOne/, function (next) {
  this.populate('tours').populate('flights');

  next();
});

agencySchema.pre(/^find/, function (next) {
  this.select('-__v').find({ active: true });

  next();
});

const Agency = mongoose.model('Agency', agencySchema);

module.exports = Agency;
