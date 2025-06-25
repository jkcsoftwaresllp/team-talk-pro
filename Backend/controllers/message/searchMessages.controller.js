import { db } from '../../config/db.js';

export const searchMessages = async (req, res) => {
  const { chatId, keyword } = req.query;

  if (!chatId || !keyword) {
    return res.status(400).json({ error: 'chatId and keyword are required' });
  }

  try {
    const [results] = await db.query(
      `SELECT * FROM messages 
       WHERE chat_id = ? AND content LIKE ? 
       ORDER BY created_at DESC`,
      [chatId, `%${keyword}%`]
    );

    res.status(200).json({ messages: results });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
