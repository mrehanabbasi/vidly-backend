require('express-async-errors'); // for error handling of express async errors for route handlers
const winston = require('winston'); // for error logging. Default is enough for small/med apps
require('winston-mongodb'); // MongoDB transport for winston
const error = require('./middleware/error');
const config = require('config'); // for configuring env var
const Joi = require('@hapi/joi'); // for user input data validation
Joi.objectId = require('joi-objectid')(Joi); // only added once here to be used anywhere else
const mongoose = require('mongoose'); // for MongoDB
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express'); // for server
const app = express();

winston.exceptions.handle(
  new winston.transports.File({ filename: 'uncaughtExceptions.log' })
);

process.on('unhandledRejection', (ex) => {
  throw ex;
});

// Below code will be valid once winston.rejections becomes valid again
// and above code will have to be removed.
// winston.rejections.handle(
//   new winston.transports.File({ filename: 'unhandledRejections.log' })
// );

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(
  new winston.transports.MongoDB({
    db: 'mongodb://localhost/vidly',
    level: 'error',
  })
);

const p = Promise.reject(new Error('Something failed miserably'));
p.then(console.log('Done.'));

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR!');
  process.exit(1); // Exit with any value apart from 0 (zero)
}

mongoose
  .connect('mongodb://localhost/vidly', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

// This error handling middleware function should be used after all middleware functions
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
