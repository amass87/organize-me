// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import useThemeStore from '../../store/themeStore';

export default function MainLayout() {
  const { colors } = useThemeStore(state => state.getTheme());
  
  return (
    <div className={`flex h-screen ${colors.secondary}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className={`flex-1 overflow-auto p-6 rounded-tl-3xl ${colors.primary} transition-colors duration-200`}>
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
