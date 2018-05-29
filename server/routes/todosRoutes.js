const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { Todo } = require('../models/todo');


module.exports = app => {
  app.post('/todos', async (req, res) => {
    try {
      const todo = new Todo({
        text: req.body.text,
        completed: req.body.completed || undefined,
        completedAt: req.body.completedAt || undefined
      });
    
      const result = await todo.save();
      res.status(200).send(result);
    } catch (error) {
      const errorResponse = error.errors ? { error:  error.message } : error.stack;
      res.status(400).send(errorResponse);
    }
  });

  app.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.status(200).send({ todos });
    } catch (error) {
      const errorResponse = error.errors ? { error:  error.message } : error.stack;
      res.status(400).send(errorResponse);    
    }
  });

  app.get('/todos/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    try {
      const todo = await Todo.findById(id);
      if (todo) {
        return res.status(200).send({ todo });
      }
      res.status(404).send({});
    } catch (error) {
      const errorResponse = error.errors ? { error:  error.message } : error.stack;
      res.status(400).send(errorResponse);    
    }
  });

  app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;

    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    try {
      const todoRemoved = await Todo.findByIdAndRemove(id);
      if (todoRemoved) {
        return res.status(200).send({ todo: todoRemoved });
      }
      res.status(404).send();
    } catch (error) {
      const errorResponse = error.errors ? { error:  error.message } : error.stack;
      res.status(400).send(errorResponse);        
    }
  });

  app.patch('/todos/:id', async (req, res) => {
    const { id } = req.params;

    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    const body = _.pick(req.body, ['text', 'completed']);
    if(_.isBoolean(body.completed) && body.completed) {
      body['completedAt'] = new Date().getTime();
    } else {
      body.completed = false;
      body['completedAt'] = null;
    }
    try {
      const todoUpdated = await Todo.findByIdAndUpdate(id, { $set: body }, { new: true });
      if (!todoUpdated) {
        return res.status(404).send();
      }
      res.status(200).send({ todo: todoUpdated });
    } catch (error) {
      const errorResponse = error.errors ? { error:  error.message } : error.stack;
      res.status(400).send(errorResponse);            
    }
  });
}