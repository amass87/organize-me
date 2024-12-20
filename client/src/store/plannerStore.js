//src/store/plannerStore.js
import { create } from 'zustand';

const API_URL = 'http://192.168.86.240:5000/api';

// Helper function to get headers with auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const usePlannerStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      set({ tasks: Array.isArray(data) ? data : [], loading: false, error: null });
    } catch (error) {
      console.error('Fetch error:', error);
      set({ error: error.message, loading: false });
    }
  },

  addTask: async (task) => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error('Failed to add task');
      const newTask = await response.json();
      
      set(state => ({
        tasks: [...state.tasks, newTask],
        loading: false,
        error: null
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  toggleTask: async (taskId) => {
    try {
      const state = usePlannerStore.getState();
      const task = state.tasks.find(t => t.id === taskId);
      
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: task.status === 'completed' ? 'pending' : 'completed'
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      
      set(state => ({
        tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  removeTask: async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to delete task');
      
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      
      set(state => ({
        tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  reorderTasks: async (newTasks) => {
    set({ tasks: newTasks });
  },
}));

export default usePlannerStore;
