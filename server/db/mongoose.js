const mongoose = require('mongoose');

const { Schema } = mongoose;
// const URL_DB = 'mongodb://localhost:27017/TodoApp';
const URL_DB = 'mongodb://guamatrix:guamatrix@ds137740.mlab.com:37740/todo-dev-db';

mongoose.connect(URL_DB).then(resp => {
  console.log('Connectd db');
}).catch(err => {
  console.log('error: ', err);
});

module.exports = { mongoose };
