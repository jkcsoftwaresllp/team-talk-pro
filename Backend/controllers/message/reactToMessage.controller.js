import { toggleReaction } from '../../services/message/toggleReaction.service.js';

export const reactToMessage = async (req, res) => {
  const { messageId } = req.params;
  const { emoji } = req.body;
  const userId = req.user.id;

  if (!emoji) {
    return res.status(400).json({ error: 'Emoji is required' });
  }

  try {
    const result = await toggleReaction({ messageId, userId, emoji });

    // Emit real-time update to all users in the chat
    const io = req.app.get('io');
    io.emit('message:reaction', {
      messageId,
      userId,
      emoji,
      action: result.added ? 'added' : 'removed'
    });

    res.status(200).json({ message: 'Reaction updated', data: result });
  } catch (err) {
    console.error('Emoji reaction failed:', err);
    res.status(500).json({ error: 'Failed to react to message' });
  }
};
