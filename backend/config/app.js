import { DatabaseService } from '../src/services/DatabaseService.js';
import { PasswordService } from '../src/services/PasswordService.js';
import { TokenService } from '../src/services/TokenService.js';
import { UserRepository } from '../src/repositories/UserRepository.js';
import { AuthService } from '../src/services/AuthService.js';
import { AuthController } from '../src/controllers/AuthController.js';
import { AuthMiddleware } from '../src/middleware/AuthMiddleware.js';

export class AppContainer {
  constructor() {
    this.services = new Map();
    this.setupDependencies();
  }

  setupDependencies() {
    // Core services
    this.services.set('databaseService', new DatabaseService());
    this.services.set('passwordService', new PasswordService());
    this.services.set('tokenService', new TokenService());

    // Repositories
    this.services.set('userRepository', new UserRepository(
      this.services.get('databaseService')
    ));

    // Business services
    this.services.set('authService', new AuthService(
      this.services.get('userRepository'),
      this.services.get('passwordService'),
      this.services.get('tokenService')
    ));

    // Controllers
    this.services.set('authController', new AuthController(
      this.services.get('authService'),
      this.services.get('tokenService')
    ));

    // Middleware
    this.services.set('authMiddleware', new AuthMiddleware(
      this.services.get('tokenService')
    ));
  }

  get(serviceName) {
    return this.services.get(serviceName);
  }
}
