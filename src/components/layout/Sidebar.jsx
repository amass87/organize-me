// src/components/layout/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { LayoutIcon, CalendarIcon, GearIcon } from '@radix-ui/react-icons';
import useThemeStore from '../../store/themeStore';

export default function Sidebar() {
  const location = useLocation();
  const { colors } = useThemeStore(state => state.getTheme());
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutIcon /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { path: '/settings', label: 'Settings', icon: <GearIcon /> }
  ];

  return (
    <aside className={`w-64 ${colors.secondary} ${colors.text} p-4 transition-colors duration-200`}>
      <div className="mb-8">
        <h1 className="text-xl font-bold">Planner App</h1>
      </div>
      <nav>
        {navItems.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            className={`
              flex items-center gap-3 px-4 py-2 rounded-lg mb-2 transition-colors
              ${location.pathname === path 
                ? `${colors.highlight} ${colors.text}` 
                : `hover:${colors.highlight} ${colors.textSecondary}`
              }
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
