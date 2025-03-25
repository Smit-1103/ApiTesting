const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// -------------------
// 📁 FILE SYSTEM SETUP
// -------------------
const dataPath = path.join(__dirname, 'users.json');

// Utility: Read users from file
const getUsers = () => {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
};

// Utility: Save users to file
const saveUsers = (users) => {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
};

// Utility: Custom error
function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// -------------------
// ✅ ROUTES
// -------------------

// Main route
app.get('/', (req, res) => {
  res.send('Hello World! This is my first API.');
});

// GET all users
app.get('/users', (req, res) => {
  const users = getUsers(); // ✅ read from file
  res.json(users);
});

// GET a user by ID
app.get('/users/:id', (req, res, next) => {
  const userId = parseInt(req.params.id);
  const users = getUsers(); // ✅ read from file
  const user = users.find(u => u.id === userId);

  if (!user) {
    return next(createError(404, 'User not found'));
  }

  res.json(user);
});

// POST a new user
app.post('/users', (req, res, next) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return next(createError(400, 'Name is required and must be a non-empty string.'));
  }

  const users = getUsers(); // ✅ read from file

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name: name.trim()
  };

  users.push(newUser);
  saveUsers(users); // ✅ save to file

  res.status(201).json(newUser);
});

// PUT (update) a user
app.put('/users/:id', (req, res, next) => {
  const userId = parseInt(req.params.id);
  const users = getUsers(); // ✅ read from file
  const user = users.find(u => u.id === userId);

  if (!user) {
    return next(createError(404, 'User not found'));
  }

  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return next(createError(400, 'Name is required and must be a non-empty string.'));
  }

  user.name = name.trim();
  saveUsers(users); // ✅ save updated array

  res.json({ message: 'User updated successfully', user });
});

// DELETE a user
app.delete('/users/:id', (req, res, next) => {
  const userId = parseInt(req.params.id);
  const users = getUsers(); // ✅ read from file
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return next(createError(404, 'User not found'));
  }

  users.splice(userIndex, 1); // remove user
  saveUsers(users); // ✅ save updated array

  res.json({ message: 'User deleted successfully' });
});

// -------------------
// 🛑 Global Error Handler
// -------------------
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong.'
  });
});

// -------------------
// 🚀 Start the Server
// -------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
