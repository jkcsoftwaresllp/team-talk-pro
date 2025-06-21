import { db } from '../../config/db.js';
import bcrypt from 'bcrypt';

export const seedUsers = async () => {
  const password = await bcrypt.hash('secret123', 10);

  const users = [
    ['alice@example.com', password, 'Alice', 'user'],
    ['bob@example.com', password, 'Bob', 'admin'],
    ['carol@example.com', password, 'Carol', 'user']
  ];

  await db.query('DELETE FROM users');
  await db.query('ALTER TABLE users AUTO_INCREMENT = 1');
  await db.query(
    'INSERT INTO users (email, password, username, role) VALUES ?',
    [users]
  );

  console.log('✅ Seeded users');
};
