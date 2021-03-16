const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUser, updateUserData } = require('../controllers/user');

router.get('/me', getUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUserData,
);

module.exports = router;
