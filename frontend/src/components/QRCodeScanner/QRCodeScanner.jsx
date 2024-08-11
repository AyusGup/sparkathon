import React, { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import './QRCodeScanner.css'; // Import the CSS file

const QRCodeScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const qrRef = useRef(null);

  const handleScan = (result) => {
    if (result?.text) {
      setScanResult(result.text);
      setIsScanning(false); // Stop scanning once a QR code is detected
    }
  };

  const handleError = (error) => {
    console.error('Error scanning QR code:', error);
  };

  const startScanning = () => {
    setScanResult('');
    setIsScanning(true);
  };

  return (
    <div className={`qr-scanner-page ${isScanning ? 'scanning' : ''}`}>
      <div className="qr-scanner-container">
        <h1>QR Code Scanner</h1>
        {isScanning ? (
          <div className="qr-scanner">
            <QrReader
              ref={qrRef}
              onResult={handleScan}
              onError={handleError}
              style={{ width: '100%' }}
            />
          </div>
        ) : (
          <>
            {scanResult && (
              <p className="scan-result">
                Scanned Text: {scanResult}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QRCodeScanner;
