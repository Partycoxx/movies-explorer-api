const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

router.get('/', getMovies);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .regex(/https?:\/\/[\w.\-[\]+().~:/?#@!$&'*,;=]+/)
        .required(),
      trailer: Joi.string()
        .regex(/https?:\/\/[\w.\-[\]+().~:/?#@!$&'*,;=]+/)
        .required(),
      thumbnail: Joi.string()
        .regex(/https?:\/\/[\w.\-[\]+().~:/?#@!$&'*,;=]+/)
        .required(),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().alphanum().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = router;
