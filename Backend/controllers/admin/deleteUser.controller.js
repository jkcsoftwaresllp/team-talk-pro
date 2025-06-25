import { db } from '../../config/db.js';

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user failed:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
