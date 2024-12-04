// server.js
const express = require('express');
const app = express();

// Middleware function for logging
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();  // Move to next middleware or route handler
});

// Example route
app.get('/', (req, res) => {
  res.send('Home page');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
