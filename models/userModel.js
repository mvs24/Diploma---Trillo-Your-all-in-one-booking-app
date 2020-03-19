const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
    minlength: [2, "A user must have more than 2 characters"]
  },
  lastname: {
    type: String,
    required: [true, "A user must have a last name"],
    trim: true,
    minlength: [2, "A user must have more than 2 characters"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "A user must have an email"],
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email!"]
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: [6, "Password must be longer than 5 characters!"]
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: "Passwords are not the same!"
    }
  }
});

userSchema.methods.correctPassword = async function(
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  console.log(JWTTimestamp);
};

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
