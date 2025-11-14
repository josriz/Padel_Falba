import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import logo from "../assets/logo.png";

export default function Marketplace({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchProducts();
    if (user?.email?.endsWith("@admin.com")) setIsAdmin(true);
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setProducts(data);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto", padding: 16, fontFamily: "Arial, sans-serif" }}>
      <img src={logo} alt="Logo" width={120} style={{ marginBottom: 16 }} />
      <h2>Marketplace</h2>
      {isAdmin && (
        <button
          onClick={() => window.location.href = "/admin-marketplace"}
          style={{ marginBottom: 16, padding: "8px 16px", cursor: "pointer" }}
        >
          Gestisci Prodotti
        </button>
      )}
      {loading ? <p>Caricamento prodotti...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 16 }}>
          {products.map(product => (
            <div key={product.id} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, textAlign: "center" }}>
              {product.image_url && <img src={product.image_url} alt={product.name} style={{ maxHeight: 150, marginBottom: 8 }} />}
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p style={{ fontWeight: "bold" }}>€ {product.price}</p>
              <button onClick={() => alert("Aggiunto al carrello!")}>Aggiungi al Carrello</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
