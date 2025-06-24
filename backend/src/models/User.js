/**
 * User Model - Represents user entity
 */
export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.username = data.username || '';
    this.email = data.email || '';
    this.passwordHash = data.password_hash || '';
    this.avatarUrl = data.avatar_url || null;
    this.role = data.role || 'user';
    this.isOnline = data.is_online || false;
    this.lastSeen = data.last_seen || null;
    this.createdAt = data.created_at || null;
    this.updatedAt = data.updated_at || null;
  }

  // Business logic methods
  isAdmin() {
    return this.role === 'admin';
  }

  isValidForRegistration() {
    return this.username && this.email && this.passwordHash;
  }

  toPublicObject() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      avatarUrl: this.avatarUrl,
      role: this.role,
      isOnline: this.isOnline,
      lastSeen: this.lastSeen,
      createdAt: this.createdAt
    };
  }

  toAuthResponse() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role
    };
  }
}
