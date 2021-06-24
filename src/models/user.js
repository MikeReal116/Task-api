const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) throw new Error('Age should be positive');
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('Enter a valid email');
    }
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minLength: 7,
    validate(value) {
      if (value.includes('password'))
        throw new Error("password can't contain 'password'");
    }
  }
});

module.exports = User;
