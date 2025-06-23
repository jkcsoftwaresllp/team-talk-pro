import { db } from '../../config/db.js';

export const uploadFileMessage = async (req, res) => {
  try {
    const { chatId } = req.body;
    const userId = req.user.id;
    const file = req.file;

    if (!chatId || !file) {
      return res.status(400).json({ error: 'chatId and file are required' });
    }

    // Insert message
    const [msgResult] = await db.query(
      `INSERT INTO messages (chat_id, sender_id, type, content) VALUES (?, ?, 'file', ?)`,
      [chatId, userId, file.originalname]
    );

    const messageId = msgResult.insertId;

    // Insert file metadata
    await db.query(
      `INSERT INTO files (message_id, file_name, file_path, file_type, file_size) VALUES (?, ?, ?, ?, ?)`,
      [
        messageId,
        file.originalname,
        file.path,
        file.mimetype,
        file.size
      ]
    );

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: messageId,
        name: file.originalname,
        path: file.path,
        type: file.mimetype,
        size: file.size
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'File upload failed' });
  }
};
