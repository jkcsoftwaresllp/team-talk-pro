import multer from 'multer';
import path from 'path';

// Allowed file extensions and MIME types
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.docx', '.xlsx', '.txt'];
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Backend/assets/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(mime)) {
    return cb(new Error(`Unsupported file type: ${ext} / ${mime}`), false);
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});
