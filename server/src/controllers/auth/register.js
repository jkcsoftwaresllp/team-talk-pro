// register.js
import { createUser } from '../../services/auth/registerService.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ msg: 'All fields required' });

  try {
    const userId = await createUser({ name, email, password });
    res.status(201).json({ msg: 'User registered', userId });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ msg: 'Registration failed' });
  }
};
