import { db } from '../../config/db.js';

export const banUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const [result] = await db.query(
      'UPDATE users SET banned = TRUE WHERE id = ?',
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User banned successfully' });
  } catch (err) {
    console.error('Ban user failed:', err);
    res.status(500).json({ error: 'Failed to ban user' });
  }
};
