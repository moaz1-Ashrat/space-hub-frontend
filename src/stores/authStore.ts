import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserProfile } from '../types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, profile: UserProfile, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, profile, token) =>
        set({
          user,
          profile,
          token,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          profile: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'space-hub-auth',
    }
  )
);