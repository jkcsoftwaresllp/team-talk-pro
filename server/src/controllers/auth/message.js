import { sendMessage, getMessagesByChannel } from '../../services/auth/messageServices.js';

export const sendMessageHandler = async (req, res) => {
  try {
    const { channel_id, content, file_url } = req.body;
    const sender_id = req.user?.id || 1; // Replace `1` with real auth logic

    if (!channel_id || !content) {
      return res.status(400).json({ message: 'channel_id and content are required' });
    }

    const message = await sendMessage({ channel_id, sender_id, content, file_url });
    res.status(201).json(message);
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMessagesHandler = async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await getMessagesByChannel(channelId);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
