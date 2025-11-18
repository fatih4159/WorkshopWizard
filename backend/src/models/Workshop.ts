import db, { Workshop as DBWorkshop } from '../config/database.js';
import { Workshop } from '../types/index.js';

export class WorkshopModel {
  static async create(userId: number, title: string, data: string): Promise<Workshop> {
    await db.read();

    const now = new Date().toISOString();
    const id = db.data!._meta.nextWorkshopId++;

    const workshop: DBWorkshop = {
      id,
      user_id: userId,
      title,
      data,
      current_step: 1,
      is_completed: false,
      last_accessed: now,
      created_at: now,
      updated_at: now,
    };

    db.data!.workshops.push(workshop);
    await db.write();

    return workshop as Workshop;
  }

  static async findById(id: number): Promise<Workshop | undefined> {
    await db.read();
    return db.data!.workshops.find(w => w.id === id) as Workshop | undefined;
  }

  static async findByUserId(userId: number): Promise<Workshop[]> {
    await db.read();
    return db.data!.workshops
      .filter(w => w.user_id === userId)
      .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime()) as Workshop[];
  }

  static async findByUserAndId(userId: number, workshopId: number): Promise<Workshop | undefined> {
    await db.read();
    return db.data!.workshops.find(w => w.id === workshopId && w.user_id === userId) as Workshop | undefined;
  }

  static async update(id: number, userId: number, data: {
    title?: string;
    data?: string;
    current_step?: number;
    is_completed?: boolean;
  }): Promise<Workshop | undefined> {
    await db.read();

    const workshopIndex = db.data!.workshops.findIndex(w => w.id === id && w.user_id === userId);
    if (workshopIndex === -1) {
      return undefined;
    }

    const workshop = db.data!.workshops[workshopIndex];

    if (data.title !== undefined) {
      workshop.title = data.title;
    }
    if (data.data !== undefined) {
      workshop.data = data.data;
    }
    if (data.current_step !== undefined) {
      workshop.current_step = data.current_step;
    }
    if (data.is_completed !== undefined) {
      workshop.is_completed = data.is_completed;
    }

    workshop.last_accessed = new Date().toISOString();
    workshop.updated_at = new Date().toISOString();

    await db.write();
    return workshop as Workshop;
  }

  static async delete(id: number, userId: number): Promise<boolean> {
    await db.read();

    const initialLength = db.data!.workshops.length;
    db.data!.workshops = db.data!.workshops.filter(w => !(w.id === id && w.user_id === userId));

    if (db.data!.workshops.length < initialLength) {
      await db.write();
      return true;
    }

    return false;
  }

  static async updateLastAccessed(id: number, userId: number): Promise<void> {
    await db.read();

    const workshop = db.data!.workshops.find(w => w.id === id && w.user_id === userId);
    if (workshop) {
      workshop.last_accessed = new Date().toISOString();
      await db.write();
    }
  }
}
