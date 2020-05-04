const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
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
  rental = await rental.save();

  movie.numberInStock--;
  movie.save();

  res.send(rental);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
    }
  );
  if (!rental) return res.status(404).send('Rental with given id is not found');

  res.send(rental);
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);

  if (!rental) return res.status(404).send('Rental with given id is not found');

  res.send(rental);
});

module.exports = router;
