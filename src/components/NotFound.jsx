import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8 text-center">
    <div className="mb-8">
      <h1 className="text-8xl font-black text-gray-900 mb-4">404</h1>
      <div className="w-24 h-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
    </div>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Ops! Pagina non trovata</h2>
    <p className="text-lg text-gray-600 mb-8 max-w-md">La pagina che stai cercando non esiste o è stata spostata.</p>
    <Link 
      to="/" 
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
    >
      ← Torna alla Home
    </Link>
  </div>
);

export default NotFound;
