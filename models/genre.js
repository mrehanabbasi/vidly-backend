const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(genre);
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validateGenre;
