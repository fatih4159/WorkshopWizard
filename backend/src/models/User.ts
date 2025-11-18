import db from '../config/database';
import { User, UserPublic } from '../types';
import { hashPassword } from '../utils/auth';

export class UserModel {
  static create(email: string, password: string, firstName: string, lastName: string, company?: string): User {
    const stmt = db.prepare(`
      INSERT INTO users (email, password, first_name, last_name, company)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(email, password, firstName, lastName, company || null);

    return this.findById(result.lastInsertRowid as number)!;
  }

  static findById(id: number): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }

  static findByEmail(email: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | undefined;
  }

  static update(id: number, data: Partial<Pick<User, 'first_name' | 'last_name' | 'company'>>): User | undefined {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.first_name !== undefined) {
      updates.push('first_name = ?');
      values.push(data.first_name);
    }
    if (data.last_name !== undefined) {
      updates.push('last_name = ?');
      values.push(data.last_name);
    }
    if (data.company !== undefined) {
      updates.push('company = ?');
      values.push(data.company);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  static toPublic(user: User): UserPublic {
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      company: user.company,
      created_at: user.created_at,
    };
  }
}
