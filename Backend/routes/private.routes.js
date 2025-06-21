import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getProfile } from '../controllers/user/profile.controller.js';

const router = Router();

router.use(authMiddleware); // Protect all routes below

router.get('/user/profile', getProfile); // example private route

export default router;
