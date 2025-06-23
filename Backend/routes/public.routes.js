import { Router } from 'express';
import { register } from '../controllers/auth/register.controller.js';
import { login } from '../controllers/auth/login.controller.js';
import uploadRoutes from './upload.routes.js';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.use('/upload', uploadRoutes); 

export default router;
