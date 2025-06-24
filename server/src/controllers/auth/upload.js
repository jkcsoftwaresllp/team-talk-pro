export const uploadFile = async (req, res) => {
  try {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, fileUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
