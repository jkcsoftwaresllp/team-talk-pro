import db from '../../configs/db.js';

export const createChannel = async ({ name, description, created_by }) => {
  const [result] = await db.query(
    'INSERT INTO chat_channels (name, description, created_by) VALUES (?, ?, ?)',
    [name, description, created_by]
  );
  return { id: result.insertId, name, description, created_by };
};
export const getAllChannels = async () => {
  const [rows] = await db.query('SELECT * FROM chat_channels');
  return rows;
};