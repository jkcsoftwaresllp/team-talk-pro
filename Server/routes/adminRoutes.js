// routes/adminRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/isAdmin.js';
import {
  getAllUsers,
  banUser,
  getChannelStats,
  deleteMessage,
  deleteFile
} from '../controllers/adminController.js';


const router = express.Router();

router.use(protect, isAdmin);

// Get all users with roles and statuses
router.get('/users', getAllUsers);

// Ban or remove a user
router.patch('/users/:id/ban', banUser);

// Get chat volume/statistics per channel
router.get('/stats/channels', getChannelStats);

// Delete a message
router.delete('/messages/:id', deleteMessage);

// Delete a file
router.delete('/files/:filename', deleteFile);

export default router;
