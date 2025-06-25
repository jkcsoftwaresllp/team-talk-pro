import express, { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import userModel from '../models/user.model.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('🚀 User route is working!');
});

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email').isLength({ min: 13 }),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 chars'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 chars'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid Data',
      });
    }

    const { username, email, password } = req.body;

    try {
      //Check if user already exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      //Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      //Save to DB
      await userModel.createUser({ username, email, password: hashedPassword });

      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 1. Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // 2. Find user by username (not email!)
    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // 4. Send response
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});



export default router;
