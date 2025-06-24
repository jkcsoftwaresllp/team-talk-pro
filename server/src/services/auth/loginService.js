import db from '../../configs/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginUser = async ({ email, password }) => {
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) throw new Error('Invalid email or password');

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  return { token, user: { id: user.id, name: user.name, email: user.email } };
};
