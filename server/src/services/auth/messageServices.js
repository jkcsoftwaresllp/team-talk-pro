import db from '../../configs/db.js';

export const sendMessage = async ({ channel_id, sender_id, content, file_url }) => {
  const [result] = await db.query(
    'INSERT INTO messages (channel_id, sender_id, content, file_url) VALUES (?, ?, ?, ?)',
    [channel_id, sender_id, content, file_url]
  );
  return { id: result.insertId, channel_id, sender_id, content, file_url };
};

export const getMessagesByChannel = async (channel_id) => {
  const [rows] = await db.query(
    'SELECT m.*, u.username FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.channel_id = ? ORDER BY m.created_at ASC',
    [channel_id]
  );
  return rows;
};
