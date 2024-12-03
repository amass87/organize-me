// src/components/layout/Header.jsx
import { useNavigate } from 'react-router-dom';
import { PersonIcon, ExitIcon } from '@radix-ui/react-icons';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search..."
          className="px-4 py-2 border rounded-lg w-64"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() => navigate('/settings')}
        >
          <PersonIcon />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <ExitIcon />
        </button>
      </div>
    </header>
  );
}
