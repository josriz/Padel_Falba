import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { SupabaseProvider } from './SupabaseProvider';
import { BrowserRouter } from 'react-router-dom';

function CheckSetup() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </SupabaseProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

try {
  root.render(<CheckSetup />);
  console.log('✅ Providers e Router correttamente avvolti.');
} catch (err) {
  console.error('❌ Errore setup:', err);
}
