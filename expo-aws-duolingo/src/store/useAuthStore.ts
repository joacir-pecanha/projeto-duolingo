import { create } from 'zustand';
import { User, AuthSession } from '../types/auth';
import { getLevelForXP } from '../types/gamification';
import { storage } from '../utils/storage';

interface AuthState extends AuthSession {
  isLoading: boolean;
  setSession: (user: User, token: string) => Promise<void>;
  clearSession: () => Promise<void>;
  initializeSession: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  addXP: (amount: number) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: async (user, token) => {
    try {
      await storage.setItemAsync('auth_token', token);
      await storage.setItemAsync('auth_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (e) {
      console.error('Error saving session:', e);
    }
  },

  clearSession: async () => {
    try {
      await storage.deleteItemAsync('auth_token');
      await storage.deleteItemAsync('auth_user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    } catch (e) {
      console.error('Error clearing session:', e);
    }
  },

  initializeSession: async () => {
    try {
      const token = await storage.getItemAsync('auth_token');
      const userStr = await storage.getItemAsync('auth_user');
      if (token && userStr) {
        set({
          token,
          user: JSON.parse(userStr),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      console.error('Error initializing session:', e);
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (updatedFields) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedFields };
      storage.setItemAsync('auth_user', JSON.stringify(updatedUser)).catch((err) =>
        console.error('Failed to update persisted user:', err)
      );
      set({ user: updatedUser });
    }
  },

  addXP: (amount) => {
    const currentUser = get().user;
    if (currentUser) {
      const newXP = currentUser.xp + amount;
      const newLevel = getLevelForXP(newXP).level;
      const updatedUser = { ...currentUser, xp: newXP, level: newLevel };
      storage.setItemAsync('auth_user', JSON.stringify(updatedUser)).catch((err) =>
        console.error('Failed to persist XP:', err)
      );
      set({ user: updatedUser });
    }
  },
}));
