import React from 'react';
import ReactDOM from 'react-dom/client'; // API moderna React 18+
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './styles/tailwind.css'; // Importo file CSS globale (Tailwind compreso)

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
