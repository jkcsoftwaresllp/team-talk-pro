export const getProfile = (req, res) => {
  try {
    // `req.user` is populated by the auth middleware
    const { id, email, username, role } = req.user;

    res.status(200).json({
      success: true,
      user: { id, email, username, role }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: err.message
    });
  }
};
