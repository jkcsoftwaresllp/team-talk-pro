import { db } from '../../config/db.js';

export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const [result] = await db.query('DELETE FROM messages WHERE id = ?', [messageId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Delete message failed:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
