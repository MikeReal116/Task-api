const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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
    minLength: 6,
    validate(value) {
      if (value.includes('password'))
        throw new Error("password can't contain 'password'");
    }
  }
});

const Task = mongoose.model('Task', {
  description: {
    type: String
  },
  completed: {
    type: Boolean
  }
});

const me = new User({
  name: 'Kwaku',
  age: 27,
  email: 'MIKE@mike.io',
  password: 'pass123word123'
});
me.save()
  .then((data) => console.log(data))
  .catch((error) => console.log(error.message));

// const task = new Task({
//   description: 'Go to the gym',
//   completed: false
// });
// task
//   .save()
//   .then((task) => console.log(task))
//   .catch((error) => console.log(error));
