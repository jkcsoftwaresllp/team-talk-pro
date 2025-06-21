import { db } from '../../config/db.js';

export const seedGroupMembers = async () => {
  const members = [
    [1, 2], // user 1 in group 2
    [2, 2],
    [3, 2]
  ];

  await db.query('DELETE FROM group_members');
  await db.query('ALTER TABLE group_members AUTO_INCREMENT = 1');
  await db.query(
    'INSERT INTO group_members (user_id, chat_id) VALUES ?',
    [members]
  );

  console.log('✅ Seeded group members');
};
