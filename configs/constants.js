const developementDbUrl = 'mongodb://localhost:27017/bitfilmsdb';

const developementSecretKey = 'dev_secret';

const errors = {
  authorizationNeeded: 'Необходима авторизация',
  wrongCredentials: 'Неправильные почта или пароль',
  wrongEmail: 'Адрес почтового ящика содержит ошибки, попробуйте снова',
  wrongLink: 'Ссылка содержит ошибки, попробуйте снова',
  serverError: 'На сервере произошла ошибка',
  wrongReqError: 'Введены некорректные данные',
  filmNotFound: 'Такого фильма нет',
  userNotFound: 'Нет пользователя с таким id',
  forbiddenError: 'У вас нет прав для этого действия',
  duplicateEmailError: 'Пользователь с таким адресом электронной почты уже зарегистрирован',
};

module.exports = {
  developementDbUrl,
  developementSecretKey,
  errors,
};
