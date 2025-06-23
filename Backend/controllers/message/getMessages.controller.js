import { getMessagesByChatId } from '../../services/message/getMessagesByChatId.service.js';

export const getMessagesByChat = async (req, res) => {
  const { chatId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = 20;

  try {
    const messages = await getMessagesByChatId(chatId, page, pageSize);
    res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
