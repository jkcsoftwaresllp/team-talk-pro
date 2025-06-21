import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../configs/db.js'; 

export const register = async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'Missing fields' });

  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length > 0) return res.status(409).json({ msg: 'Email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  await db.query('INSERT INTO users (email, password, username) VALUES (?, ?, ?)', [email, hashed, username]);

  res.status(201).json({ msg: 'User registered' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) return res.status(404).json({ msg: 'Invalid credentials' });

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(403).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // true in production with https
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ msg: 'Logged in', user: { id: user.id, username: user.username } });
};

export const getMe = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query('SELECT id, email, username FROM users WHERE id = ?', [decoded.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(403).json({ msg: 'Invalid token' });
  }
};
