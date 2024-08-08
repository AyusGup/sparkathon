import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css'; 
import axios from 'axios';

const MainPage = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleCodeSubmit = () => {
    axios.post(`http://localhost:8080/kiosk/${code}/add-customer`)
      .then((response) => {
        // Convert the entire response data to a JSON string and encode it for the URL
        let ticket = encodeURIComponent(JSON.stringify(response.data));
        navigate(`/kiosk-details/${ticket}`);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        // Handle the error as needed, e.g., showing a message to the user
      });
  };  

  return (
    <div className="main-page">
      <h1>QR Code Scanner or Enter Code</h1>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter Code"
      />
      <button onClick={handleCodeSubmit} className="submit-button">
        Submit Code
      </button>
      <button onClick={() => navigate('/scan-qr-code')} className="scan-button">
        Scan QR Code
      </button>
    </div>
  );
};

export default MainPage;
