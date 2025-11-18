import db, { User as DBUser } from '../config/database.js';
import { User, UserPublic } from '../types/index.js';

export class UserModel {
  static async create(email: string, password: string, firstName: string, lastName: string, company?: string): Promise<User> {
    await db.read();

    const now = new Date().toISOString();
    const id = db.data!._meta.nextUserId++;

    const user: DBUser = {
      id,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      company,
      created_at: now,
      updated_at: now,
    };

    db.data!.users.push(user);
    await db.write();

    return user as User;
  }

  static async findById(id: number): Promise<User | undefined> {
    await db.read();
    return db.data!.users.find(u => u.id === id) as User | undefined;
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    await db.read();
    return db.data!.users.find(u => u.email === email) as User | undefined;
  }

  static async update(id: number, data: Partial<Pick<User, 'first_name' | 'last_name' | 'company'>>): Promise<User | undefined> {
    await db.read();

    const userIndex = db.data!.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return undefined;
    }

    const user = db.data!.users[userIndex];

    if (data.first_name !== undefined) {
      user.first_name = data.first_name;
    }
    if (data.last_name !== undefined) {
      user.last_name = data.last_name;
    }
    if (data.company !== undefined) {
      user.company = data.company;
    }

    user.updated_at = new Date().toISOString();

    await db.write();
    return user as User;
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
