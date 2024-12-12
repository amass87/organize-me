// src/components/layout/Header.jsx
import { useState } from 'react';
import { PersonIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import useThemeStore from '../../store/themeStore';

export default function Header() {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const { colors } = useThemeStore(state => state.getTheme());
  const setTheme = useThemeStore(state => state.setTheme);
  const getAllThemes = useThemeStore(state => state.getAllThemes);
  const currentTheme = useThemeStore(state => state.currentTheme);

  // Determine if current theme is light
  const isLightTheme = currentTheme === 'light' || currentTheme === 'corporate';

  return (
    <header className={`h-16 ${colors.primary} border-b ${colors.border} px-6 flex items-center justify-between transition-colors duration-200`}>
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search..."
          className={`px-4 py-2 border ${colors.border} rounded-lg w-64 ${colors.primary} ${colors.text}`}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            className={`p-2 rounded-full transition-colors ${
              isLightTheme 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'text-gray-200 hover:bg-gray-700'
            }`}
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
          >
            {currentTheme.includes('dark') ? <MoonIcon /> : <SunIcon />}
          </button>
          
          {isThemeMenuOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${colors.primary} border ${colors.border} py-1 z-50`}>
              {Object.entries(getAllThemes()).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key);
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 ${
                    isLightTheme
                      ? currentTheme === key
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-blue-50'
                      : currentTheme === key
                        ? 'bg-gray-700 text-gray-100'
                        : 'text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button 
          className={`p-2 rounded-full transition-colors ${
            isLightTheme 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'text-gray-200 hover:bg-gray-700'
          }`}
        >
          <PersonIcon />
        </button>
      </div>
    </header>
  );
}
