import React, { useState } from 'react';

const SuperAdminPanel = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div>
      <h1>SUPERADMIN PANEL</h1>
      <button onClick={() => setShowInstructions(true)}>
        Mostra Istruzioni
      </button>
      
      {showInstructions && (
        <div>
          <h2>Istruzioni Aggiungi Admin:</h2>
          <p>1. Supabase Authentication Add user</p>
          <p>2. Email: admin1@cieffepadel.it</p>
          <p>3. Password: TempPass123!</p>
          <p>4. Metadata: role = admin</p>
          <p>5. Confirmed = TRUE</p>
          <p>6. CREATE USER</p>
          <p>Login: admin1@cieffepadel.it / TempPass123!</p>
          <button onClick={() => setShowInstructions(false)}>
            Chiudi
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPanel;
