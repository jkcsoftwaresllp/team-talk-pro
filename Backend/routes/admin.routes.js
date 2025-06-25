import { Router } from 'express';
import { getAllUsers } from '../controllers/admin/getAllUsers.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';
import { banUser } from '../controllers/admin/banUser.controller.js';
import { deleteUser } from '../controllers/admin/deleteUser.controller.js';
import { getChatVolumeStats } from '../controllers/admin/chatStats.controller.js';
import { deleteMessage } from '../controllers/admin/deleteMessage.controller.js';

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', getAllUsers);
router.patch('/users/:userId/ban', banUser);
router.delete('/users/:userId', deleteUser);
router.get('/stats/chat-volume', getChatVolumeStats);
router.delete('/messages/:messageId', deleteMessage);

export default router;
