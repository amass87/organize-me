// src/store/themeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const themes = {
  light: {
    name: 'Light',
    colors: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      accent: 'bg-blue-500',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      highlight: 'bg-blue-50',
      button: 'bg-blue-500 hover:bg-blue-600 text-white'
    }
  },
  purple: {
    name: 'Purple Dream',
    colors: {
      primary: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      secondary: 'bg-purple-900',
      accent: 'bg-pink-500',
      text: 'text-white',
      textSecondary: 'text-purple-200',
      border: 'border-purple-400',
      highlight: 'bg-purple-400 bg-opacity-20',
      button: 'bg-pink-500 hover:bg-pink-600 text-white'
    }
  },
  sunset: {
    name: 'Sunset',
    colors: {
      primary: 'bg-gradient-to-br from-orange-400 to-pink-600',
      secondary: 'bg-orange-900',
      accent: 'bg-yellow-500',
      text: 'text-white',
      textSecondary: 'text-orange-100',
      border: 'border-orange-400',
      highlight: 'bg-orange-400 bg-opacity-20',
      button: 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: 'bg-gray-900',
      secondary: 'bg-gray-800',
      accent: 'bg-blue-500',
      text: 'text-gray-50',
      textSecondary: 'text-gray-400',
      border: 'border-gray-700',
      highlight: 'bg-gray-700',
      button: 'bg-blue-500 hover:bg-blue-600 text-white'
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
