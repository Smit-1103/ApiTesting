const express = require('express');
const router = express.Router();
const { getUsers, saveUsers } = require('../utils/fileDB');
const authenticateToken = require('../middleware/auth');

router.get('/', (req, res) => {
  const users = getUsers();
  res.json(users);
});

router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string.' });
  }

  const users = getUsers();
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name: name.trim()
  };
  users.push(newUser);
  saveUsers(users);
  res.status(201).json(newUser);
});

router.put('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string.' });
  }

  user.name = name.trim();
  saveUsers(users);
  res.json({ message: 'User updated successfully', user });
});

router.delete('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

  users.splice(userIndex, 1);
  saveUsers(users);
  res.json({ message: 'User deleted successfully' });
});

// 👤 Example of a protected route under /users
router.get('/profile/info', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, this is protected.` });
});

module.exports = router;
