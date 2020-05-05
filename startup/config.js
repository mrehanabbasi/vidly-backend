const config = require('config'); // for configuring environment variables

module.exports = function () {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR! jwtPrivateKey is not defined.');
  }
};
