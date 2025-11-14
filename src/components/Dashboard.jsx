import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const { user } = useOutletContext();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 600;

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Errore nel fetch del profilo:', error);
    } else {
      setProfileData(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  let displayName = user?.email || 'Utente';
  if (profileData?.full_name) {
    displayName = profileData.full_name.split(' ')[0];
  } else if (user?.user_metadata?.full_name) {
    displayName = user.user_metadata.full_name.split(' ')[0];
  }

  if (loading) {
    return <p className="text-center p-12 text-gray-600">Caricamento dati dashboard...</p>;
  }

  return (
    <div className={`max-w-5xl mx-auto px-4 ${isMobile ? 'py-6' : 'py-10'}`}>
      <h1 className={`text-blue-600 font-extrabold ${isMobile ? 'text-2xl' : 'text-4xl'} mb-8`}>
        👋 Benvenuto, <span className="font-black">{displayName}</span>!
      </h1>

      {/* Spazio libero per contenuti amministrativi dinamici */}

    </div>
  );
};

export default Dashboard;
