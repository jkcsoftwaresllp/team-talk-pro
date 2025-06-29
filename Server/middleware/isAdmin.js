// middleware/isAdmin.js
import { db } from '../config/db.js';

export const isAdmin = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [req.user]);
    if (rows.length === 0 || rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
