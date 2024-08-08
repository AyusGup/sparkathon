import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './KioskDetails.css'; // Ensure this CSS file is created

const KioskDetails = () => {
  const { code } = useParams();
  const [kioskDetails, setKioskDetails] = useState(null);

  useEffect(() => {
    const fetchKioskDetails = async () => {
      try {
        const response = await fetch(`/api/kiosk/${code}`);
        const data = await response.json();
        setKioskDetails(data);
      } catch (error) {
        console.error('Error fetching kiosk details:', error);
      }
    };

    fetchKioskDetails();
  }, [code]);

  return (
    <div className="kiosk-details-container">
      {kioskDetails ? (
        <div className="kiosk-details">
          <h1>Kiosk Details</h1>
          <p>Kiosk ID: {kioskDetails.id}</p>
          <p>Expected Service Time: {kioskDetails.expectedTime}</p>
          <p>Counter Number: {kioskDetails.counterNumber}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default KioskDetails;
