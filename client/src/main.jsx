//src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/userStyle.css';  // Add this line
import './index.css';
import App from './App.jsx';
import { initUserStyle } from './utils/userStyle';

// Initialize userStyle handler
initUserStyle();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
