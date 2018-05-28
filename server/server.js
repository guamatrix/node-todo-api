const mongoose = require('mongoose');

const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/TodoApp');

const Todo = mongoose.model(
  'Todo',
  new Schema({
    text: {
      type: String,
      required: true,
      minlength: 1,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Number,
      default: null
    }
  })
);

const User = mongoose.model(
  'User',
  new Schema({
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    }
  })
);

const newTodo = new Todo({
  text: 'buy food'
});

const newUser = new User({
  
});

newUser
  .save()
  .then(resp => console.log(resp))
  .catch(err => console.log('errorsiiiiiiiiiii: ', err));

newTodo
  .save()
  .then(doc => {
    console.log('saved todo', doc);
  })
  .catch(err => {
    console.log(err);
  });
