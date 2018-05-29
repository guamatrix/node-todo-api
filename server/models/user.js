const mongoose = require('mongoose');

const { Schema } = mongoose;

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

module.exports = { User };
