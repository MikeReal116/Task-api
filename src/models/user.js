const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
    unique: true,
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
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.statics.checkLoginCredential = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Unable to login');
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Unable to login');
  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id.toString() },
    'mongodbposgresqlfirebase'
  );
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
