import { create } from 'zustand';

const API_URL = 'http://localhost:5000/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('authToken', data.token);
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        loading: false 
      });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  register: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      localStorage.setItem('authToken', data.token);
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        loading: false 
      });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem('authToken');
    set({ isAuthenticated: !!token });
  }
}));

export default useAuthStore;
