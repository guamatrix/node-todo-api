const _ = require('lodash');

const { User } = require('../models/user');
const Errors = require('../models/errors');

module.exports = app => {
  app.post('/users', async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    try {
      const response = await user.save();
      const token = await user.generateAuthToken();
      if (response && token) {
        return res.status(200).header('x-auth', token).send({ user: response });
      }
      res.status(400).send(new Errors(response));
    } catch (error) {
      res.status(403).send(new Errors(error));    
    }
  });

  
}