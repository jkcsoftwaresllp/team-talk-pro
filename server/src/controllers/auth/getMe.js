export const getMe = async (req, res) => {
  try {
    res.status(200).json({ message: 'Protected user route', user: req.user });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
