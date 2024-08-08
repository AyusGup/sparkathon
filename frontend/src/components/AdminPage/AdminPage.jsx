import React, { useEffect, useState } from 'react';
import './AdminPage.css'; // Ensure you create this CSS file for styling

const AdminPage = () => {
  const [kiosks, setKiosks] = useState([]);

  useEffect(() => {
    // Fetch kiosks and their token details from API
    const fetchKiosks = async () => {
      try {
        const response = await fetch('/api/kiosks');
        const data = await response.json();
        setKiosks(data);
      } catch (error) {
        console.error('Error fetching kiosks:', error);
      }
    };

    fetchKiosks();
  }, []);

  const handleRemoveToken = async (kioskId, tokenId) => {
    try {
      await fetch(`/api/kiosk/${kioskId}/remove-customer/${tokenId}`, {
        method: 'DELETE',
      });
      // Update state to reflect the removed token
      setKiosks(prevKiosks =>
        prevKiosks.map(kiosk =>
          kiosk.id === kioskId
            ? {
                ...kiosk,
                tokens: kiosk.tokens.filter(token => token.id !== tokenId),
              }
            : kiosk
        )
      );
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="kiosk-list">
        {kiosks.map(kiosk => (
          <div key={kiosk.id} className="kiosk">
            <h2>Kiosk ID: {kiosk.id}</h2>
            <ul className="token-list">
              {kiosk.tokens.map(token => (
                <li key={token.id} className="token-item">
                  <span>Token ID: {token.id}</span>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveToken(kiosk.id, token.id)}
                  >
                    Remove Token
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
