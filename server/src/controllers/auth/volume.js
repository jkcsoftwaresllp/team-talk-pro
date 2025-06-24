import { getChatVolume } from '../../services/auth/volumeService.js';

export const viewChannelVolumes = async (req, res) => {
  try {
    const data = await getChatVolume();
    res.json({ channels: data });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};
