require('express-async-errors'); // for error handling of express async errors for route handlers
const winston = require('winston'); // for error logging. Default is enough for small/med apps
require('winston-mongodb'); // MongoDB transport for winston
const config = require('config'); // for configuring env var
const Joi = require('@hapi/joi'); // for user input data validation
Joi.objectId = require('joi-objectid')(Joi); // only added once here to be used anywhere else
const express = require('express'); // for server
const app = express();

// All routes and middleware functions are in a separate file
require('./startup/routes')(app); // to pass the same app variable to routes.js

// MongoDB initialization/constructor
require('./startup/db')();

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

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR!');
  process.exit(1); // Exit with any value apart from 0 (zero)
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
