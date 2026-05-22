import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, AuthSession } from '../types/auth';

interface AuthState extends AuthSession {
  isLoading: boolean;
  setSession: (user: User, token: string) => Promise<void>;
  clearSession: () => Promise<void>;
  initializeSession: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: async (user, token) => {
    try {
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (e) {
      console.error('Error saving session:', e);
    }
  },

  clearSession: async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('auth_user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    } catch (e) {
      console.error('Error clearing session:', e);
    }
  },

  initializeSession: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userStr = await SecureStore.getItemAsync('auth_user');
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
      SecureStore.setItemAsync('auth_user', JSON.stringify(updatedUser)).catch((err) =>
        console.error('Failed to update persisted user:', err)
      );
      set({ user: updatedUser });
    }
  },
}));
