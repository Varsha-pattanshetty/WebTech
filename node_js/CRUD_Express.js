// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

let users = [];

// Create user
app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
});

// Read users
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

// Update user
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  users = users.map(user => user.id === id ? updatedUser : user);
  res.status(200).json(updatedUser);
});

// Delete user
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  users = users.filter(user => user.id !== id);
  res.status(200).send('User deleted');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
