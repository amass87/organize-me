// src/components/layout/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Settings } from 'lucide-react';
import useThemeStore from '../../store/themeStore';

const NavItem = ({ path, label, icon: Icon, isActive }) => {
  return (
    <Link
      to={path}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1
        transition-all duration-200 ease-in-out
        ${isActive 
          ? 'bg-blue-500 text-white shadow-sm dark:bg-gray-700'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }
      `}
    >
      <Icon
        className={`h-5 w-5 transition-transform duration-200 ${
          isActive ? 'scale-110' : ''
        }`}
      />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 border-r dark:border-gray-800 h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Organize Me
        </h1>
      </div>
      
      <nav className="flex-1 px-3">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            {...item}
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>

      <div className="p-4 border-t dark:border-gray-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              User Name
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              user@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
