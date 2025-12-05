// src/context/AuthProvider.jsx - ✅ SUPERADMIN + FIX LOGIN/LOGOUT COMPLETI!
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

  // ✅ FIX 1: PULISCI SESSIONE VECCHIA ALL'AVVIO
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Forza logout sessione corrotta
        await supabase.auth.signOut().catch(() => {});
        
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // ✅ SUPERADMIN + ADMIN + PLAYER
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

  // ✅ FIX 2: LISTENER SUPABASE OTTIMIZZATO CON SUPERADMIN
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth event:', event, session?.user?.email || 'no user');
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        // ✅ SUPERADMIN DETECTION
        const metadataRole = session?.user?.user_metadata?.role ?? 
                            session?.user?.app_metadata?.role ?? 'player';
        setRole(metadataRole);
        console.log('👑 Role detected:', metadataRole);
      } else if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        setRole('guest');
        localStorage.clear();
        sessionStorage.clear();
        console.log('🚪 Logout COMPLETO');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    role,
    loading,
    // ✅ SUPERADMIN + ADMIN DETECTION
    isAdmin: role === 'admin',
    isSuperAdmin: role === 'superadmin',
    isGuest: role === 'guest',
    // ✅ BACKWARD COMPATIBILITY
    isPlayer: role === 'player' || role === 'user',
    
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    login: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    signUp: async (email, password) => {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    },
    // ✅ FIX 3: LOGOUT BULLET-PROOF
    signOut: async () => {
      try {
        console.log('🔄 Logout SUPABASE...');
        await supabase.auth.signOut();
        setUser(null);
        setRole('guest');
        localStorage.clear();
        sessionStorage.clear();
        console.log('✅ Logout SUCCESS');
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        // ✅ FORCE REDIRECT SEMPRE
        window.location.href = '/login';
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
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
