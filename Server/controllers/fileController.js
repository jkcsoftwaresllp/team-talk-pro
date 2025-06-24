export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File type not supported' });

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
      message: 'File uploaded successfully',
      file_url: fileUrl,
      filename: req.file.originalname
    });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};
