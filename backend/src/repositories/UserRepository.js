import { IUserRepository } from '../interfaces/IUserRepository.js';
import { User } from '../models/User.js';


export class UserRepository extends IUserRepository {
  constructor(databaseService) {
    super();
    this.db = databaseService;
  }

  async create(userData) {
    const query = `
      INSERT INTO users (username, email, password_hash) 
      VALUES (?, ?, ?)
    `;
    const [result] = await this.db.execute(query, [
      userData.username,
      userData.email,
      userData.passwordHash
    ]);

    return new User({
      id: result.insertId,
      username: userData.username,
      email: userData.email,
      password_hash: userData.passwordHash
    });
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [users] = await this.db.execute(query, [email]);
    
    if (users.length === 0) {
      return null;
    }
    
    return new User(users[0]);
  }

  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [users] = await this.db.execute(query, [username]);
    
    if (users.length === 0) {
      return null;
    }
    
    return new User(users[0]);
  }

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [users] = await this.db.execute(query, [id]);
    
    if (users.length === 0) {
      return null;
    }
    
    return new User(users[0]);
  }

  async updateOnlineStatus(userId, isOnline) {
    const query = 'UPDATE users SET is_online = ? WHERE id = ?';
    await this.db.execute(query, [isOnline, userId]);
  }

  async existsByEmailOrUsername(email, username) {
    const query = 'SELECT id FROM users WHERE email = ? OR username = ?';
    const [users] = await this.db.execute(query, [email, username]);
    return users.length > 0;
  }
}
