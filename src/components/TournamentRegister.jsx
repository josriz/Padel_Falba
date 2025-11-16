import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function TournamentRegister() {
    const { user, supabase } = useOutletContext();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        setLoading(true);
        setMessage('');
        try {
            const { error } = await supabase
                .from('tournament_players')
                .insert([{ 
                    user_id: user.id, 
                    email: user.email,
                    created_at: new Date()
                }]);
            if (error) throw error;
            setMessage('✅ Iscrizione avvenuta!');
        } catch (err) {
            console.error(err);
            setMessage('❌ Errore iscrizione: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Iscrizione Torneo</h3>
            <button
                onClick={handleRegister}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
                {loading ? 'Caricamento...' : 'Iscriviti'}
            </button>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
