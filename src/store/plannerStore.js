// src/store/plannerStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePlannerStore = create(
  persist(
    (set) => ({
      tasks: [],
      
      addTask: (task) => set((state) => ({ 
        tasks: [...state.tasks, { 
          id: Date.now(), 
          priority: 'medium', // default priority
          ...task 
        }] 
      })),

      toggleTask: (taskId) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
            : task
        )
      })),

      updateTaskPriority: (taskId, priority) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, priority } : task
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
    }
  )
);

export default usePlannerStore;
