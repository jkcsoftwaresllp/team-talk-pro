import { db } from '../Server/config/db.js';
import { getIO } from '../sockets/chatSocket.js';

// Get paginated messages for a chat
export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await db.query(`
      SELECT m.id, m.chat_id, m.sender_id, u.username, u.avatar_url,
             m.content, m.message_type, m.file_url, m.reply_to_id, m.forwarded_from_id,
             m.created_at
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.chat_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?`,
      [chatId, limit, offset]
    );

    res.json({ messages: rows });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
};

// Search messages in a chat by keyword
export const searchMessages = async (req, res) => {
  const { chatId } = req.params;
  const keyword = req.query.q;

  try {
    const [rows] = await db.query(`
      SELECT m.id, m.chat_id, m.sender_id, u.username, u.avatar_url,
             m.content, m.message_type, m.file_url, m.reply_to_id, m.forwarded_from_id,
             m.created_at
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.chat_id = ? AND m.content LIKE ?
      ORDER BY m.created_at DESC`,
      [chatId, `%${keyword}%`]
    );

    res.json({ results: rows });
  } catch (err) {
    res.status(500).json({ message: 'Search error', error: err.message });
  }
};

// Delete message and broadcast to chat room
export const deleteMessage = async (req, res) => {
  const { message_id, chat_id } = req.body;

  try {
    await db.query('DELETE FROM messages WHERE id = ?', [message_id]);

    const io = getIO();
    io.to(chat_id).emit('messageDeleted', { message_id });

    res.json({ message: 'Message deleted and broadcasted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete message', error: err.message });
  }
};
