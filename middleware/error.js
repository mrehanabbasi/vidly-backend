module.exports = function (err, req, res, next) {
  // Logging exception
  res.status(500).send('Something failed.');
};
