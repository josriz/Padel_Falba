import React from 'react';
import { Outlet } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <header className="py-4 px-6 border-b border-gray-200 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Zap className="w-7 h-7 text-indigo-600" />
                        <span className="text-2xl font-extrabold text-gray-800 tracking-wide">Padel Tracker</span>
                    </div>
                </div>
            </header>
            <main className="flex flex-col items-center justify-center py-12 px-4 min-h-[calc(100vh-80px)]"> 
                <Outlet />
            </main>
        </div>
    );
}
