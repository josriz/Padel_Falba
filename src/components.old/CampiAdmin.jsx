// CampiAdmin.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 

export default function CampiAdmin() {
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ 
        nome: '', 
        descrizione: '', 
        prezzo_ora: 15.00,
        is_coperto: false 
    });
    const [editingCourtId, setEditingCourtId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourts();
    }, []);

    // --- LOGICA READ (LETTURA) ---
    const fetchCourts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('campi')
            .select('*')
            .order('nome', { ascending: true }); 

        if (error) {
            console.error('Errore nel caricamento campi:', error);
            setError('Impossibile caricare i campi.');
        } else {
            setCourts(data);
            setError(null);
        }
        setLoading(false);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : (name === 'prezzo_ora' ? Number(value) : value)
        }));
    };

    const resetForm = () => {
        setForm({ 
            nome: '', 
            descrizione: '', 
            prezzo_ora: 15.00,
            is_coperto: false
        });
        setEditingCourtId(null);
    };

    // --- LOGICA CREATE/UPDATE (INSERIMENTO/MODIFICA) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = form;

        const query = editingCourtId
            ? supabase.from('campi').update(payload).eq('id', editingCourtId)
            : supabase.from('campi').insert([payload]);

        const { error } = await query;

        if (error) {
            // Controlla per l'errore di violazione di UNIQUE (nome campo)
            if (error.code === '23505' && error.details.includes('nome')) {
                setError("Errore: Esiste già un campo con questo nome.");
            } else {
                console.error('Errore nel salvataggio campo:', error);
                setError(`Errore nel salvataggio: ${error.message}`);
            }
        } else {
            fetchCourts(); 
            resetForm();   
            alert(`Campo ${editingCourtId ? 'modificato' : 'creato'} con successo!`);
            setError(null);
        }
    };

    // --- LOGICA UPDATE (Carica Dati per Modifica) ---
    const handleEdit = (court) => {
        setEditingCourtId(court.id);
        setForm({
            nome: court.nome,
            descrizione: court.descrizione,
            prezzo_ora: court.prezzo_ora,
            is_coperto: court.is_coperto,
        });
        setError(null);
    };
    
    // --- LOGICA DELETE (CANCELLAZIONE) ---
    const handleDelete = async (id) => {
        if (!window.confirm("ATTENZIONE: Eliminare un campo elimina anche tutte le prenotazioni ad esso associate. Sei sicuro?")) {
            return;
        }

        const { error } = await supabase
            .from('campi')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Errore nell\'eliminazione campo:', error);
            setError(`Errore nell\'eliminazione: ${error.message}`);
        } else {
            fetchCourts();
            alert('Campo eliminato con successo!');
            setError(null);
        }
    };

    if (loading) return <p>Caricamento dati campi...</p>;

    return (
        <div>
            <h3>{editingCourtId ? 'Modifica Campo Esistente' : 'Aggiungi Nuovo Campo'}</h3>
            
            {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}

            {/* --- FORM DI CREAZIONE/MODIFICA --- */}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '30px' }}>
                <input type="text" name="nome" value={form.nome} onChange={handleFormChange} placeholder="Nome Campo (es. Centrale, Coperto A)" required />
                <input type="number" name="prezzo_ora" value={form.prezzo_ora} onChange={handleFormChange} placeholder="Prezzo/Ora (€)" required min="0" step="0.5" />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" id="is_coperto" name="is_coperto" checked={form.is_coperto} onChange={handleFormChange} />
                    <label htmlFor="is_coperto">Campo Coperto</label>
                </div>

                <textarea name="descrizione" value={form.descrizione} onChange={handleFormChange} placeholder="Descrizione del campo (Optional)" style={{ gridColumn: '1 / 3' }} />
                
                <div style={{ gridColumn: '1 / 3', display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
                    <button type="submit" style={{ backgroundColor: editingCourtId ? 'orange' : '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {editingCourtId ? 'Salva Modifiche Campo' : 'Crea Campo'}
                    </button>
                    {editingCourtId && (
                        <button type="button" onClick={resetForm} style={{ backgroundColor: 'gray', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Annulla Modifica
                        </button>
                    )}
                </div>
            </form>

            {/* --- LISTA DEI CAMPI --- */}
            <h3>Campi Attualmente Registrati ({courts.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {courts.map((court) => (
                    <div key={court.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: court.is_coperto ? '#f0f8ff' : '#ffffff' }}>
                        <div>
                            <strong>{court.nome}</strong> | €{court.prezzo_ora.toFixed(2)}/h
                            <p style={{ margin: '5px 0 0', fontSize: '0.9em', color: '#666' }}>
                                Tipo: {court.is_coperto ? 'Coperto' : 'Scoperto'}
                            </p>
                        </div>
                        <div>
                            <button onClick={() => handleEdit(court)} style={{ marginRight: '10px', backgroundColor: '#ffc107', color: '#333', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Modifica
                            </button>
                            <button onClick={() => handleDelete(court.id)} style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Elimina
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}