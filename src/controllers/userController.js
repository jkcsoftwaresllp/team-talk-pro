import pool from '../config/db.js';

const getUserProfile = async (req, res, next) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    avatar: req.user.avatar
  });
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { username, avatar } = req.body;
    await pool.query(
      'UPDATE users SET username = ?, avatar = ? WHERE id = ?',
      [username, avatar, req.user.id]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
};

export { getUserProfile, updateUserProfile };