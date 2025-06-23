import { db } from '../../config/db.js';

export const getMessageById = async (id) => {
  const [rows] = await db.query('SELECT * FROM messages WHERE id = ?', [id]);
  return rows[0];
};
