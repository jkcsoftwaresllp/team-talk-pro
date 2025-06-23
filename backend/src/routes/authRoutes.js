import express from 'express';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware.js';


export const createAuthRoutes = (authController, authMiddleware) => {
  const router = express.Router();

  router.post('/register', 
    ValidationMiddleware.validateRegistration,
    authController.register
  );

  router.post('/login',
    ValidationMiddleware.validateLogin,
    authController.login
  );

  router.post('/logout',
    authMiddleware.authenticate,
    authController.logout
  );

  router.get('/profile',
    authMiddleware.authenticate,
    authController.getProfile
  );

  return router;
};
