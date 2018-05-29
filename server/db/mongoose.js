const mongoose = require('mongoose');

const { Schema } = mongoose;

const URL_DB = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost:27017/TodoApp';

mongoose.connect(URL_DB).then(resp => {
  // console.log('Connectd db');
}).catch(err => {
  console.log('error: ', err);
});

module.exports = { mongoose };
