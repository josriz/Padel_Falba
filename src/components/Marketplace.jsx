// src/components/Marketplace.jsx - ✅ INTEGRATORE COMPLETO
import React from 'react';
import { useAuth } from '../context/AuthProvider';
import MarketplaceList from './MarketplaceList';
import MarketplaceUser from './MarketplaceUser';
import MarketplaceGestion from './MarketplaceGestion';
import MarketplaceAdmin from './MarketplaceAdmin';

export default function Marketplace() {
  const { isAdmin } = useAuth();
  
  console.log('🔥 MARKETPLACE RENDER:', { isAdmin });
  
  // ✅ LOGICA INTEGRATA:
  // Admin → MarketplaceAdmin (gestione completa)
  // User → MarketplaceUser (lista utenti migliorata)
  // Fallback → MarketplaceList (lista originale)
  
  if (isAdmin) {
    return <MarketplaceAdmin />;
  }
  
  return <MarketplaceUser />;
}
