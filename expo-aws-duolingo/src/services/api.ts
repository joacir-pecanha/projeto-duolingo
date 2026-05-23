import { User } from '../types/auth';
import { storage } from '../utils/storage';

const DELAY_MS = 1000;

// Bump this version whenever DEFAULT_USERS changes to force re-seed
const DB_VERSION = 'v2';
const DB_VERSION_KEY = 'mock_db_version';

const DEFAULT_USERS: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Joacir Peçanha',
    email: 'user@example.com',
    password: 'password123',
    xp: 150,
    level: 4,
    streak: 5,
  },
  {
    id: '2',
    name: 'Admin',
    email: 'admin@duolingo.com',
    password: 'admin123',
    xp: 1200,
    level: 6,
    streak: 30,
  },
];

// Helper to simulate network latency
export const delay = (ms: number = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper database in secure store
export const mockDB = {
  getUsers: async (): Promise<any[]> => {
    try {
      const storedVersion = await storage.getItemAsync(DB_VERSION_KEY);

      // Re-seed if first time or version changed
      if (storedVersion !== DB_VERSION) {
        await storage.setItemAsync('mock_db_users', JSON.stringify(DEFAULT_USERS));
        await storage.setItemAsync(DB_VERSION_KEY, DB_VERSION);
        return DEFAULT_USERS;
      }

      const stored = await storage.getItemAsync('mock_db_users');
      if (stored) {
        return JSON.parse(stored);
      }

      return DEFAULT_USERS;
    } catch (e) {
      console.error('Mock DB Read error:', e);
      return DEFAULT_USERS;
    }
  },

  saveUser: async (newUser: User & { password?: string }): Promise<void> => {
    try {
      const users = await mockDB.getUsers();
      users.push(newUser);
      await storage.setItemAsync('mock_db_users', JSON.stringify(users));
    } catch (e) {
      console.error('Mock DB Write error:', e);
    }
  },
};
