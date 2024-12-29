// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-[#1a1a1a]">
      <div className="w-64 border-r border-gray-800 bg-[#1a1a1a]">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-[#1a1a1a] text-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
