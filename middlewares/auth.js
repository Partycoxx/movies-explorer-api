const jwt = require('jsonwebtoken');
const WrongAuthError = require('../errors/wrong-auth-err');
const { developementSecretKey, errors } = require('../configs/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new WrongAuthError(errors.authorizationNeeded);
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : developementSecretKey);
  } catch (err) {
    throw new WrongAuthError(errors.authorizationNeeded);
  }

  req.user = payload;

  next();
};
