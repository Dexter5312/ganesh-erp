import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Foolproof presentation fallback: ALWAYS allow admin/password123
  if (username === 'admin' && password === 'password123') {
    return res.json({ message: 'Login successful', username: 'admin', role: 'admin' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Direct string comparison for B.Tech project presentation
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
