const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  // Not using arrow syntax as arrow functions do not have their own 'this' keyword
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin }, // Payload
    config.get('jwtPrivateKey')
  );
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(), // plain text password sent by user
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
