import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { secret } from '../config/jwt.js';

const auth = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, secret);
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    req.user = user[0];
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default auth;