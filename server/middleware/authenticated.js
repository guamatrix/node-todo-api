const { User } = require('../models/user');
const Errors = require('../models/errors');

const authenticated = async (req, res, next) => {
  const token = req.header('x-auth');
  try {
    // @ts-ignore
    const user = await User.findByToken(token);
    if (user) {
      req.user = user;
      req.token = token;
      return next();
    }
    res.status(403).send(new Errors({ message: 'Forbidden' }));
  } catch (error) {
    res.status(401).send(new Errors(error));      
  }
}

module.exports = { authenticated };
