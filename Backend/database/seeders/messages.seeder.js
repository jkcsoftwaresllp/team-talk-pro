import { db } from '../../config/db.js';

export const seedMessages = async () => {
  const messages = [
    [1, 1, 'Hello Alice!'],
    [2, 1, 'Hey Bob!'],
    [2, 2, 'Welcome to the group chat']
  ];

  await db.query('DELETE FROM messages');
  await db.query('ALTER TABLE messages AUTO_INCREMENT = 1');
  await db.query(
    'INSERT INTO messages (sender_id, chat_id, content) VALUES ?',
    [messages]
  );

  console.log('✅ Seeded messages');
};
