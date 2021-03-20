const corsOptions = {
  origin: [
    'https://www.locomotive.students.nomoredomains.monster/',
    'http://www.locomotive.students.nomoredomains.monster/',
    'https://locomotive.students.nomoredomains.monster/',
    'http://locomotive.students.nomoredomains.monster/',
    'http://localhost:3000',
    'https://localhost:3000',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = corsOptions;
