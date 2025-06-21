import { register, login } from '../services/authService.js';

const registerUser = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const userId = await register(email, password, username);
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await login(email, password);
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 });
    res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err);
  }
};

export { registerUser, loginUser };