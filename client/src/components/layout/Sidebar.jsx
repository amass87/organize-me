// src/components/layout/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { LayoutIcon, CalendarIcon, GearIcon } from '@radix-ui/react-icons';

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutIcon /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { path: '/settings', label: 'Settings', icon: <GearIcon /> }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Planner App</h1>
      </div>
      <nav className="space-y-1">
        {navItems.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            className={`
              flex items-center gap-3 px-4 py-2 rounded-lg
              ${location.pathname === path 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'}
            `}
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
