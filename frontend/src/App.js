import React, { useState, useEffect } from 'react';

function App() {
  // Aici vom ține lista de subscripții care vin de la colega ta
  const [subscriptii, setSubscriptii] = useState([]);

  useEffect(() => {
    // Încercăm să luăm datele de la Backend-ul Java (care stă pe portul 8080)
    fetch('http://localhost:8080/api/subscriptions')
      .then(response => response.json())
      .then(data => setSubscriptii(data))
      .catch(err => console.log("Bucătăria (Backend-ul) nu a răspuns încă. E normal dacă nu l-am pornit!"));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Manager Subscripții - SubMng Team</h1>
      <p>Acesta este spațiul meu de lucru pentru [SCRUM-11]</p>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', display: 'inline-block' }}>
        <h3>Lista mea de subscripții:</h3>
        {subscriptii.length > 0 ? (
          <ul>
            {subscriptii.map(sub => <li key={sub.id}>{sub.name}</li>)}
          </ul>
        ) : (
          <p>Momentan nu sunt date. Trebuie să pornim Docker!</p>
        )}
      </div>
    </div>
  );
}

export default App;