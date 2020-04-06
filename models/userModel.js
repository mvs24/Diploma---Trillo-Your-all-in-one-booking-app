const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    minlength: [2, 'A user must have more than 2 characters'],
  },
  lastname: {
    type: String,
    required: [true, 'A user must have a last name'],
    trim: true,
    minlength: [2, 'A user must have more than 2 characters'],
  },
  photo: String,
  email: {
    type: String,
    unique: true,
    required: [true, 'A user must have an email'],
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [6, 'Password must be longer than 5 characters!'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide', 'agencyCreator'],
    default: 'user',
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
  },
  notifications: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      message: {
        type: String,
      },
      agency: {
        type: mongoose.Schema.ObjectId,
        ref: 'Agency',
      },
      tour: { type: mongoose.Schema.ObjectId, ref: 'Tour' },
      read: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
  ],
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < passwordTimestamp;
  }

  return false;
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
