import db from '../../config/database.js';


export class DatabaseService {
  constructor() {
    this.db = db;
  }

  async execute(query, params = []) {
    try {
      return await this.db.execute(query, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Database operation failed');
    }
  }

  async testConnection() {
    try {
      await this.db.execute('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}
