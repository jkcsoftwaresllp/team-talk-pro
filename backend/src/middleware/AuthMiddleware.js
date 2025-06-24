import { TokenService } from '../services/TokenService.js';
import { Response } from '../utils/Response.js';

/**
 * Authentication Middleware - Handles authentication
 */
export class AuthMiddleware {
  constructor(tokenService) {
    this.tokenService = tokenService;
  }

  authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json(
        Response.error('Access denied. No token provided.')
      );
    }

    try {
      const decoded = this.tokenService.verify(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(403).json(Response.error('Invalid token.'));
    }
  };
}
