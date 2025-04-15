import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { id: string; email: string } | null;
  error: string | null;
  isLoading: boolean;
  login: (username: string, password: string, navigate: (path: string) => void) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const API_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: `${API_URL}`,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      error: null,
      isLoading: false,

      login: async (username, password, navigate) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', {username, password });
          const { token, user } = response.data;
          set({
            isAuthenticated: true,
            token,
            user,
            isLoading: false,
            error: null,
          });
          // Optionally set token in axios headers for subsequent requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          navigate('/')
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || 'Login failed. Please try again.';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            token: null,
            user: null,
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
          error: null,
          isLoading: false,
        });
        // Clear axios headers
        delete api.defaults.headers.common['Authorization'];
      },

      checkAuth: () => {
        const { token } = get();
        if (token) {
          // Optionally verify token with server here
          set({ isAuthenticated: true });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          set({
            isAuthenticated: false,
            token: null,
            user: null,
          });
        }
      },
    }),
    {
      name: 'auth-storage', // Key for localStorage
      storage: createJSONStorage(() => localStorage), // Updated from getStorage to storage with createJSONStorage
    }
  )
);