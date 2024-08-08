import React from 'react';
import { QrReader } from 'react-qr-reader';
import './QRCodeScanner.css';

const QRCodeScanner = ({ onScanSuccess }) => {
  const handleScan = (result) => {
    if (result) {
      onScanSuccess(result.text); // Notify parent component of successful scan
    }
  };

  const handleError = (error) => {
    console.error('QR Code Scan Error:', error);
  };

  return (
    <div className="qr-scanner-container">
      <QrReader
        onResult={handleScan}
        onError={handleError}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default QRCodeScanner;
