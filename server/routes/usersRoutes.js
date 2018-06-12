const _ = require('lodash');
const validations = require('../utils/validations');

const { User } = require('../models/user');
const Errors = require('../models/errors');
const { authenticated } = require('../middleware/authenticated');

module.exports = app => {
  app.post('/users', async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    try {
      const response = await user.save();
      const token = await user.generateAuthToken();
      if (response && token) {
        return res
          .status(200)
          .header('x-auth', token)
          .send({ user: response });
      }
      res.status(400).send(new Errors(response));
    } catch (error) {
      res.status(400).send(new Errors(error));
    }
  });

  app.get('/users/me', authenticated, (req, res) => {
    res.status(200).send(req.user);
  });

  app.post('/users/login', async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    try {
      
      // @ts-ignore
      const user = await User.findByEmailAndPassword(body);
      const token = await user.generateAuthToken();

      if (user && token) {
        return res
          .status(200)
          .header('x-auth', token)
          .send({ user });
      }
      res.status(400).send(new Errors(user));
    } catch (error) {
      res.status(400).send(new Errors(error));
    }
  });

  app.post('/users/me/change-password', authenticated, async (req, res) => {
    const bodyRequired = ['oldPassword', 'newPassword', 'confirmPassword'];
    const body = _.pick(req.body, bodyRequired );
    const requiredArray = validations.bodyRequired(bodyRequired, body);
    
    if (requiredArray.hasError){
      return res.status(400).send({ errors: requiredArray.error });
    }

    try {
      const user = await req.user.changeCredentials(body);
      res.status(200).send();
    } catch (error) {
      res.status(400).send(new Errors(error));
    }
  });

  app.delete('/users/me/token', authenticated, async (req, res) => {
    try {
      await req.user.removeToken(req.token);
      res.status(200).send();
    } catch (error) {
      res.status(400).send(new Errors(error));
    }
  });
};
