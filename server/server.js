const express = require('express');
const bodyParser = require('body-parser');

const keys = require('./config/keys');

const app = express();

app.use(bodyParser.json());

require('./routes/todosRoutes')(app);
require('./routes/usersRoutes')(app);

app.listen(keys.PORT, () => {
  console.log(`Started on port ${keys.PORT}`);
});

module.exports = { app };
