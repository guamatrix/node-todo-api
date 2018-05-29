const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// Todo.remove({}); return a list result

Todo.findOneAndRemove({ _id: 'dsdfsdfsd'}); // return the doc removed
Todo.findByIdAndRemove('sdfsdfsd'); // return the doc removed