const { MongoClient, ObjectID } = require('mongodb');

(async () => {
  try {
    const connect = await MongoClient.connect('mongodb://localhost:27017/TodoApp');
    
    const db = connect.db('TodoApp');

    // const todos = await db.collection('Todos').find({
    //   _id: new ObjectID('5b0c4379f9a8450a7006e110')
    // }).toArray();

    const todos = await db.collection('Todos').find().toArray();


    console.log(JSON.stringify(todos, undefined, 2));

  } catch (error) {
    console.log('Error ocurred: ',error);
  }
})();
