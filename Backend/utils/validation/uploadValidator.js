
export function validateUpload(file, allowedTypes = [], maxSize = 5 * 1024 * 1024) {
  if (!file || typeof file !== 'object') {
    return { valid: false, message: 'No file provided.' };
  }

  const { mimetype, size, originalname } = file;

  if (!allowedTypes.includes(mimetype)) {
    return {
      valid: false,
      message: `Unsupported file type: ${mimetype}. Allowed: ${allowedTypes.join(', ')}`,
    };
  }

  if (size > maxSize) {
    const sizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      message: `File size exceeds limit. Max allowed is ${sizeMB}MB.`,
    };
  }

  const forbiddenExtensions = ['.exe', '.sh', '.bat', '.js', '.php', '.py'];
  const ext = path.extname(originalname).toLowerCase();

  if (forbiddenExtensions.includes(ext)) {
    return {
      valid: false,
      message: `Files with ${ext} extension are not allowed.`,
    };
  }

  return { valid: true };
}
