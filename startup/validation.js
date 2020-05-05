const Joi = require('@hapi/joi'); // for user input data validation

module.exports = function () {
  Joi.objectId = require('joi-objectid')(Joi); // only added once here to be used anywhere else
};
