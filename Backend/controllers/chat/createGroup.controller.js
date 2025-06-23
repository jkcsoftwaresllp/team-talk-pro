import { createGroupChat } from '../../services/chat/createGroup.service.js';

export const createGroupController = async (req, res) => {
  const { name, members } = req.body;
  const creatorId = req.user.id;

  if (!name || !Array.isArray(members) || members.length < 1) {
    return res.status(400).json({ error: 'Group name and members are required' });
  }

  try {
    const group = await createGroupChat({ name, members, creatorId });
    res.status(201).json({ message: 'Group created', group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Group creation failed' });
  }
};
