import jwt from 'jsonwebtoken';

/**
 * Token Service - Handles JWT operations
 */
export class TokenService {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.expiresIn = '7d';
  }

  generate(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid payload for token generation');
    }
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token) {
    if (!token) {
      throw new Error('Token is required');
    }
    return jwt.verify(token, this.secret);
  }

  createCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
  }
}
