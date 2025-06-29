import { db } from '../config/db.js';
import { getIO } from '../sockets/chatSocket.js';

export const replyToMessage = async (req, res) => {
  const { chat_id, sender_id, content, reply_to_id } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO messages (chat_id, sender_id, content, reply_to_id)
       VALUES (?, ?, ?, ?)`,
      [chat_id, sender_id, content, reply_to_id]
    );

    const [messageRows] = await db.query(
      `SELECT * FROM messages WHERE id = ?`,
      [result.insertId]
    );

    const io = getIO();
    io.to(chat_id).emit('receiveMessage', messageRows[0]);

    res.status(201).json({ message: messageRows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Reply failed', details: err.message });
  }
};

export const reactToMessage = async (req, res) => {
  const { message_id, user_id, emoji } = req.body;

  try {
    await db.query(
      `INSERT INTO message_reactions (message_id, user_id, emoji)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE emoji = VALUES(emoji)`,
      [message_id, user_id, emoji]
    );

    const io = getIO();
    io.to('chat_' + message_id).emit('messageReaction', {
      message_id,
      user_id,
      emoji
    });

    res.json({ message: 'Reaction saved' });
  } catch (err) {
    res.status(500).json({ error: 'Reaction failed', details: err.message });
  }
};

export const forwardMessage = async (req, res) => {
  const { original_message_id, new_chat_id, sender_id } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT content FROM messages WHERE id = ?`,
      [original_message_id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Original message not found' });
    }

    const content = rows[0].content;

    const [result] = await db.query(
      `INSERT INTO messages (chat_id, sender_id, content, forwarded_from_id)
       VALUES (?, ?, ?, ?)`,
      [new_chat_id, sender_id, content, original_message_id]
    );

    const [newMessage] = await db.query(`SELECT * FROM messages WHERE id = ?`, [result.insertId]);

    const io = getIO();
    io.to(new_chat_id).emit('receiveMessage', newMessage[0]);

    res.status(201).json({ message: newMessage[0] });
  } catch (err) {
    res.status(500).json({ error: 'Forward failed', details: err.message });
  }
};
