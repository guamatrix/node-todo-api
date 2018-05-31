const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { Todo } = require('../models/todo');
const Errors = require('../models/errors');
const { objectIDverify } = require('../middleware/objectID');
const { authenticated } = require('../middleware/authenticated');

module.exports = app => {
  app.post('/todos', authenticated, async (req, res) => {
    try {
      const todo = new Todo({
        text: req.body.text,
        completed: req.body.completed || undefined,
        completedAt: req.body.completedAt || undefined,
        _creator: req.user._id
      });

      const result = await todo.save();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(new Error(error));
    }
  });

  app.get('/todos', authenticated, async (req, res) => {
    try {
      const todos = await Todo.find({
        _creator: req.user._id
      });
      res.status(200).send({ todos });
    } catch (error) {
      res.status(400).send(new Error(error));
    }
  });

  app.get('/todos/:id', authenticated, objectIDverify, async (req, res) => {
    const { id } = req.params;

    try {
      const todo = await Todo.findOne({ _id: id, _creator: req.user._id });
      if (todo) {
        return res.status(200).send({ todo });
      }
      res.status(404).send({});
    } catch (error) {
      res.status(400).send(new Error(error));
    }
  });

  app.delete('/todos/:id', authenticated, objectIDverify, async (req, res) => {
    const { id } = req.params;

    try {
      const todoRemoved = await Todo.findOneAndRemove({ _id: id, _creator: req.user._id });
      if (todoRemoved) {
        return res.status(200).send({ todo: todoRemoved });
      }
      res.status(404).send();
    } catch (error) {
      res.status(400).send(new Error(error));
    }
  });

  app.patch('/todos/:id', authenticated, objectIDverify, async (req, res) => {
    const { id } = req.params;

    const body = _.pick(req.body, ['text', 'completed']);
    if (_.isBoolean(body.completed) && body.completed) {
      body['completedAt'] = new Date().getTime();
    } else {
      body.completed = false;
      body['completedAt'] = null;
    }
    try {
      const todoUpdated = await Todo.findOneAndUpdate(
        {
          _id: id,
          _creator: req.user._id
        },
        { $set: body },
        { new: true }
      );
      if (!todoUpdated) {
        return res.status(404).send();
      }
      res.status(200).send({ todo: todoUpdated });
    } catch (error) {
      res.status(400).send(new Error(error));
    }
  });
};
