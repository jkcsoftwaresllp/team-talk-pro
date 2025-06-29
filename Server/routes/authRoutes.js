import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  logoutUser
} from '../controllers/authController.js';
import { toggleSound } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', logoutUser);
router.put('/sound', protect, toggleSound);
router.patch('/sound', protect, toggleSound);

export default router;
