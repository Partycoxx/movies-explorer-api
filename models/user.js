const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const WrongAuthError = require('../errors/wrong-auth-err');
const DuplicateEmailError = require('../errors/duplicate-email-err');
const { errors } = require('../configs/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Иван Иванов',
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: errors.wrongEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new WrongAuthError(errors.wrongCredentials));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new WrongAuthError(errors.wrongCredentials));
        }

        return user;
      });
    });
};

userSchema.statics.isEmailUnique = function (email, id) {
  return this.findOne({ email }).then((user) => {
    if (user && String(user._id) !== String(id)) {
      return Promise.reject(new DuplicateEmailError(errors.duplicateEmailError));
    }
    return Promise.resolve();
  });
};
module.exports = mongoose.model('user', userSchema);
