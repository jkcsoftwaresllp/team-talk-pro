import { createMessage } from '../../services/message/createMessage.service.js';

export const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const senderId = req.user.id;

  if (!chatId || !content) {
    return res.status(400).json({ error: 'chatId and content are required' });
  }

  try {
    const message = await createMessage({ chatId, senderId, content });
    res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};
