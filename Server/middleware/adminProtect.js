// middleware/adminProtect.js
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

export const adminProtect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [decoded.id]);

    if (!rows.length || rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};
