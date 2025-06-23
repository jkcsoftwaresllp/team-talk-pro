import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { uploadFileMessage } from '../controllers/message/uploadFile.controller.js';

const router = Router();

// Route: POST /api/upload/file
router.post('/file', authMiddleware, upload.single('file'), uploadFileMessage);

export default router;
