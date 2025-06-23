import { db } from '../../config/db.js';

export const getMessageReactions = async (req, res) => {
  const { messageId } = req.params;

  if (!messageId) {
    return res.status(400).json({ error: 'Message ID is required' });
  }

  try {
    const [rows] = await db.query(
      `SELECT mr.id, mr.emoji, mr.reacted_at, u.id as user_id, u.username, u.avatar
       FROM message_reactions mr
       JOIN users u ON mr.user_id = u.id
       WHERE mr.message_id = ?`,
      [messageId]
    );

    res.status(200).json({
      messageId,
      reactions: rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reactions' });
  }
};
