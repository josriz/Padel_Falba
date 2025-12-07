// src/context/AuthProvider.jsx - RENDER.COM FIX (tutto preservato)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve essere usato dentro AuthProvider');
  return context;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const metadataRole = session?.user?.user_metadata?.role ?? 
                              session?.user?.app_metadata?.role ?? 'player';
          setRole(metadataRole);
        } else {
          setUser(null);
          setRole('guest');
        }
      } catch (err) {
        console.error('Auth init error:', err);
        setUser(null);
        setRole('guest');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth event:', event, session?.user?.email || 'no user');
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const metadataRole = session?.user?.user_metadata?.role ?? 
                            session?.user?.app_metadata?.role ?? 'player';
        setRole(metadataRole);
      } else if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        setRole('guest');
        if (typeof window !== 'undefined') {
          localStorage.clear();
          sessionStorage.clear();
        }
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const value = {
    user,
    role,
    loading,
    isAdmin: role === 'admin',
    isSuperAdmin: role === 'superadmin',
    isGuest: role === 'guest',
    isPlayer: role === 'player' || role === 'user',
    
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    
    signUp: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { role: 'player' } }
      });
      if (error) throw error;
      return data;
    },
    
    signOut: async () => {
      try {
        console.log('🔄 Logout WEB...');
        await supabase.auth.signOut();
        
        setUser(null);
        setRole('guest');
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('supabase.auth.token');
          localStorage.clear();
          sessionStorage.clear();
          
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
              registrations.forEach(registration => registration.unregister());
            });
          }
        }
        
      } catch (err) {
        console.error('Logout error:', err);
      }
      
      // 🔧 RENDER.COM FIX: ROOT redirect
      window.location.href = '/';
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Inizializzazione...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
