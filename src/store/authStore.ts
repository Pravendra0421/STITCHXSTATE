'use client';
import { create } from 'zustand';
import { userResponseDto } from '@/core/dtos/User.dto'; // Adjust import

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  id?: string;
  isAdmin?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,
  error: null,

  login: ( user) => {
    set({ isAuthenticated: true, user, error: null });
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      set({ isAuthenticated: false, user: null, error: null });
    } catch (e) {
      console.error('Logout failed:', e);
      set({ error: 'Logout failed' });
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/users/me', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data: { user: userResponseDto} = await response.json();
        set({
          isAuthenticated: true,
          user: {
            id: data.user.id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            isAdmin: data.user.isAdmin,
          },
          isLoading: false,
          error: null,
        });
      } else {
        set({ isAuthenticated: false, user: null, isLoading: false, error: null });
      }
    } catch (e) {
      console.error('Failed to initialize auth:', e);
      set({ isAuthenticated: false, user: null, token: null, isLoading: false, error: 'Failed to initialize auth' });
    }
  },
}));