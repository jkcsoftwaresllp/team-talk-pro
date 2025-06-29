import { db } from '../config/db.js';

// Create Group Chat
export const createGroupChat = async (req, res) => {
  const { name, memberIds } = req.body;
  const userId = req.user;

  try {
    const [result] = await db.query(
      'INSERT INTO chats (name, type, created_by) VALUES (?, ?, ?)',
      [name, 'group', userId]
    );
    const chatId = result.insertId;

    // Add creator as admin
    await db.query('INSERT INTO chat_members (chat_id, user_id, role) VALUES (?, ?, ?)', [
      chatId,
      userId,
      'admin'
    ]);

    // Add members
    for (const id of memberIds) {
      if (id !== userId) {
        await db.query('INSERT INTO chat_members (chat_id, user_id) VALUES (?, ?)', [chatId, id]);
      }
    }

    res.status(201).json({ message: 'Group created', chatId });
  } catch (err) {
    res.status(500).json({ message: 'Group creation failed', error: err.message });
  }
};

// Start 1-on-1 Chat
export const startPrivateChat = async (req, res) => {
  const { targetUserId } = req.body;
  const userId = req.user;

  try {
    // Check if direct chat already exists
    const [rows] = await db.query(`
      SELECT c.id FROM chats c
      JOIN chat_members cm1 ON cm1.chat_id = c.id AND cm1.user_id = ?
      JOIN chat_members cm2 ON cm2.chat_id = c.id AND cm2.user_id = ?
      WHERE c.type = 'direct'`, [userId, targetUserId]);

    if (rows.length > 0) {
      return res.json({ chatId: rows[0].id });
    }

    const [result] = await db.query('INSERT INTO chats (type, created_by) VALUES (?, ?)', ['direct', userId]);
    const chatId = result.insertId;

    await db.query('INSERT INTO chat_members (chat_id, user_id) VALUES (?, ?), (?, ?)', [
      chatId, userId,
      chatId, targetUserId
    ]);

    res.status(201).json({ chatId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to start private chat', error: err.message });
  }
};
