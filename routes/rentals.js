const auth = require('../middleware/auth');
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const Fawn = require('fawn'); // for transactions in MongoDB
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid Customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid Movie.');

  if (movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock.');

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
      // Date will have default value of current date (Date.now)
    },
  });
  // rental = await rental.save();

  // movie.numberInStock--;
  // movie.save();

  // We will be using the below transaction instead of above three lines to ensure
  // that complete operation only takes place when all operations are performed.
  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update(
        'movies',
        { _id: movies._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send('Something failed.');
  }
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('Rental with given id is not found');

  res.send(rental);
});

module.exports = router;
