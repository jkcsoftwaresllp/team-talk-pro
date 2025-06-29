import express from 'express';
import {
  replyToMessage,
  reactToMessage,
  forwardMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/reply', protect, replyToMessage);
router.post('/react', protect, reactToMessage);
router.post('/forward', protect, forwardMessage);

export default router;
