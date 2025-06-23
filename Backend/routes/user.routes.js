import { Router } from 'express';
import { getProfile } from '../controllers/user/profile.controller.js';

const router = Router();

// GET /api/user/profile
router.get('/profile', getProfile);

// 🔧 You can later add:
// router.put('/profile', updateProfile);
// router.post('/avatar', uploadAvatar);

export default router;
