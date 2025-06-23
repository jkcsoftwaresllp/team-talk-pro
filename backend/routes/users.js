import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all users
router.get('/', authenticateToken, async (req, res) => {
    try {
        const dbPool = pool();
        const [users] = await dbPool.execute(
            'SELECT id, username, email, avatar_url, is_online, last_seen FROM users'
        );
        res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const dbPool = pool();
        const [users] = await dbPool.execute(
            'SELECT id, username, email, avatar_url, is_online, last_seen FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user: users[0] });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { username, avatar_url } = req.body;
        const userId = req.user.id;
        
        const dbPool = pool();
        await dbPool.execute(
            'UPDATE users SET username = ?, avatar_url = ? WHERE id = ?',
            [username, avatar_url, userId]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Users route working' });
});

export default router;
