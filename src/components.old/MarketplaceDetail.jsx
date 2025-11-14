// MarketplaceDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function MarketplaceDetail({ user }) {
    const { id } = useParams(); // Cattura l'ID dall'URL (es. /marketplace/uuid-del-prodotto)
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchArticleDetail(id);
        }
    }, [id]);

    const fetchArticleDetail = async (articleId) => {
        setLoading(true);
        setError(null);

        // Fetch dell'articolo E del nome utente del venditore tramite JOIN implicito
        const { data, error } = await supabase
            .from('articoli_marketplace')
            .select(`
                *,
                profiles (username)
            `)
            .eq('id', articleId)
            .single();

        if (error || !data) {
            console.error('Errore nel caricamento dettagli articolo:', error);
            setError("Articolo non trovato o errore di caricamento.");
            setLoading(false);
        } else {
            setArticle(data);
            setLoading(false);
        }
    };

    if (loading) return <p style={{ padding: '20px' }}>Caricamento dettagli articolo...</p>;
    if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;
    if (!article) return <p style={{ padding: '20px' }}>Nessun articolo trovato.</p>;

    // Funzione per contattare (simulata)
    const handleContact = () => {
        alert(`Contatta il venditore: ${article.profiles.username}. Implementa qui la logica di email/chat.`);
        // Qui andrebbe la logica per aprire un modulo di contatto o reindirizzare a una chat.
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <button onClick={() => navigate('/marketplace')} style={{ marginBottom: '20px', backgroundColor: '#6c757d', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                &larr; Torna al Marketplace
            </button>

            <h1 style={{ color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>{article.nome}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginTop: '20px' }}>
                {/* Immagine (Placeholder) */}
                <div style={{ height: '250px', backgroundColor: '#e9ecef', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9em', color: '#6c757d' }}>
                    [Immagine Prodotto]
                </div>
                
                {/* Dettagli Principali */}
                <div>
                    <h2 style={{ color: '#28a745', fontSize: '2.5em', margin: 0 }}>€{article.prezzo.toFixed(2)}</h2>
                    <p style={{ fontSize: '1.1em', marginTop: '10px' }}>
                        **Condizione:** {article.condizione}
                    </p>
                    <p>
                        **Venditore:** {article.profiles.username}
                    </p>
                    <p style={{ marginTop: '20px', lineHeight: '1.6' }}>
                        **Descrizione Dettagliata:** <br />
                        {article.descrizione}
                    </p>

                    {user && user.id !== article.utente_id && (
                        <button
                            onClick={handleContact}
                            style={{
                                marginTop: '30px',
                                padding: '12px 25px',
                                backgroundColor: '#ffc107',
                                color: 'black',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Contatta il Venditore
                        </button>
                    )}
                </div>
            </div>
            
        </div>
    );
}