import { db } from '../../config/db.js';

export const getChatVolumeStats = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        chats.id AS chat_id,
        chats.name AS chat_name,
        chats.is_group,
        COUNT(messages.id) AS total_messages
      FROM chats
      LEFT JOIN messages ON chats.id = messages.chat_id
      GROUP BY chats.id
      ORDER BY total_messages DESC
    `);

    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error('Chat stats error:', err);
    res.status(500).json({ error: 'Failed to fetch chat stats' });
  }
};
