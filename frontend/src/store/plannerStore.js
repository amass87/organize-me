import { create } from 'zustand';

const API_URL = 'http://localhost:5000/api';

const usePlannerStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      set({ tasks: data, loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addTask: async (task) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
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
      const token = localStorage.getItem('authToken');
      const task = get().tasks.find(t => t.id === taskId);
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: task.status === 'completed' ? 'pending' : 'completed'
        })
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
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update task');
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
