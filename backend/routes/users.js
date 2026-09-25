import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const newUser = new User({ username, password, role });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: { username, role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk create users
router.post('/bulk', async (req, res) => {
  const { users } = req.body;
  if (!users || !Array.isArray(users)) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  let added = 0;
  let skipped = 0;

  try {
    for (const u of users) {
      const existingUser = await User.findOne({ username: u.username });
      if (!existingUser) {
        const newUser = new User({ username: u.username, password: u.password, role: u.role || 'worker' });
        await newUser.save();
        added++;
      } else {
        skipped++;
      }
    }
    res.status(201).json({ message: `Bulk import complete. Added: ${added}, Skipped: ${skipped}` });
  } catch (error) {
    res.status(500).json({ message: 'Server error during bulk import' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
