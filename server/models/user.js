const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  }]
});

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
  user.tokens = user.tokens.concat([{ access, token }]);

  return user.save().then(() => token);
};

UserSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (error) {
    return Promise.reject({ message: 'Invalid token' });
  }
  
  return User.findOne({
    // @ts-ignore
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByEmailAndPassword = async function({ email, password }) {
  const User = this;
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return Promise.reject({ message: 'User not exist' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return Promise.reject({ message: 'Invalid credential' });
    }
    return user;
  } catch (error) {
    return Promise.reject(error);  
  }
};

UserSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user['password'], salt);
      user['password'] = hash;
      next();
    } catch (error) {
      next();
    }
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
