import { db } from '../../config/db.js';

export const seedChats = async () => {
  const chats = [
    ['General Chat', true, 2],    // group chat by user ID 2
    [null, false, 1]              // 1:1 chat
  ];

  await db.query('DELETE FROM chats');
  await db.query('ALTER TABLE chats AUTO_INCREMENT = 1');

  for (const chat of chats) {
    await db.query(
      'INSERT INTO chats (name, is_group, created_by) VALUES (?, ?, ?)',
      chat
    );
  }

  console.log('✅ Seeded chats');
};
