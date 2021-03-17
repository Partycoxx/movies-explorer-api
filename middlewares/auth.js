const jwt = require('jsonwebtoken');
const WrongAuthError = require('../errors/wrong-auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new WrongAuthError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new WrongAuthError('Необходима авторизация');
  }

  req.user = payload;

  next();
};