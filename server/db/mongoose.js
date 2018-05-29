const mongoose = require('mongoose');

const { Schema } = mongoose;

const URL_DB = process.env.MONGODB_URI;

mongoose.connect(URL_DB).then(resp => {
  // console.log('Connectd db');
}).catch(err => {
  console.log('error: ', err);
});

module.exports = { mongoose };
