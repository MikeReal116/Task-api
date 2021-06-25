const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const { _id } = jwt.verify(token, 'mongodbposgresqlfirebase');
    const user = await User.findOne({ _id: _id, 'tokens.token': token });
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = auth;