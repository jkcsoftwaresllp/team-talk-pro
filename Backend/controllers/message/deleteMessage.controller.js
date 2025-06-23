import { deleteMessage } from '../../services/message/deleteMessage.service.js';

export const deleteMessageController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deleted = await deleteMessage(id, userId);
    if (!deleted) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }
    res.json({ message: 'Message deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
