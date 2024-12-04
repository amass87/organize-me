// src/store/plannerStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const usePlannerStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (task) => set((state) => {
        console.log('Adding task:', task);
        return { tasks: [...state.tasks, { id: Date.now(), ...task }] };
      }),

      removeTask: (taskId) => set((state) => {
        console.log('Before removal - tasks:', state.tasks);
        console.log('Removing task with ID:', taskId);
        const newTasks = state.tasks.filter(task => task.id !== taskId);
        console.log('After removal - tasks:', newTasks);
        return { tasks: newTasks };
      }),

      toggleTask: (taskId) => set((state) => {
        console.log('Toggling task:', taskId);
        return {
          tasks: state.tasks.map(task => 
            task.id === taskId 
              ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
              : task
          )
        };
      }),

      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),

      reorderTasks: (newTasks) => set({ tasks: newTasks }),
    }),
    {
      name: 'planner-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default usePlannerStore;
