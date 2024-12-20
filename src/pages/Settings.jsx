// src/pages/Settings.jsx
import { useState } from 'react';
import useThemeStore from '../store/themeStore';
import usePlannerStore from '../store/plannerStore';
import usePreferencesStore from '../store/preferencesStore';
import { 
  Palette, 
  Database, 
  Settings2, 
  Download,
  Eye,
  LayoutGrid
} from 'lucide-react';

export default function Settings() {
  const { currentTheme, setTheme, getAllThemes } = useThemeStore();
  const themes = getAllThemes();
  const tasks = usePlannerStore(state => state.tasks);
  const {
    showCompletedTasks,
    groupByDate,
    toggleShowCompletedTasks,
    toggleGroupByDate
  } = usePreferencesStore();

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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="w-7 h-7 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>
      
      {/* Theme Settings */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Theme</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${currentTheme === key 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-200 hover:border-blue-200'
                }
              `}
            >
              <div className={`
                h-20 rounded-md mb-2
                ${theme.colors.primary}
                ${theme.colors.name === 'Light' ? 'border border-gray-200' : ''}
              `} />
              <span className="text-sm font-medium text-gray-900">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Data Management</h2>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
          
          <div className="text-sm text-gray-700">
            <p>Total Tasks: {tasks.length}</p>
            <p>Completed Tasks: {tasks.filter(t => t.status === 'completed').length}</p>
          </div>
        </div>
      </div>

      {/* Display Preferences */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Display Preferences</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showCompletedTasks}
              onChange={toggleShowCompletedTasks}
              className="rounded border-gray-300"
            />
            <span className="text-gray-900">Show completed tasks</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={groupByDate}
              onChange={toggleGroupByDate}
              className="rounded border-gray-300"
            />
            <span className="text-gray-900">Group tasks by date</span>
          </label>
        </div>
      </div>
    </div>
  );
}
