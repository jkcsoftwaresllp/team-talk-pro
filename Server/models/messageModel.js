import { db } from '../config/db.js';

export const saveMessage = async ({ chat_id, sender_id, content, message_type, file_url, reply_to_id, forwarded_from_id }) => {
  const [result] = await db.query(
    `INSERT INTO messages (chat_id, sender_id, content, message_type, file_url, reply_to_id, forwarded_from_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [chat_id, sender_id, content, message_type || 'text', file_url || null, reply_to_id || null, forwarded_from_id || null]
  );
  return {
    id: result.insertId,
    chat_id,
    sender_id,
    content,
    message_type,
    file_url,
    reply_to_id,
    forwarded_from_id,
    created_at: new Date(),
  };
};

export const updateMessageStatus = async (message_id, status) => {
  await db.query(`UPDATE messages SET status = ? WHERE id = ?`, [status, message_id]);
};
