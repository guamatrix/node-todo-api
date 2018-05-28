const { MongoClient, ObjectID } = require('mongodb');

(async () => {
  try {
    const connect = await MongoClient.connect('mongodb://localhost:27017/TodoApp');
    
    const db = connect.db('TodoApp');

    const todo = await db.collection('Todos').findOneAndUpdate({
      _id: new ObjectID('5b0c4de54a884a0a70f63cb3')
    }, {
      $set : { completed: false }
    }, {
      returnOriginal: false
    });
    
    console.log(JSON.stringify(todo, undefined, 2));

  } catch (error) {
    console.log('Error ocurred: ',error);
  }
})();