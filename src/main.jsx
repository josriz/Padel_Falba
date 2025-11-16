import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './styles/tailwind.css';
import { SupabaseProvider } from './SupabaseContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <SupabaseProvider>
      <Router>
        <App />
      </Router>
    </SupabaseProvider>
  </React.StrictMode>
);
