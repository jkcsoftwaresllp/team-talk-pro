import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createGroupChat,
  startPrivateChat
} from '../controllers/chatGroupController.js';

const router = express.Router();

router.post('/group', protect, createGroupChat);
router.post('/private', protect, startPrivateChat);

export default router;
