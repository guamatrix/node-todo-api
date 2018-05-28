// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server :', err);
  }

  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unabled to insert to do', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Jhon Doe',
  //   age: 24,
  //   location: 'Argentina, Buenos Aires'
  // }).then(resp => {
  //   console.log(JSON.stringify(resp.ops));
  // }).catch(err => {
  //   console.log('Unable to insert user', err);
  // });

  client.close();
});
