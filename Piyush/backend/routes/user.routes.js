import express, { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
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
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
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

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

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

// Create test users for nunu and nabin
router.post('/create-test-users', async (req, res) => {
  try {
    const testUsers = [
      { username: 'nunu', email: 'nunu@example.com', password: 'password123' },
      { username: 'nabin', email: 'nabin@example.com', password: 'password123' },
      { username: 'alice', email: 'alice@example.com', password: 'password123' },
      { username: 'bob', email: 'bob@example.com', password: 'password123' }
    ];
    
    const createdUsers = [];
    
    for (const user of testUsers) {
      try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await userModel.createUser({ 
          username: user.username, 
          email: user.email, 
          password: hashedPassword 
        });
        createdUsers.push(user.username);
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error;
        }
        console.log(`User ${user.username} already exists, skipping...`);
      }
    }
    
    res.status(201).json({ 
      message: 'Test users created successfully',
      created: createdUsers
    });
  } catch (error) {
    console.error('Error creating test users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
