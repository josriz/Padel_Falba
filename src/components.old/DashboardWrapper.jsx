import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRunning, faCalendarAlt, faStore, faUser, faSignOutAlt, faCog, faTimes, faBars } from '@fortawesome/free-solid-svg-icons';

// --- STILE MINIMALE (Tailwind Classes) ---
// Normalmente useresti Tailwind CSS, ma per la compatibilità in ambiente limitato,
// uso stili inline che riflettono un layout moderno e responsivo.

const Header = ({ user, onLogout, isAdmin, toggleSidebar }) => {
    // LOG CRITICO 2: DEVE MOSTRARE 'true' se il primo log di App.jsx è 'true'
    console.log("DashboardWrapper: Il valore di isAdmin ricevuto è:", isAdmin);

    return (
        <header className="bg-gray-900 text-white p-4 shadow-lg flex justify-between items-center sticky top-0 z-20">
            {/* Logo e Toggle */}
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="text-xl mr-4 md:hidden">
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <Link to="/dashboard" className="text-2xl font-bold tracking-wider hover:text-green-400 transition-colors">
                    Padel App
                </Link>
            </div>

            {/* Azioni Utente e Admin */}
            <div className="flex items-center space-x-4">
                {/* Visualizzazione Condizionale Admin */}
                {isAdmin && (
                    <Link to="/dashboard/admin" title="Controlli Admin" className="text-xl p-2 hover:text-green-400 transition-colors">
                        <FontAwesomeIcon icon={faCog} /> {/* Ingranaggio Admin */}
                    </Link>
                )}

                <Link to="/dashboard/profilo" title="Profilo Utente" className="text-xl p-2 hover:text-green-400 transition-colors">
                    <FontAwesomeIcon icon={faUser} />
                </Link>
                <button 
                    onClick={onLogout} 
                    title="Esci"
                    className="text-xl p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
            </div>
        </header>
    );
};

const Sidebar = ({ user, isAdmin, isSidebarOpen, toggleSidebar }) => {
    const navItems = [
        { path: 'eventi', name: 'Eventi & Tornei', icon: faRunning },
        { path: 'prenotazioni', name: 'Prenota Campi', icon: faCalendarAlt },
        { path: 'marketplace', name: 'Marketplace', icon: faStore },
    ];

    // Classi per la sidebar (responsività)
    const sidebarClasses = `
        fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 shadow-xl z-30 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:w-64
    `;

    return (
        <aside className={sidebarClasses}>
            {/* Bottone di chiusura per Mobile */}
            <div className="flex justify-end md:hidden">
                <button onClick={toggleSidebar} className="text-2xl p-2 hover:text-red-400">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            
            <h2 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-4 text-green-400">Navigazione</h2>
            
            <nav>
                <ul className="space-y-2">
                    {navItems.map(item => (
                        <li key={item.path}>
                            <Link 
                                to={item.path} 
                                className="flex items-center p-3 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                                onClick={toggleSidebar} // Chiude la sidebar dopo aver cliccato su mobile
                            >
                                <FontAwesomeIcon icon={item.icon} className="w-5 mr-3 text-green-400" />
                                {item.name}
                            </Link>
                        </li>
                    ))}
                    {/* Link Admin sempre in fondo, visibile solo se isAdmin è TRUE */}
                    {isAdmin && (
                        <li className="pt-4 border-t border-gray-700">
                            <Link 
                                to="admin" 
                                className="flex items-center p-3 rounded-lg text-sm bg-red-600 hover:bg-red-700 transition-colors"
                                onClick={toggleSidebar} // Chiude la sidebar dopo aver cliccato su mobile
                            >
                                <FontAwesomeIcon icon={faCog} className="w-5 mr-3" />
                                Area Amministrativa
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </aside>
    );
};


export default function DashboardWrapper({ user, isAdmin, onLogout }) {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Lo sfondo scuro (overlay) appare solo in modalità mobile quando la sidebar è aperta
    const overlayClasses = `
        fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden
        ${isSidebarOpen ? 'block' : 'hidden'}
    `;

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header user={user} onLogout={onLogout} isAdmin={isAdmin} toggleSidebar={toggleSidebar} />
            
            {/* Overlay Mobile */}
            <div className={overlayClasses} onClick={toggleSidebar}></div>

            <div className="flex flex-1 overflow-hidden">
                <Sidebar user={user} isAdmin={isAdmin} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                
                <main className="flex-1 p-4 overflow-y-auto">
                    {/* Qui vengono renderizzati i contenuti delle rotte annidate (eventi, prenotazioni, etc.) */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}