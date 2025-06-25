import { db } from '../../config/db.js';

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};
