// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/Calendar';
import Settings from './pages/Settings';
import Auth from './pages/Auth';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default function App() {
  const handleReset = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <BrowserRouter>
      <div onReset={handleReset}>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
