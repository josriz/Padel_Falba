export default function Dashboard({ user, onLogout, isAdmin }) {
  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>Benvenuto, {user.email}</h1>
      <p>Questa è la tua dashboard di vetrina.</p>
      {isAdmin && (
        <p style={{ fontWeight: "bold", color: "green" }}>
          Puoi variare e modificare i dati come amministratore.
        </p>
      )}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button
          onClick={onLogout}
          style={{
            padding: "10px 16px",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
