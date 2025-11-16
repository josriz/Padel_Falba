import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center p-12 max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-4">Benvenuto/a nella Padel App!</h2>
      <p className="text-gray-600 mb-8">
        Questa è la landing page. Per accedere alle funzionalità, effettua il login.
      </p>
      <Link 
        to="/login" 
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
      >
        Vai al Login
      </Link>
    </div>
  );
};

export default Home;
