const _ = require('lodash');

const { User } = require('../models/user');

module.exports = app => {
  app.post('/users', async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    try {
      const response = await user.save();
      if (response) {
        return res.status(200).send({ user: response });
      }
      res.status(400).send({ error: response });
    } catch (error) {
      const errorResponse = error.message ? { error:  error.message } : error.stack;
      res.status(400).send(errorResponse);    
    }
  });

  
}