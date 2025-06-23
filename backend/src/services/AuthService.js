import { IAuthService } from '../interfaces/IAuthService.js';
import { User } from '../models/User.js';


export class AuthService extends IAuthService {
  constructor(userRepository, passwordService, tokenService) {
    super();
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.tokenService = tokenService;
  }

  async register(userData) {
    // Check if user already exists
    const userExists = await this.userRepository.existsByEmailOrUsername(
      userData.email, 
      userData.username
    );

    if (userExists) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await this.passwordService.hash(userData.password);

    // Create user
    const newUser = await this.userRepository.create({
      username: userData.username,
      email: userData.email,
      passwordHash
    });

    // Generate token
    const token = this.tokenService.generate({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email
    });

    return {
      user: newUser.toAuthResponse(),
      token
    };
  }

  async login(credentials) {
    // Find user by email
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await this.passwordService.compare(
      credentials.password, 
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update online status
    await this.userRepository.updateOnlineStatus(user.id, true);

    // Generate token
    const token = this.tokenService.generate({
      userId: user.id,
      username: user.username,
      email: user.email
    });

    return {
      user: user.toAuthResponse(),
      token
    };
  }

  async logout(userId) {
    await this.userRepository.updateOnlineStatus(userId, false);
  }

  async getProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.toPublicObject();
  }
}
