import { createChannel } from '../../services/auth/channelService.js';

export const handleCreateChannel = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id; // from auth middleware
    const channel = await createChannel({ name, description, created_by: userId });
    res.status(201).json({ msg: 'Channel created', channel });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
export const listChannelsHandler = async (req, res) => {
  try {
    const channels = await getAllChannels();
    res.json(channels);
  } catch (err) {
    console.error('Error listing channels:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};