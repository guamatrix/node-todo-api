const mongoose = require('mongoose');

const { Schema } = mongoose;

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
    },
    _creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  })
);

module.exports = { Todo };
