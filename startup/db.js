const winston = require('winston');
const mongoose = require('mongoose'); // for MongoDB

module.exports = function () {
  mongoose
    .connect('mongodb://localhost/vidly', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => winston.info('Connected to MongoDB...'));
};
