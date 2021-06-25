const express = require('express');
const User = require('../models/user');

const router = new express.Router();

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    user.tokens = user.tokens.concat({ token });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.checkLoginCredential(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    user.tokens = user.tokens.concat({ token });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send();
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/users/:id', async (req, res) => {
  const id = req.params.id;
  const fields = ['name', 'email', 'password', 'age'];
  const updateKeys = Object.keys(req.body);
  const isValid = updateKeys.every((key) => fields.includes(key));

  if (!isValid) return res.status(400).send({ error: 'Invalid updates' });

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send();
    updateKeys.forEach((item) => (user[item] = req.body[item]));
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
