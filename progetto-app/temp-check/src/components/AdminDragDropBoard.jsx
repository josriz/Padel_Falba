// AdminDragDropBoard.jsx - DRAG & DROP TABLET PADDEL
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminDragDropBoard() {
  const [torneoId, setTorneoId] = useState('');
  const [iscritti, setIscritti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (torneoId) fetchIscritti();
  }, [torneoId]);

  const fetchIscritti = async () => {
    const { data } = await supabase
      .from('tournaments')
      .select('id, nome')
      .eq('id', torneoId)
      .single();
    
    if (data) {
      const { data: regs } = await supabase
        .from('tournament_registrations')
        .select('id, nome, cognome')
        .eq('tournament_id', torneoId);
      setIscritti(regs || []);
    }
    setLoading(false);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(iscritti);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    // ✅ SALVA POSIZIONE NUOVA SU SUPABASE
    for (let i = 0; i < items.length; i++) {
      await supabase
        .from('tournament_registrations')
        .update({ posizione: i + 1 })
        .eq('id', items[i].id);
    }
    
    setIscritti(items);
  };

  if (loading) return <div>⏳ Caricamento...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <h1 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        🎾 DRAG & DROP TABELLONE ADMIN
      </h1>

      {/* SELEZIONA TORNEA */}
      <select 
        value={torneoId}
        onChange={(e) => setTorneoId(e.target.value)}
        className="w-full max-w-md mx-auto p-4 mb-8 border-2 border-blue-200 rounded-2xl text-xl font-bold"
      >
        <option value="">Seleziona Torneo</option>
        {/* Popola con API */}
      </select>

      {/* DRAG & DROP LISTA */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="iscritti">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {iscritti.map((giocatore, index) => (
                <Draggable key={giocatore.id} draggableId={giocatore.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-6 bg-white rounded-2xl shadow-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all cursor-grab active:cursor-grabbing flex items-center space-x-4"
                    >
                      <div className="text-2xl">🎾</div>
                      <div>
                        <div className="font-black text-xl">{giocatore.nome} {giocatore.cognome}</div>
                        <div className="text-sm text-gray-500">Pos: {index + 1}</div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-12 text-center">
        <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl">
          ✅ GENERA TABELLONE AUTOMATICO
        </button>
      </div>
    </div>
  );
}
