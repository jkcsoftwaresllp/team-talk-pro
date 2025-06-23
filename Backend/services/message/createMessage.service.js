import { db } from '../../config/db.js';

export const createMessage = async ({ chatId, senderId, content, type = 'text', replyTo = null, forwardedFrom = null }) => {
  const [result] = await db.query(
    `INSERT INTO messages (chat_id, sender_id, content, type, reply_to, forwarded_from)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [chatId, senderId, content, type, replyTo, forwardedFrom]
  );

  const [rows] = await db.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);
  return rows[0];
};
