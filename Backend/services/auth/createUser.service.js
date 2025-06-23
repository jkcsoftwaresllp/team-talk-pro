import { db } from '../../config/db.js';

export const createUser = async (email, password, username) => {
  await db.query(
    'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
    [email, password, username]
  );
};
