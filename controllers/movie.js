const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const WrongReqError = require('../errors/wrong-req-err');
const ForbiddenError = require('../errors/forbidden-err');
const { errors } = require('../configs/constants');

module.exports.getMovies = (req, res, next) => {
  const { _id: userId } = req.user;
  Movie.find({
    owner: { _id: userId },
  })
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { _id } = req.user;
  Movie.create({ ...req.body, owner: _id })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new WrongReqError(errors.wrongReqError);
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const { _id: userId } = req.user;
  Movie.findOne({ movieId, owner: userId })
    .orFail(() => {
      throw new NotFoundError(errors.filmNotFound);
    })
    .then((movie) => {
      Movie.findByIdAndRemove(movie._id)
        .populate(['owner'])
        .then((deletedMovie) => res.send(deletedMovie))
        .catch(next);
    })
    .catch(next);
};
