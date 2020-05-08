const winston = require('winston');
const express = require('express'); // for server
const app = express();

// Error handling
require('./startup/logging')();

// All routes and middleware functions are in a separate file
require('./startup/routes')(app); // to pass the same app variable to routes.js

// MongoDB initialization/constructor
require('./startup/db')();

// Config tokens
require('./startup/config')();

// User Input Data Validation
require('./startup/validation')();

// Production environment
require('./startup/prod')(app); // can also be conditionally loaded for prod env

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server; // to export to our test environment
