/**
 * User Repository Interface
 * Defines contract for user data operations
 */
export class IUserRepository {
  async create(userData) {
    throw new Error('Method not implemented');
  }

  async findByEmail(email) {
    throw new Error('Method not implemented');
  }

  async findByUsername(username) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async updateOnlineStatus(userId, isOnline) {
    throw new Error('Method not implemented');
  }

  async existsByEmailOrUsername(email, username) {
    throw new Error('Method not implemented');
  }
}
