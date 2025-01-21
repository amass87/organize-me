// src/store/preferencesStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePreferencesStore = create(
  persist(
    (set) => ({
      showCompletedTasks: true,
      groupByDate: false,
      
      toggleShowCompletedTasks: () => 
        set((state) => ({ 
          showCompletedTasks: !state.showCompletedTasks 
        })),
      
      toggleGroupByDate: () => 
        set((state) => ({ 
          groupByDate: !state.groupByDate 
        })),
    }),
    {
      name: 'preferences-storage',
    }
  )
);

export default usePreferencesStore;
