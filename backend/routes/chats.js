import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's chats
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const dbPool = pool();
        
        const [chats] = await dbPool.execute(`
            SELECT c.*, u.username as created_by_username
            FROM chats c
            JOIN chat_members cm ON c.id = cm.chat_id
            LEFT JOIN users u ON c.created_by = u.id
            WHERE cm.user_id = ?
            ORDER BY c.created_at DESC
        `, [userId]);

        res.json({ chats });
    } catch (error) {
        console.error('Get chats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new chat
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, type, members } = req.body;
        const userId = req.user.id;
        const dbPool = pool();

        // Create chat
        const [result] = await dbPool.execute(
            'INSERT INTO chats (name, type, created_by) VALUES (?, ?, ?)',
            [name, type, userId]
        );

        const chatId = result.insertId;

        // Add creator as admin
        await dbPool.execute(
            'INSERT INTO chat_members (chat_id, user_id, role) VALUES (?, ?, ?)',
            [chatId, userId, 'admin']
        );

        // Add other members
        if (members && members.length > 0) {
            for (const memberId of members) {
                await dbPool.execute(
                    'INSERT INTO chat_members (chat_id, user_id, role) VALUES (?, ?, ?)',
                    [chatId, memberId, 'member']
                );
            }
        }

        res.status(201).json({ 
            message: 'Chat created successfully', 
            chatId 
        });
    } catch (error) {
        console.error('Create chat error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get chat members
router.get('/:chatId/members', authenticateToken, async (req, res) => {
    try {
        const { chatId } = req.params;
        const dbPool = pool();
        
        const [members] = await dbPool.execute(`
            SELECT u.id, u.username, u.email, u.avatar_url, u.is_online, cm.role
            FROM chat_members cm
            JOIN users u ON cm.user_id = u.id
            WHERE cm.chat_id = ?
        `, [chatId]);

        res.json({ members });
    } catch (error) {
        console.error('Get chat members error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Chats route working' });
});

export default router;
