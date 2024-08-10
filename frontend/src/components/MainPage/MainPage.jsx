import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/socketContext';
import './MainPage.css'; 
import axios from 'axios';

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
    // axios.post(`http://localhost:8000/kiosk/${code}/add-customer`)
    //   .then((response) => {
    //     // Convert the entire response data to a JSON string and encode it for the URL
    //     let ticket = encodeURIComponent(JSON.stringify(response.data));
    //     socket.emit('register-customer', response.data.id);
    //     navigate(`/kiosk-details/${ticket}`);
    //   })
    //   .catch((error) => {
    //     console.error("An error occurred:", error);
    //     // Handle the error as needed, e.g., showing a message to the user
    //   });
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
