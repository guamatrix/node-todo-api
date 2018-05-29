const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const id = '5b0d6902999d6f39f8e0f501';

Todo.find({
  _id: id
}).then(todos => {
  // return array or []
  console.log('Todos', todos);
});

Todo.findOne({
  _id: id
}).then(todo => {
  // return object or null
  console.log('Todos', todo);
});

Todo.findById(id)
  .then(todo => console.log('todo by id ', todo))
  .catch(err => {
    console.log(err);
  });

User.findById('5b0c6a52111d5d26e8c0b8a2')
  .then(user => {
    if (user) {
      return console.log('user: ', user);
    }
    console.log('user not fund');
  })
  .catch(err => {
    if (!ObjectID.isValid('5b0c6a52111d5d26e8c0b8a2')) {
      return console.log('ID invalida');
    }
    console.log(err);
  });
