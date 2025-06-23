import { db } from '../../config/db.js';

export const createGroupChat = async ({ name, members, creatorId }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [chatResult] = await conn.query(
      'INSERT INTO chats (name, is_group, created_by) VALUES (?, TRUE, ?)',
      [name, creatorId]
    );
    const chatId = chatResult.insertId;

    const values = [[chatId, creatorId, 'admin'], ...members.map(uid => [chatId, uid, 'member'])];
    await conn.query(
      'INSERT INTO group_members (chat_id, user_id, role) VALUES ?',
      [values]
    );

    await conn.commit();

    return { id: chatId, name, members: [creatorId, ...members] };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
