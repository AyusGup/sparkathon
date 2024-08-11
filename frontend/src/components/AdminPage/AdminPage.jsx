import React, { useEffect, useState } from 'react';
import './AdminPage.css'; // Ensure you create this CSS file for styling
import axios from 'axios';
const AdminPage = () => {
  const [kiosks, setKiosks] = useState([]);
  const [code, setCode] = useState('');
  const handleCodeSubmit = () => {
    axios.get(`${process.env.REACT_APP_API_URL}kiosk/${code}/first-10-tickets`)
      .then((response) => {
        setKiosks(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        // Handle the error as needed, e.g., showing a message to the user
      });
  }
  

  const handleRemoveToken = async (kioskId, tokenId) => {
      axios.delete(`${process.env.REACT_APP_API_URL}kiosk/${kioskId}/remove-customer/${tokenId}`)
      .then((response) => {
        setKiosks(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        // Handle the error as needed, e.g., showing a message to the user
      });
      
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter Code"
        className="search-container search-input"
      />
      <button onClick={handleCodeSubmit} className="submit-button">
        Search the ID 
      </button>
      <div className="kiosk-list">
        {kiosks.map(kiosk => (
            <li key={kiosk.id} className="token-item">
              <span>Customer ID: {kiosk.id}</span>
              <button
                className="remove-button"
                onClick={() => handleRemoveToken(code, kiosk.id)}
              >
                Remove customer
              </button>
            </li>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
