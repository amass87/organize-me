// src/components/layout/Header.jsx
import { useNavigate } from 'react-router-dom';
import { PersonIcon, ExitIcon } from '@radix-ui/react-icons';

export default function Header() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/auth');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search..."
          className="px-4 py-2 border rounded-lg w-64"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{userData.name || userData.email}</span>
        <button 
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() => navigate('/settings')}
        >
          <PersonIcon />
        </button>
        <button 
          className="p-2 hover:bg-gray-100 rounded-full text-red-500"
          onClick={handleLogout}
        >
          <ExitIcon />
        </button>
      </div>
    </header>
  );
}
