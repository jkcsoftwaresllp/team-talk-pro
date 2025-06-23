import { db } from '../../config/db.js';

export const seedReactions = async () => {
  const reactions = [
    [1, 2, '👍'],
    [2, 1, '❤️']
  ];

  await db.query('DELETE FROM message_reactions');
  await db.query('ALTER TABLE message_reactions AUTO_INCREMENT = 1');
  await db.query(
    'INSERT INTO message_reactions (message_id, user_id, emoji) VALUES ?',
    [reactions]
  );

  console.log('✅ Seeded reactions');
};
