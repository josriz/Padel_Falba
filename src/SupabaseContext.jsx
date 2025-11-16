import React, { createContext, useContext } from 'react';
import { supabase } from './supabaseClient';

const SupabaseContext = createContext(null);

export const SupabaseProvider = ({ children }) => {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) throw new Error('useSupabase deve essere usato dentro SupabaseProvider');
  return context;
};
