import { updateMessage } from '../../services/message/updateMessage.service.js';

export const editMessage = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const updated = await updateMessage(id, userId, content);
    if (!updated) {
      return res.status(403).json({ error: 'You can only edit your own messages' });
    }
    res.json({ message: 'Message updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update message' });
  }
};
