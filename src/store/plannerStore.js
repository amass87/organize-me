// src/store/plannerStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePlannerStore = create(
  persist(
    (set) => ({
      tasks: [],
      loading: false,
      error: null,

      addTask: (task) => set((state) => ({ 
        tasks: [...state.tasks, { id: Date.now(), ...task }] 
      })),

      toggleTask: (taskId) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
            : task
        )
      })),

      removeTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      })),

      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),

      reorderTasks: (newTasks) => set({ tasks: newTasks }),
    }),
    {
      name: 'planner-storage',
      getStorage: () => localStorage,
    }
  )
);

export default usePlannerStore;
