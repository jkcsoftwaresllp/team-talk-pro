import { AuthValidator } from '../validators/AuthValidator.js';
import { Response } from '../utils/Response.js';

/**
 * Validation Middleware - Handles request validation
 */
export class ValidationMiddleware {
  static validateRegistration(req, res, next) {
    const validation = AuthValidator.validateRegistration(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json(
        Response.error('Validation failed', validation.errors)
      );
    }
    
    next();
  }

  static validateLogin(req, res, next) {
    const validation = AuthValidator.validateLogin(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json(
        Response.error('Validation failed', validation.errors)
      );
    }
    
    next();
  }
}
