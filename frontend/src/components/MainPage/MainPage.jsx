import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css'; // Ensure this CSS file is created

const MainPage = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleCodeSubmit = () => {
    if (code.trim()) {
      navigate(`/book-slot/${code}`);
    }
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
