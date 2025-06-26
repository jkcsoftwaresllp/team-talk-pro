import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';  // Fixed import

export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ message: 'Access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const dbPool = pool();  // Call as function
        const [users] = await dbPool.execute(
            'SELECT id, username, email, role FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = users[0];
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
