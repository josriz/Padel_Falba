// MarketplaceAdmin.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 

export default function MarketplaceAdmin() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ 
        nome: '', 
        descrizione: '', 
        prezzo: 0,
        condizione: 'Nuovo' // Aggiungiamo un campo di esempio
    });
    const [editingArticleId, setEditingArticleId] = useState(null);
    const [error, setError] = useState(null);

    // Condizioni possibili per il select/dropdown
    const condizioniOptions = ['Nuovo', 'Ottime condizioni', 'Buone condizioni', 'Usurato'];

    useEffect(() => {
        fetchArticles();
    }, []);

    // --- LOGICA READ (LETTURA) ---
    const fetchArticles = async () => {
        setLoading(true);
        // Legge tutti gli articoli per l'admin
        const { data, error } = await supabase
            .from('articoli_marketplace')
            .select('*')
            .order('created_at', { ascending: false }); 

        if (error) {
            console.error('Errore nel caricamento articoli:', error);
            setError('Impossibile caricare gli articoli del Marketplace.');
        } else {
            setArticles(data);
            setError(null);
        }
        setLoading(false);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ 
            ...prev, 
            [name]: name === 'prezzo' ? Number(value) : value 
        }));
    };

    const resetForm = () => {
        setForm({ 
            nome: '', 
            descrizione: '', 
            prezzo: 0,
            condizione: 'Nuovo'
        });
        setEditingArticleId(null);
    };

    // --- LOGICA CREATE/UPDATE (INSERIMENTO/MODIFICA) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const user = supabase.auth.user();
        if (!user) {
            setError("Devi essere loggato per eseguire questa azione.");
            return;
        }

        // L'admin inserisce l'articolo come se fosse un utente, quindi serve il user.id
        const payload = editingArticleId ? form : { ...form, utente_id: user.id };

        const query = editingArticleId
            ? supabase.from('articoli_marketplace').update(payload).eq('id', editingArticleId).select()
            : supabase.from('articoli_marketplace').insert([payload]).select();

        const { error } = await query;

        if (error) {
            console.error('Errore nel salvataggio articolo:', error);
            setError(`Errore nel salvataggio: ${error.message}`);
        } else {
            fetchArticles(); 
            resetForm();   
            alert(`Articolo ${editingArticleId ? 'modificato' : 'creato'} con successo!`);
        }
    };

    // --- LOGICA UPDATE (Carica Dati per Modifica) ---
    const handleEdit = (article) => {
        setEditingArticleId(article.id);
        setForm({
            nome: article.nome,
            descrizione: article.descrizione,
            prezzo: article.prezzo,
            condizione: article.condizione,
        });
    };
    
    // --- LOGICA DELETE (CANCELLAZIONE) ---
    const handleDelete = async (id) => {
        if (!window.confirm("Sei sicuro di voler eliminare questo articolo dal Marketplace?")) {
            return;
        }

        const { error } = await supabase
            .from('articoli_marketplace')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Errore nell\'eliminazione articolo:', error);
            setError(`Errore nell\'eliminazione: ${error.message}`);
        } else {
            fetchArticles();
            alert('Articolo eliminato con successo!');
        }
    };

    if (loading) return <p>Caricamento articoli...</p>;

    return (
        <div>
            <h3>{editingArticleId ? 'Modifica Articolo' : 'Crea Nuovo Articolo'} nel Marketplace</h3>
            
            {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}

            {/* --- FORM DI CREAZIONE/MODIFICA --- */}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '30px' }}>
                <input type="text" name="nome" value={form.nome} onChange={handleFormChange} placeholder="Nome Articolo" required />
                <input type="number" name="prezzo" value={form.prezzo} onChange={handleFormChange} placeholder="Prezzo (€)" required min="0" />
                
                <select name="condizione" value={form.condizione} onChange={handleFormChange} required>
                    {condizioniOptions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                </select>

                <textarea name="descrizione" value={form.descrizione} onChange={handleFormChange} placeholder="Descrizione dettagliata" required style={{ gridColumn: '1 / 3' }} />
                
                <div style={{ gridColumn: '1 / 3', display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ backgroundColor: editingArticleId ? 'orange' : 'green', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {editingArticleId ? 'Salva Modifiche Articolo' : 'Pubblica Articolo'}
                    </button>
                    {editingArticleId && (
                        <button type="button" onClick={resetForm} style={{ backgroundColor: 'gray', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Annulla Modifica
                        </button>
                    )}
                </div>
            </form>

            {/* --- LISTA DEGLI ARTICOLI --- */}
            <h3>Lista Articoli Marketplace ({articles.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {articles.map((article) => (
                    <div key={article.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>{article.nome}</strong> | €{article.prezzo.toFixed(2)}
                            <p style={{ margin: '5px 0 0', fontSize: '0.9em', color: '#666' }}>Condizione: {article.condizione}</p>
                        </div>
                        <div>
                            <button onClick={() => handleEdit(article)} style={{ marginRight: '10px', backgroundColor: '#007bff', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Modifica
                            </button>
                            <button onClick={() => handleDelete(article.id)} style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Elimina
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}