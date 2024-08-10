import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/socketContext';
import './KioskDetails.css'; // Ensure this CSS file is created

const KioskDetails = () => {
  const { kioskId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [customerData, setCustomerData] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [showRejoinButton, setShowRejoinButton] = useState(false); // State to control rejoin button visibility

  useEffect(() => {
    if (kioskId) {
      try {
        const decodedTicket = decodeURIComponent(kioskId);
        const parsedData = JSON.parse(decodedTicket);
        setCustomerData(parsedData);

        if (socket) {
          console.log('Socket connected:', socket);
          socket.on('update-top-10', ({ kioskId, top10 }) => {
            console.log('Received updated top 10: alert triggered');
            // Optional: You can handle alerts if needed
          });

          socket.on('customer-removed', () => {
            setShowRejoinButton(true);
          });

          return () => {
            socket.off('update-top-10');
            socket.off('customer-removed');
          };
        }
      } catch (error) {
        console.error('Failed to decode and parse ticket:', error);
      }
    }
  }, [socket, kioskId]);

  useEffect(() => {
    let timerInterval;
    if (customerData) {
      const updateTimeLeft = () => {
        const now = Date.now();
        const expiresAt = new Date(customerData.expiresAt).getTime();
        const timeRemaining = expiresAt - now;

        if (timeRemaining <= 0) {
          clearInterval(timerInterval);
          setTimeLeft('00:00');
          setShowRejoinButton(true); // Show the rejoin button when time is up
          return;
        }

        const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60).toString().padStart(2, '0');
        const seconds = Math.floor((timeRemaining / 1000) % 60).toString().padStart(2, '0');
        
        setTimeLeft(`${minutes}:${seconds}`);
      };

      updateTimeLeft();
      timerInterval = setInterval(updateTimeLeft, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [customerData]);

  const handleRejoin = async () => {
    try {
      // Remove the customer from the database
      await fetch(`/kiosk/${customerData.kioskId}/remove-customer/${customerData.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Set the expiration time to 5 minutes from now
      const newExpirationTime = new Date(Date.now() + 1 * 60 * 1000).toISOString();
  
      // Update the customer data with the new expiration time
      const updatedTicket = {
        ...customerData,
        expiresAt: newExpirationTime,
      };
  
      // Emit event to register the customer again
      socket.emit('add-customer', customerData.kioskId);
  
      // Listen for the response and then update the state
      socket.on('registered-customer', (ticket) => {
        const encodedTicket = encodeURIComponent(JSON.stringify(updatedTicket));
        setCustomerData(updatedTicket); // Set the updated customer data
        setShowRejoinButton(false); // Hide the rejoin button
        const url = `/kiosk-details/${encodedTicket}`;
        navigate(url, { replace: true }); // Reload the same page with updated ticket
      });
    } catch (error) {
      console.error('Failed to rejoin queue:', error);
      // Optionally handle errors here, e.g., show an alert to the user
    }
  };
  

  return (
    <>
    <div className="navbar">
                Thanks for ordering!
    </div>
    <div className="kiosk-details-container kiosk-background">
      {customerData ? (
        showRejoinButton ? (
          <div>
            <h1>Time Out! Please rejoin the queue.</h1>
            <button onClick={handleRejoin} style={{ color: 'white', backgroundColor: 'red' }}>
              Rejoin the queue
            </button>
          </div>
        ) : (
          <div className="kiosk-details">
            <h1>Your Details</h1>
            <p>Token No: {customerData.id}</p>
            <p>Expected Service Time: {new Date(customerData.expiresAt).toLocaleTimeString()}</p>
            <div>
              <h1>Reach the Counter in {timeLeft}</h1>
            </div>
          </div>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </>
  );
};

export default KioskDetails;
