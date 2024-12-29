// src/store/themeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const themes = {
  light: {
    name: 'Light',
    colors: {
      background: 'bg-gray-100',
      primary: 'bg-white',
      sidebar: 'bg-white',
      card: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      input: 'bg-white',
      hover: 'hover:bg-gray-50'
    }
  },
  sunset: {
    name: 'Sunset',
    colors: {
      background: 'bg-gradient-to-br from-orange-400 to-pink-600',
      primary: 'bg-white',
      sidebar: 'bg-gray-800',
      card: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      input: 'bg-white',
      hover: 'hover:bg-gray-50'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      background: 'bg-gray-900',
      primary: 'bg-gray-800',
      sidebar: 'bg-gray-800',
      card: 'bg-gray-800',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-gray-700',
      input: 'bg-gray-700',
      hover: 'hover:bg-gray-700'
    }
  }
};

const useThemeStore = create(
  persist(
    (set) => ({
      currentTheme: 'light',
      setTheme: (theme) => set({ currentTheme: theme }),
      getTheme: () => themes[useThemeStore.getState().currentTheme],
      getAllThemes: () => themes
    }),
    {
      name: 'theme-storage'
    }
  )
);

export default useThemeStore;
