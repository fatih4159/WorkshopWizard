import db from '../config/database';
import { Workshop } from '../types';

export class WorkshopModel {
  static create(userId: number, title: string, data: string): Workshop {
    const stmt = db.prepare(`
      INSERT INTO workshops (user_id, title, data, current_step)
      VALUES (?, ?, ?, 1)
    `);

    const result = stmt.run(userId, title, data);
    return this.findById(result.lastInsertRowid as number)!;
  }

  static findById(id: number): Workshop | undefined {
    const stmt = db.prepare('SELECT * FROM workshops WHERE id = ?');
    return stmt.get(id) as Workshop | undefined;
  }

  static findByUserId(userId: number): Workshop[] {
    const stmt = db.prepare(`
      SELECT * FROM workshops
      WHERE user_id = ?
      ORDER BY last_accessed DESC
    `);
    return stmt.all(userId) as Workshop[];
  }

  static findByUserAndId(userId: number, workshopId: number): Workshop | undefined {
    const stmt = db.prepare('SELECT * FROM workshops WHERE id = ? AND user_id = ?');
    return stmt.get(workshopId, userId) as Workshop | undefined;
  }

  static update(id: number, userId: number, data: {
    title?: string;
    data?: string;
    current_step?: number;
    is_completed?: boolean;
  }): Workshop | undefined {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }
    if (data.data !== undefined) {
      updates.push('data = ?');
      values.push(data.data);
    }
    if (data.current_step !== undefined) {
      updates.push('current_step = ?');
      values.push(data.current_step);
    }
    if (data.is_completed !== undefined) {
      updates.push('is_completed = ?');
      values.push(data.is_completed ? 1 : 0);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('last_accessed = CURRENT_TIMESTAMP');
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id, userId);

    const stmt = db.prepare(`
      UPDATE workshops
      SET ${updates.join(', ')}
      WHERE id = ? AND user_id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  static delete(id: number, userId: number): boolean {
    const stmt = db.prepare('DELETE FROM workshops WHERE id = ? AND user_id = ?');
    const result = stmt.run(id, userId);
    return result.changes > 0;
  }

  static updateLastAccessed(id: number, userId: number): void {
    const stmt = db.prepare(`
      UPDATE workshops
      SET last_accessed = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `);
    stmt.run(id, userId);
  }
}
