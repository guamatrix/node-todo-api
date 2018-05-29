const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
// const { Todo } = require('./models/todo');
// const { User } = require('./models/user');
const keys = require('./config/keys');

const app = express();

app.use(bodyParser.json());

require('./routes/todosRoutes')(app);

app.listen(keys.PORT, () => {
  console.log(`Started on port ${keys.PORT}`);
});

module.exports = { app };
