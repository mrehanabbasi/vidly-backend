const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const Rental = mongoose.model(
  'Rental',
  mongoose.Schema({
    customer: {
      type: mongoose.Schema({
        // using only primary properties of customer
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 20,
        },
      }),
      required: true,
    },
    movie: {
      type: mongoose.Schema({
        // used custom schema as only a few movie properties required
        title: {
          type: String,
          required: true,
          trim: true,
          minlenght: 5,
          maxlength: 255,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });
  return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;
