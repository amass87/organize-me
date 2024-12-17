//src/store/plannerStore.js
import { create } from 'zustand';

const API_URL = 'http://192.168.86.240:5000/api';

const usePlannerStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      set({ tasks: data, loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addTask: async (task) => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
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
      const task = get().tasks.find(t => t.id === taskId);
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: task.status === 'completed' ? 'pending' : 'completed'
        }),
      });
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
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const updatedTask = await response.json();
      set(state => ({
        tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t)
      }));
    } catch (error) {
      set({ error: error.message });
    }
  }
}));

export default usePlannerStore;
