import { db } from '../../config/db.js';

export const getMessagesPaginated = async (req, res) => {
  const chatId = req.params.chatId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  try {
    // Count total messages for pagination meta
    const [[{ count }]] = await db.query(
      'SELECT COUNT(*) AS count FROM messages WHERE chat_id = ?',
      [chatId]
    );

    // Fetch messages with sender info
    const [messages] = await db.query(
      `SELECT m.*, u.username, u.avatar
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.chat_id = ?
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [chatId, limit, offset]
    );

    res.status(200).json({
      success: true,
      page,
      limit,
      totalMessages: count,
      messages
    });
  } catch (err) {
    console.error('❌ Error fetching paginated messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
