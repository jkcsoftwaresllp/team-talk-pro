import { db } from '../../config/db.js';

export const getMessagesByChatId = async (chatId, page = 1, pageSize = 20) => {
  const offset = (page - 1) * pageSize;
  const [rows] = await db.query(
    'SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [chatId, pageSize, offset]
  );
  return rows;
};
