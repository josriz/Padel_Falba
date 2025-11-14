import React from 'react';
import ReactDOM from 'react-dom/client'; // Uso API moderna per React18+
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css'; // Importa glissi CSS globali inclusi Tailwind

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
