const express = require('express');
const bodyParser = require('body-parser');

const keys = require('./config/keys');
require('./db/mongoose');

const app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth');
  res.header('Access-Control-Allow-Methods: GET, POST, PATCH');
  next();
}); 

require('./routes/todosRoutes')(app);
require('./routes/usersRoutes')(app);

app.listen(keys.PORT, () => {
  console.log(`Started on port ${keys.PORT}`);
});

module.exports = { app };
