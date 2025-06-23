import { createMessage } from '../../services/message/createMessage.service.js';

export const sendReplyMessage = async (req, res) => {
  const { chatId, content, replyTo } = req.body;
  const senderId = req.user.id;

  if (!chatId || !content || !replyTo) {
    return res.status(400).json({ error: 'chatId, content, and replyTo are required' });
  }

  try {
    const message = await createMessage({
      chatId,
      senderId,
      content,
      type: 'text',
      replyTo
    });

    res.status(201).json({ message: 'Reply sent', data: message });
  } catch (err) {
    console.error('Error sending reply:', err);
    res.status(500).json({ error: 'Failed to send reply' });
  }
};
