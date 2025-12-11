import React from "react";
import MarketplaceGestion from "./MarketplaceGestion";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../supabaseClient";

export default function MarketplaceAdmin() {
  const { user } = useAuth();
  return <MarketplaceGestion user={user} supabase={supabase} isAdmin={true} />;
}
