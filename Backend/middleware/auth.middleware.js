import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized – Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: userId }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized – Invalid token' });
  }
};
