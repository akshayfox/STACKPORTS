import create from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { id: string; email: string } | null;
  error: string | null;
  isLoading: boolean;
  login: (username: string, password: string, navigate: any) => Promise<void>; // Added navigate
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

      login: async (username: string, password: string,navigate:any) => {

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
          navigate('/dashboard')
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
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);