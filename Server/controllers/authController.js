import { db } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [userExists] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    if (userExists.length > 0) {
      return res.status(400).json({ message: 'Email or username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user.id);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    res.json({ message: 'Login successful',token, user: { id: user.id, username: user.username, avatar_url: user.avatar_url } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, avatar_url, role FROM users WHERE id = ?', [req.user]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const updateProfile = async (req, res) => {
  const { username, avatar_url } = req.body;

  try {
    await db.query(
      'UPDATE users SET username = ?, avatar_url = ? WHERE id = ?',
      [username, avatar_url, req.user]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};
export const toggleSound = async (req, res) => {
  const { enabled } = req.body;
  try {
    await db.query('UPDATE users SET sound_enabled = ? WHERE id = ?', [enabled, req.user]);
    res.json({ message: 'Sound setting updated', enabled });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update setting', error: err.message });
  }
};
