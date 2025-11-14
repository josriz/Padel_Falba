import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation, Link } from 'react-router-dom';
import { Home, BarChart2, Calendar, LogOut, Menu, Award, ShoppingBag, Settings } from 'lucide-react';
import { supabase } from '../supabaseClient'; 

const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Prenotazioni', href: '/dashboard/prenotazioni', icon: Calendar },
    { name: 'Tornei', href: '/dashboard/torneo', icon: Award },
    { name: 'Marketplace', href: '/dashboard/marketplace', icon: ShoppingBag },
    { name: 'Profilo', href: '/dashboard/profilo', icon: Settings },
];

const ADMIN_NAVIGATION = [
    { name: 'Gestione Admin', href: '/dashboard/admin-eventi', icon: BarChart2 },
];

const DashboardWrapper = ({ user, isAdmin }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const linkClasses = (href) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
            location.pathname === href
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-700 hover:bg-indigo-100'
        }`;

    const Sidebar = () => (
        <>
            <div 
                className={`fixed inset-y-0 right-0 z-50 flex flex-col w-64 bg-white border-l border-gray-200 shadow transform transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                } lg:translate-x-0 lg:static lg:inset-auto lg:flex`}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <span className="text-2xl font-extrabold text-indigo-600 tracking-wide">Padel Tracker</span>
                    <button onClick={() => setSidebarOpen(false)} aria-label="Chiudi sidebar" className="p-1 text-gray-400 rounded-lg hover:text-gray-700 lg:hidden">
                        &times;
                    </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {[...navigation, ...(isAdmin ? ADMIN_NAVIGATION : [])].map((item) => (
                        <Link to={item.href} key={item.name} onClick={() => setSidebarOpen(false)} className={linkClasses(item.href)}>
                            <item.icon className="w-5 h-5 mr-4" aria-hidden="true" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-lg text-red-600 bg-red-100 hover:bg-red-200 transition">
                        <LogOut className="w-5 h-5 mr-3" aria-hidden="true" />
                        Logout ({user.email})
                    </button>
                </div>
            </div>
            {/* Overlay per chiusura sidebar mobile */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden"></div>
            )}
        </>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-auto">
                <header className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white shadow-sm">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-700 hover:text-indigo-600 lg:hidden" aria-label="Apri sidebar">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-semibold hidden lg:block text-gray-800">Benvenuto, {user.email.split('@')[0]}</h2>
                    <div className="flex items-center space-x-4">{/* spazio per eventuali pulsanti aggiuntivi */}</div>
                </header>
                <main className="flex-1 p-6">
                    <Outlet context={{ user, isAdmin, supabase }} />
                </main>
                <footer className="p-4 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
                    © 2025 Padel Tracker - Tutti i diritti riservati.
                </footer>
            </div>
        </div>
    );
};

export default DashboardWrapper;
