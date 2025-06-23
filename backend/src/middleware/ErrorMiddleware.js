import { Response } from '../utils/Response.js';

/**
 * Error Middleware - Handles application errors
 */
export class ErrorMiddleware {
  static handle(error, req, res, next) {
    console.error('Application Error:', error);

    if (error.message === 'User already exists') {
      return res.status(400).json(Response.error(error.message));
    }

    if (error.message === 'Invalid credentials') {
      return res.status(400).json(Response.error(error.message));
    }

    if (error.message === 'User not found') {
      return res.status(404).json(Response.error(error.message));
    }

    // Default server error
    res.status(500).json(Response.error('Internal server error'));
  }
}
