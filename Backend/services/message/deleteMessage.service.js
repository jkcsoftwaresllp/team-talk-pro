import { db } from '../../config/db.js';

export const deleteMessage = async (id, userId) => {
  const [result] = await db.query(
    'DELETE FROM messages WHERE id = ? AND sender_id = ?',
    [id, userId]
  );
  return result.affectedRows > 0;
};
