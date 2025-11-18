import { join, dirname } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || './data/db.json';
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Database schema type
export type User = {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company?: string;
  created_at: string;
  updated_at: string;
};

export type Workshop = {
  id: number;
  user_id: number;
  title: string;
  data: string;
  current_step: number;
  is_completed: boolean;
  last_accessed: string;
  created_at: string;
  updated_at: string;
};

type Data = {
  users: User[];
  workshops: Workshop[];
  _meta: {
    nextUserId: number;
    nextWorkshopId: number;
  };
};

// Initialize database
const adapter = new JSONFile<Data>(dbPath);
const defaultData: Data = {
  users: [],
  workshops: [],
  _meta: {
    nextUserId: 1,
    nextWorkshopId: 1,
  },
};

export const db = new Low(adapter, defaultData);

export async function initializeDatabase() {
  await db.read();

  // Initialize with default data if empty
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }

  console.log('Database initialized successfully');
}

export default db;
