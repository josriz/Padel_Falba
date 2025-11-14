// MarketplaceList.jsx
import React from 'react';

export default function MarketplaceList() {
  const items = [
    { id: 1, name: "Racchetta Drop Shot", price: "€150", condition: "Usata (Ottime condizioni)" },
    { id: 2, name: "Scarpe Padel N.43", price: "€60", condition: "Usate (Buone condizioni)" },
    { id: 3, name: "Overgrip (Pack 3)", price: "€10", condition: "Nuovo" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Marketplace 🛍️</h2>
      <p>Lista degli annunci pubblicati dagli utenti del club.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {items.map(item => (
          <div key={item.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#007bff' }}>{item.name}</h3>
            <p style={{ margin: '0 0 5px 0' }}>Prezzo: <strong>{item.price}</strong></p>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9em', color: '#666' }}>Condizione: {item.condition}</p>
            <a href={`/dashboard/marketplace/${item.id}`} style={{ color: 'red', textDecoration: 'none', fontWeight: 'bold' }}>
                Visualizza Dettagli &raquo;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}