const winston = require('winston');

module.exports = function (err, req, res, next) {
  // Logging exception (error, warn, info, verbose, debug and/or silly)
  winston.error(err.message, err);

  res.status(500).send('Something failed.');
};
