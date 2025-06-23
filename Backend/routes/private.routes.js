import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';

import userRoutes from './user.routes.js';
import chatRoutes from './chat.routes.js';
import messageRoutes from './message.routes.js';

const router = Router();

router.use(authMiddleware);

router.use('/user', userRoutes);
router.use('/chats', chatRoutes);
router.use('/messages', messageRoutes);

export default router;
