const winston = require('winston');
const mongoose = require('mongoose'); // for MongoDB

module.exports = function () {
  mongoose
    .connect('mongodb://localhost/vidly', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info('Connected to MongoDB...'));
};
