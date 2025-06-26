import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:chatId', authenticateToken, async (req, res) => {
    try {
        const { chatId } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        
        const dbPool = pool();
        const [messages] = await dbPool.execute(`
            SELECT m.*, u.username, u.avatar_url,
                   rm.content as reply_content, ru.username as reply_username
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            LEFT JOIN messages rm ON m.reply_to_id = rm.id
            LEFT JOIN users ru ON rm.sender_id = ru.id
            WHERE m.chat_id = ?
            ORDER BY m.created_at DESC
            LIMIT ? OFFSET ?
        `, [chatId, parseInt(limit), parseInt(offset)]);

        res.json({ messages: messages.reverse() });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/', authenticateToken, async (req, res) => {
    try {
        const { chatId, content, messageType = 'text', replyToId = null } = req.body;
        const userId = req.user.id;
        const dbPool = pool();

        const [result] = await dbPool.execute(
            'INSERT INTO messages (chat_id, sender_id, content, message_type, reply_to_id) VALUES (?, ?, ?, ?, ?)',
            [chatId, userId, content, messageType, replyToId]
        );

        const [messages] = await dbPool.execute(`
            SELECT m.*, u.username, u.avatar_url,
                   rm.content as reply_content, ru.username as reply_username
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            LEFT JOIN messages rm ON m.reply_to_id = rm.id
            LEFT JOIN users ru ON rm.sender_id = ru.id
            WHERE m.id = ?
        `, [result.insertId]);

        res.status(201).json({ 
            message: 'Message sent successfully', 
            data: messages[0] 
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/:messageId/reactions', authenticateToken, async (req, res) => {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body;
        const userId = req.user.id;
        const dbPool = pool();

        await dbPool.execute(
            'INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE emoji = VALUES(emoji)',
            [messageId, userId, emoji]
        );

        res.json({ message: 'Reaction added successfully' });
    } catch (error) {
        console.error('Add reaction error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/test', (req, res) => {
    res.json({ message: 'Messages route working' });
});

export default router;
