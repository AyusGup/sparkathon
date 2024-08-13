import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/socketContext';
import './MainPage.css'; 

const MainPage = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const socket = useSocket();

  const handleCodeSubmit = () => {
    socket.emit('add-customer',code);
    socket.on('registered-customer', (ticket) => {
      let ti = encodeURIComponent(JSON.stringify(ticket));
      navigate(`/kiosk-details/${ti}`);
    });
  };  
  return (
    <div className="main-page main-background">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter Code"
      />
      <button onClick={handleCodeSubmit} className="submit-button">
        Submit Code
      </button>
      <h1 className='text-background'>OR</h1>
      <button onClick={() => navigate('/scan-qr-code')} className="scan-button">
        Scan QR Code
      </button>
    </div>
  );
};

export default MainPage;
