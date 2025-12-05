import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function SidebarMenu({ userType, setUserType }) {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    setUserType('guest');
    navigate('/');
  };

  return (
    <aside className="fixed top-0 left-0 z-50 w-72 h-screen bg-white shadow-2xl border-r-4 border-gray-100">
      <div className="p-8 border-b-2 border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🎾</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Padel Club</h1>
            <p className="text-sm text-gray-500 capitalize">{userType}</p>
          </div>
        </div>
      </div>
      
      <nav className="p-6 space-y-3">
        <Link to="/" className={`flex items-center p-4 rounded-xl transition-all ${location.pathname === '/' ? 'bg-blue-100 text-blue-700 shadow-md border-2 border-blue-200' : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'}`}>
          🏠 Dashboard
        </Link>
        
        <Link to="/tournaments" className={`flex items-center p-4 rounded-xl transition-all ${location.pathname.startsWith('/tournaments') ? 'bg-green-100 text-green-700 shadow-md border-2 border-green-200' : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'}`}>
          🏆 Tornei & Eventi
        </Link>
        
        {userType === 'admin' && (
          <>
            <Link to="/admin" className={`flex items-center p-4 rounded-xl transition-all ${location.pathname === '/admin' ? 'bg-purple-100 text-purple-700 shadow-md border-2 border-purple-200' : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'}`}>
              ⚙️ Admin Panel
            </Link>
            <Link to="/admin/list" className={`flex items-center p-4 rounded-xl transition-all ${location.pathname === '/admin/list' ? 'bg-orange-100 text-orange-700 shadow-md border-2 border-orange-200' : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'}`}>
              📋 Lista Admin
            </Link>
          </>
        )}
        
        {userType !== 'guest' && (
          <button onClick={logout} className="w-full flex items-center p-4 rounded-xl text-red-600 hover:bg-red-50 hover:shadow-sm transition-all font-medium">
            🚪 Esci
          </button>
        )}
      </nav>
    </aside>
  );
}
