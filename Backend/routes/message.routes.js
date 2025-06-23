import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getMessagesByChat } from '../controllers/message/getMessages.controller.js';
import { sendReplyMessage } from '../controllers/message/sendReplyMessage.controller.js';
import { forwardMessage } from '../controllers/message/forwardMessage.controller.js';
import { reactToMessage } from '../controllers/message/reactToMessage.controller.js';
import { getMessageReactions } from '../controllers/message/getReactions.controller.js';
import { uploadFileMessage } from '../controllers/message/uploadFile.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

// ✅ All routes below require authentication
router.use(authMiddleware);

// ✅ Fetch chat messages
router.get('/:chatId', getMessagesByChat);

// ✅ Send a reply message
router.post('/reply', sendReplyMessage);

// ✅ Forward a message
router.post('/forward', forwardMessage);

// ✅ React to a message
router.post('/:messageId/react', reactToMessage);

// ✅ Get all reactions on a message
router.get('/:messageId/reactions', getMessageReactions);

// ✅ Upload a file message
router.post('/upload', upload.single('file'), uploadFileMessage);

export default router;
