//src/store/plannerStore.js
import { create } from 'zustand';

const API_URL = 'http://192.168.86.240:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.log('No auth token found');
    return null;
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const usePlannerStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching tasks with headers:', headers); // Debug log
      const response = await fetch(`${API_URL}/tasks`, {
        headers: headers
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched tasks:', data); // Debug log
      set({ tasks: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      console.error('Fetch error:', error);
      set({ error: error.message, loading: false, tasks: [] });
    }
  },

  addTask: async (task) => {
    set({ loading: true });
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const newTask = await response.json();
      set(state => ({
        tasks: [...state.tasks, newTask],
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Add task error:', error);
      set({ error: error.message, loading: false });
    }
  },

  toggleTask: async (taskId) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        throw new Error('No authentication token found');
      }

      const task = get().tasks.find(t => t.id === taskId);
      if (!task) return;

      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({
          status: task.status === 'completed' ? 'pending' : 'completed'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      set(state => ({
        tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t)
      }));
    } catch (error) {
      console.error('Toggle task error:', error);
      set({ error: error.message });
    }
  },

  removeTask: async (taskId) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: headers
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      set(state => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      }));
    } catch (error) {
      console.error('Remove task error:', error);
      set({ error: error.message });
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      set(state => ({
        tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t)
      }));
    } catch (error) {
      console.error('Update task error:', error);
      set({ error: error.message });
    }
  }
}));

export default usePlannerStore;
