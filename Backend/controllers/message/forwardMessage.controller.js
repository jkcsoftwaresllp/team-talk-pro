import { createMessage } from '../../services/message/createMessage.service.js';
import { getMessageById } from '../../services/message/getMessageById.service.js';

export const forwardMessage = async (req, res) => {
  const { originalMessageId, targetChatId } = req.body;
  const senderId = req.user.id;

  if (!originalMessageId || !targetChatId) {
    return res.status(400).json({ error: 'originalMessageId and targetChatId are required' });
  }

  try {
    const original = await getMessageById(originalMessageId);
    if (!original) {
      return res.status(404).json({ error: 'Original message not found' });
    }

    const forwardedContent = `[Forwarded] ${original.content}`;

    const message = await createMessage({
      chatId: targetChatId,
      senderId,
      content: forwardedContent,
      type: original.type,
      forwardedFrom: originalMessageId
    });

    res.status(201).json({ message: 'Message forwarded', data: message });
  } catch (err) {
    console.error('Forward message error:', err);
    res.status(500).json({ error: 'Failed to forward message' });
  }
};
