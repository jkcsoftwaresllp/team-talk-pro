import bcrypt from 'bcryptjs';
import { IPasswordService } from '../interfaces/IPasswordService.js';

/**
 * Password Service - Handles password operations
 */
export class PasswordService extends IPasswordService {
  constructor(saltRounds = 10) {
    super();
    this.saltRounds = saltRounds;
  }

  async hash(password) {
    if (!password) {
      throw new Error('Password is required');
    }
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(password, hash) {
    if (!password || !hash) {
      throw new Error('Password and hash are required');
    }
    return await bcrypt.compare(password, hash);
  }
}
