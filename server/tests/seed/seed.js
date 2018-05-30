const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const userIDOne = new ObjectID();
const userIDTwo = new ObjectID();
const todosDummy = [
  { text: 'First to do', _id: new ObjectID(), completed: false },
  { text: 'First to do 1', _id: new ObjectID(), completed: false },
  { text: 'First to do 2', _id: new ObjectID(), completed: false }
];

const usersDummy = [
  {
    _id: userIDOne,
    email: 'cada@cada.com',
    password: 'casapass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userIDOne, access: 'auth' }, 'abc123').toString()
      }
    ]
  },
  {
    _id: userIDTwo,
    email: 'cada2@cada.com',
    password: 'cada2cada2'
  }
];

const populateTodos = done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todosDummy);
    })
    .then(() => done());
};

const populateUser = done => {
  User.remove({})
    .then(() => {
      const userOne = new User(usersDummy[0]).save();
      const userTwo = new User(usersDummy[1]).save();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {
  todosDummy,
  populateTodos,
  usersDummy,
  populateUser
};
