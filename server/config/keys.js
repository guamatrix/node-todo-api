const env = process.env.NODE_ENV || 'development';

if (env === 'production') {
  module.exports = require('./prod');
} else if (env === 'test') {
  module.exports = require('./test');
} else {
  module.exports = require('./dev');
}