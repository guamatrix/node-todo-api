const { MongoClient, ObjectID } = require('mongodb');

(async () => {
  try {
    const connect = await MongoClient.connect('mongodb://localhost:27017/TodoApp');
    
    const db = connect.db('TodoApp');

    const todos = await db.collection('Todos').findOneAndDelete({
      text: 'Eat breakfast',
      completed: true
    });
    console.log(todos);
    console.log(JSON.stringify(todos, undefined, 2));

  } catch (error) {
    console.log('Error ocurred: ',error);
  }
})();
