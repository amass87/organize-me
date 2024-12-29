// src/pages/Settings.jsx
import { useState } from 'react';
import useThemeStore from '../store/themeStore';
import usePlannerStore from '../store/plannerStore';
import usePreferencesStore from '../store/preferencesStore';
import { Palette, Database, Eye } from 'lucide-react';

export default function Settings() {
  const { currentTheme, setTheme, getAllThemes } = useThemeStore();
  const themes = getAllThemes();
  const tasks = usePlannerStore(state => state.tasks);

  const handleExportData = () => {
    const data = {
      tasks,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>
        
        {/* Theme Settings */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Theme</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`
                  p-6 rounded-lg border-2 transition-all
                  ${currentTheme === key 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-200'
                  }
                `}
              >
                <div className={`h-24 rounded-lg mb-4 ${theme.colors.primary}`} />
                <span className="text-sm font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Data Management</h2>
          </div>
          <div className="space-y-6">
            <button
              onClick={handleExportData}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
            >
              Export Data
            </button>
            
            <div className="mt-4 space-y-2 text-gray-600">
              <p>Total Tasks: {tasks.length}</p>
              <p>Completed Tasks: {tasks.filter(t => t.status === 'completed').length}</p>
            </div>
          </div>
        </div>

        {/* Display Preferences */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Display Preferences</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span>Show completed tasks</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span>Group tasks by date</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
