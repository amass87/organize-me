// src/components/layout/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { CalendarIcon, GearIcon, LayoutIcon } from '@radix-ui/react-icons';

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutIcon /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { path: '/settings', label: 'Settings', icon: <GearIcon /> }
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Planner App</h1>
      </div>
      <nav>
        {navItems.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            className={`
              flex items-center gap-3 px-4 py-2 rounded-lg mb-2
              ${location.pathname === path ? 'bg-gray-700' : 'hover:bg-gray-700'}
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
