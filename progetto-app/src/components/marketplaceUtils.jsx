// src/components/marketplaceUtils.js

// Controlla se un articolo è "NUOVO" (pubblicato negli ultimi X giorni)
export const isNewItem = (createdAt, days = 3) => {
  const itemDate = new Date(createdAt);
  const today = new Date();
  const diffDays = (today - itemDate) / (1000 * 60 * 60 * 24);
  return diffDays <= days;
};

// Categorie disponibili nel marketplace
export const categories = [
  { value: '', label: 'Tutte le categorie' },
  { value: 'racchette', label: 'Racchette' },
  { value: 'scarpe', label: 'Scarpe' },
  { value: 'abbigliamento', label: 'Abbigliamento' },
];

// Funzioni di ordinamento comuni
export const sortItems = (items, option) => {
  const sorted = [...items];
  if (option === 'priceAsc') sorted.sort((a, b) => a.prezzo - b.prezzo);
  if (option === 'priceDesc') sorted.sort((a, b) => b.prezzo - a.prezzo);
  if (option === 'recent') sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return sorted;
};
