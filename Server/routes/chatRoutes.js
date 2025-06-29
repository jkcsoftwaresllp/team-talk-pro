import express from 'express';
import {
  getChatMessages,
  searchMessages,
  deleteMessage
} from '../controllers/chatController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get messages by page
router.get('/:chatId/messages', protect, getChatMessages);

// Search messages in a chat
router.get('/:chatId/search', protect, searchMessages);

// Delete a message
router.delete('/message', protect, deleteMessage);

export default router;
