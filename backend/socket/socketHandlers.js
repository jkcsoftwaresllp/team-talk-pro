import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

const connectedUsers = new Map();

export default (io) => {
    
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const dbPool = pool();
            const [users] = await dbPool.execute(
                'SELECT id, username, email FROM users WHERE id = ?',
                [decoded.userId]
            );

            if (users.length === 0) {
                return next(new Error('Authentication error'));
            }

            socket.userId = users[0].id;
            socket.user = users[0];
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket) => {
        console.log(`User ${socket.user.username} connected`);
        
        // Store user connection
        connectedUsers.set(socket.userId, {
            socketId: socket.id,
            user: socket.user
        });

        // Update user online status
        const dbPool = pool();
        await dbPool.execute(
            'UPDATE users SET is_online = TRUE WHERE id = ?',
            [socket.userId]
        );

        // Join user to their chat rooms
        const [userChats] = await dbPool.execute(`
            SELECT c.id FROM chats c
            JOIN chat_members cm ON c.id = cm.chat_id
            WHERE cm.user_id = ?
        `, [socket.userId]);

        userChats.forEach(chat => {
            socket.join(`chat_${chat.id}`);
        });

        // Broadcast user online status
        socket.broadcast.emit('user_online', {
            userId: socket.userId,
            username: socket.user.username
        });

        // Handle new message
        socket.on('send_message', async (data) => {
            try {
                const { chatId, content, messageType = 'text', replyToId = null } = data;

                // Insert message into database
                const [result] = await dbPool.execute(`
                    INSERT INTO messages (chat_id, sender_id, content, message_type, reply_to_id)
                    VALUES (?, ?, ?, ?, ?)
                `, [chatId, socket.userId, content, messageType, replyToId]);

                // Get the complete message with sender info
                const [messages] = await dbPool.execute(`
                    SELECT m.*, u.username, u.avatar_url,
                           rm.content as reply_content, ru.username as reply_username
                    FROM messages m
                    JOIN users u ON m.sender_id = u.id
                    LEFT JOIN messages rm ON m.reply_to_id = rm.id
                    LEFT JOIN users ru ON rm.sender_id = ru.id
                    WHERE m.id = ?
                `, [result.insertId]);

                const message = messages[0];

                // Broadcast to all users in the chat
                io.to(`chat_${chatId}`).emit('new_message', message);
            } catch (error) {
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle typing indicators
        socket.on('typing_start', (data) => {
            socket.to(`chat_${data.chatId}`).emit('user_typing', {
                userId: socket.userId,
                username: socket.user.username,
                chatId: data.chatId
            });
        });

        socket.on('typing_stop', (data) => {
            socket.to(`chat_${data.chatId}`).emit('user_stop_typing', {
                userId: socket.userId,
                chatId: data.chatId
            });
        });

        // Handle disconnect
        socket.on('disconnect', async () => {
            console.log(`User ${socket.user.username} disconnected`);
            
            // Remove from connected users
            connectedUsers.delete(socket.userId);

            // Update user offline status
            await dbPool.execute(
                'UPDATE users SET is_online = FALSE, last_seen = NOW() WHERE id = ?',
                [socket.userId]
            );

            // Broadcast user offline status
            socket.broadcast.emit('user_offline', {
                userId: socket.userId,
                username: socket.user.username
            });
        });
    });

    console.log('Socket.IO handlers initialized');
};
