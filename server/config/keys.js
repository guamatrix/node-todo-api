const env = process.env.NODE_ENV || 'development';

if (env === 'production') {
  module.exports = require('./prod');
} else if (env === 'test') {
  module.exports = require('./enviroments/test');
} else {
  module.exports = require('./enviroments/dev');
}
