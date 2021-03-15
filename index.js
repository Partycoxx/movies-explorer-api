require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { isCelebrateError } = require('celebrate');
const path = require('path');
const userRouter = require('./routes/userRouter.js');
const movieRouter = require('./routes/movieRouter');
const loginRouter = require('./routes/loginRouter.js');
const signupRouter = require('./routes/signupRouter.js');

const WrongReqError = require('./errors/wrong-req-err');

const { PORT = 3000 } = process.env;
const auth = require('./middlewares/auth');

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/signin', loginRouter);
app.use('/signup', signupRouter);

app.use(auth);

app.use('/users', userRouter);
app.use('/movies', movieRouter);

app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    const errorBody = err.details.get('body');
    const errorParams = err.details.get('params');
    if (!errorBody) {
      const {
        details: [errorDetails],
      } = errorParams;
      throw new WrongReqError(errorDetails.message);
    } else {
      const {
        details: [errorDetails],
      } = errorBody;
      throw new WrongReqError(errorDetails.message);
    }
  }
  return next(err);
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT);
