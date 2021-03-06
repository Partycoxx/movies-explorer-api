const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { developementSecretKey, errors } = require('../configs/constants');
const NotFoundError = require('../errors/not-found-err');
const WrongReqError = require('../errors/wrong-req-err');
const DuplicateEmailError = require('../errors/duplicate-email-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, email, password: hash })
      .then(({ name, email }) => res.send({ name, email }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new WrongReqError(err.message);
        } else if (err.code === 11000) {
          throw new DuplicateEmailError(errors.duplicateEmailError);
        }
      })
      .catch(next);
  });
};

module.exports.getUser = (req, res, next) => {
  const { _id: id } = req.user;
  User.findById(id)
    .orFail(() => {
      throw new NotFoundError(errors.userNotFound);
    })
    .exec()
    .then(({ name, email }) => res.send({ name, email }))
    .catch(next);
};

module.exports.updateUserData = (req, res, next) => {
  const { _id: id } = req.user;
  const { name, email } = req.body;
  return User.isEmailUnique(email, id)
    .then(() => {
      User.findByIdAndUpdate(
        id,
        { name, email },
        {
          new: true,
          runValidators: true,
          upsert: true,
        },
      )
        .then(({ name, email }) => res.send({ name, email }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new WrongReqError(errors.wrongReqError);
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : developementSecretKey, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};
