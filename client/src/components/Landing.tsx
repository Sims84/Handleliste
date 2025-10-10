import React from 'react';

export default function Landing() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <header>
        <h1>🛒 Handleliste & Oppskrifter</h1>
        <p>Planlegg middager og lag handleliste - sikker og personlig</p>
      </header>
      
      <main style={{ marginTop: '3rem' }}>
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto',
          padding: '2rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2>Velkommen!</h2>
          <p>
            Dette er din personlige handleliste-app hvor du kan:
          </p>
          <ul style={{ textAlign: 'left', margin: '1rem 0' }}>
            <li>📝 Lage og administrere handlelister</li>
            <li>🍽️ Planlegge måltider med oppskrifter</li>
            <li>💾 Lagre alt sikkert i skyen</li>
            <li>📱 Få tilgang fra alle enheter</li>
          </ul>
          
          <button
            onClick={() => window.location.href = '/api/login'}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Logg inn for å komme i gang
          </button>
        </div>
      </main>
    </div>
  );
}