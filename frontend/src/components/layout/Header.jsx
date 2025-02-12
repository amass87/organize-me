// src/components/layout/Header.jsx
import { useState } from 'react';
import { User, Sun, Moon, Search } from 'lucide-react';
import Button from '../common/Button';
import { Input } from '../common/Input';
import useThemeStore from '../../store/themeStore';
import { Card } from '../common/Card';

const ThemeSelector = ({ isOpen, onClose, currentTheme, setTheme, colors, getAllThemes }) => {
  if (!isOpen) return null;

  return (
    <Card className="absolute right-0 mt-2 w-48 py-1 z-50">
      {Object.entries(getAllThemes()).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => {
            setTheme(key);
            onClose();
          }}
          className={`w-full text-left px-4 py-2 transition-colors ${
            currentTheme === key
              ? 'bg-blue-500 text-white dark:bg-gray-700 dark:text-gray-100'
              : 'text-gray-700 hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {theme.name}
        </button>
      ))}
    </Card>
  );
};

export default function Header() {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { colors } = useThemeStore(state => state.getTheme());
  const setTheme = useThemeStore(state => state.setTheme);
  const getAllThemes = useThemeStore(state => state.getAllThemes);
  const currentTheme = useThemeStore(state => state.currentTheme);

  const isLightTheme = !currentTheme.includes('dark');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement your search logic here
  };

  return (
    <header className="h-16 border-b px-6 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
          >
            {isLightTheme ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <ThemeSelector
            isOpen={isThemeMenuOpen}
            onClose={() => setIsThemeMenuOpen(false)}
            currentTheme={currentTheme}
            setTheme={setTheme}
            colors={colors}
            getAllThemes={getAllThemes}
          />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
