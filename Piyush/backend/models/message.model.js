import mysql_db from '../config/db.js';

const messageModel = {
  async createMessage({ sender_id, receiver_id, text, image }) {
    const db = await mysql_db();
    try {
      const [result] = await db.execute(
        `INSERT INTO messages (sender_id, receiver_id, text, image)
         VALUES (?, ?, ?, ?)`,
        [sender_id, receiver_id, text, image]
      );
      await db.end();
      return result.insertId;
    } catch (error) {
      await db.end();
      throw error;
    }
  },

  async getMessageHistory(sender_id, receiver_id) {
    const db = await mysql_db();
    try {
      const [rows] = await db.execute(
        `SELECT * FROM messages 
         WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
         ORDER BY created_at ASC`,
        [sender_id, receiver_id, receiver_id, sender_id]
      );
      await db.end();
      return rows;
    } catch (error) {
      await db.end();
      throw error;
    }
  }
};

export default messageModel;