const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();

router.get(
  '/me',
  auth,
  asyncMiddleware(async (req, res) => {
    // Used 'me' for securoty reasons
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
  })
);

router.post(
  '/',
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already exists.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res
      .header('x-auth-token', token) // customer http headers are always prefixed with x-
      .send(_.pick(user, ['_id', 'name', 'email'])); // Don't want to send password back to client
  })
);

module.exports = router;
