const mongoose = require('mongoose');

const keys = require('../config/keys');

const { Schema } = mongoose;

const URL_DB = keys.MONGODB_URI;

mongoose
  .connect(URL_DB)
  .then(resp => {
    // console.log('Connectd db');
  })
  .catch(err => {
    console.log('error: ', err);
  });

module.exports = { mongoose };
