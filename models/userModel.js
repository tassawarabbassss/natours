const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User must have a name'],
    trim: true,
    maxLength: [40, "A user's name must have more or equal to 40 characters"],
    minLength: [1, "A user's name must have les or equal then 1 characters"]
  },
  email: {
    type: String,
    required: [true, 'A User must have a Email'],
    unique: true,
    trim: true,
    maxLength: [60, "A user's email must have more or equal to 60 characters"],
    minLength: [5, "A user's name must have les or equal then 5 characters"],
    lowercase: true,
    validate: [validator.isEmail, 'Email Address is']
  },
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
      message: 'User is either: user, guide, lead-guide,admin'
    },
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a Password'],
    minLength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your Password'],
    validate: {
      //This Only Works on Create and SAVE!!!
      validator: function(el) {
        return el === this.password; // abc === abc it will return true
      },
      message: 'Passwords are not Same!'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  // Only run this statement if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwrodConfirm field
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function(next) {
  // 3) Update changedPasswordAt property for the current user    authController ==> resetPassword Function's Step 3
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  this.find({
    active: { $ne: false }
  });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changesPasswordAfter = function(JWTTimestamp) {
  // If anytime user has changed the password
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }

  // False means password is not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  //console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
