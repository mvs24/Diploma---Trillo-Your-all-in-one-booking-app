const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "An agency must have a name"],
    minlength: [2, "Name must be at least 2 characters"]
  },
  description: {
    type: String,
    required: [true, "An agency must have a description"],
    minlength: [10, "Name must be at least 10 characters"]
  },
  category: {
    type: String,
    enum: ["flights", "tours", "hotels"],
    required: [true, "An agency must be part of a category"]
  },
  image: String,
  ratingsAverage: {
    type: Number,
    default: 0.0
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  numOptions: Number,
  numOptionsBought: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
});

agencySchema.pre(/^find/, function(next) {
  this.select("-__v").find({ active: true });

  next();
});

const Agency = mongoose.model("Agency", agencySchema);

module.exports = Agency;
