import { db } from '../config/db.js';
import fs from 'fs';
import path from 'path';

// 1. Get all users
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, role, is_online FROM users');
    res.json({ users: rows });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// 2. Ban user
export const banUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User banned/deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to ban user', error: err.message });
  }
};

// 3. Get chat volume by channel
export const getChannelStats = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id AS chat_id, c.name, COUNT(m.id) AS message_count
      FROM chats c
      LEFT JOIN messages m ON c.id = m.chat_id
      GROUP BY c.id, c.name
    `);
    res.json({ stats: rows });
  } catch (err) {
    res.status(500).json({ message: 'Error getting stats', error: err.message });
  }
};

// 4. Delete message by ID
export const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM messages WHERE id = ?', [id]);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete message', error: err.message });
  }
};

// 5. Delete uploaded file
export const deleteFile = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join('uploads', filename);

  try {
    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting file', error: err.message });
  }
};
