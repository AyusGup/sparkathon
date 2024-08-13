import React, { useState } from 'react';
import './App.css';
import Html5QrcodePlugin from './Html5QrcodePlugin.jsx'
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/socketContext';

const QRCodeScanner = () => {
    const [decodedResults, setDecodedResults] = useState(null);
    const navigate = useNavigate();
    const socket = useSocket();
    const onNewScanResult = (decodedText, decodedResult) => {
        setDecodedResults(decodedResult);
        // Emit socket event after successful scan
        socket.emit('add-customer', decodedResult);

        // Listen for the response and redirect
        socket.once('registered-customer', (ticket) => {
            let ti = encodeURIComponent(JSON.stringify(ticket));
            navigate(`/kiosk-details/${ti}`);
        });
    };

    return (
        <div className="App">
            <section className="App-section">
                <div className="App-section-title"> Html5-qrcode React demo</div>
                <br />
                <br />
                <br />
                <Html5QrcodePlugin
                    fps={10}
                    qrbox={250}
                    disableFlip={false}
                    qrCodeSuccessCallback={onNewScanResult}
                />
                
            </section>
        </div>
    );
};

export default QRCodeScanner;
