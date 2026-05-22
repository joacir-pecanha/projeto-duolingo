import * as SecureStore from 'expo-secure-store';
import { User } from '../types/auth';

const DELAY_MS = 1000;

const DEFAULT_USERS: User[] & { password?: string }[] = [
  {
    id: '1',
    name: 'Joacir Peçanha',
    email: 'user@example.com',
    xp: 150,
    level: 4,
    streak: 5,
  },
];

// Helper to simulate network latency
export const delay = (ms: number = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper database in secure store
export const mockDB = {
  getUsers: async (): Promise<any[]> => {
    try {
      const stored = await SecureStore.getItemAsync('mock_db_users');
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with default
      const initialUsers = DEFAULT_USERS.map((u) => ({
        ...u,
        password: 'password123', // Default mock password
      }));
      await SecureStore.setItemAsync('mock_db_users', JSON.stringify(initialUsers));
      return initialUsers;
    } catch (e) {
      console.error('Mock DB Read error:', e);
      return DEFAULT_USERS.map((u) => ({ ...u, password: 'password123' }));
    }
  },

  saveUser: async (newUser: User & { password?: string }): Promise<void> => {
    try {
      const users = await mockDB.getUsers();
      users.push(newUser);
      await SecureStore.setItemAsync('mock_db_users', JSON.stringify(users));
    } catch (e) {
      console.error('Mock DB Write error:', e);
    }
  },
};
