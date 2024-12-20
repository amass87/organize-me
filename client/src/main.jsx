//src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/userStyle.css';  // Add this line
import './index.css';
import App from './App.jsx';

// Add a global handler before rendering
window.userStyle = {
  register: () => {},
  onreset: () => {}
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
