import { db } from '../../config/db.js';

export const updateMessage = async (id, userId, content) => {
  const [result] = await db.query(
    'UPDATE messages SET content = ? WHERE id = ? AND sender_id = ?',
    [content, id, userId]
  );
  return result.affectedRows > 0;
};
