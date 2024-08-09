import {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/socketContext';
import axios from 'axios';
import './KioskDetails.css'; // Ensure this CSS file is created

const KioskDetails = () => {
  const { kioskId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [customerData, setCustomerData] = useState(null);
  const [timeLeft, setTimeLeft] = useState('05:00'); // Initial state for 5 minutes
  const [isActive, setIsActive] = useState(false); // State to control timer start
  const [isRejoin, setRejoin] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    if (kioskId) {
      try {
        // Step 2: Decode the URL-encoded string
        const decodedTicket = decodeURIComponent(kioskId);
        
        // Step 3: Parse the JSON string into an object
        const parsedData = JSON.parse(decodedTicket);
        
        // Step 4: Save the data in state
        setCustomerData(parsedData);
        if(socket){
          socket.on('update-top-10', ({ kioskId, top10 }) => {
            console.log('Received updated top 10: i got the alert',);

            setAlert(true);
          });
          return () => {
            socket.off('update-top-10');
          };
        }
        
        } catch (error) {
        console.error('Failed to decode and parse ticket:', error);
      }
    }
  }, [socket,kioskId]);

  useEffect(() => {
    let timerInterval;

    if (isActive) {
      const targetTime = Date.now() + 30 * 1000; // Set the target time to 5 minutes from now

      const updateTimer = () => {
        const now = Date.now();
        const timeRemaining = targetTime - now;

        if (timeRemaining <= 0) {
          clearInterval(timerInterval);
          setTimeLeft('00:00');
          setIsActive(false);
          setRejoin(true);
          return;
        }

        const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60).toString().padStart(2, '0');
        const seconds = Math.floor((timeRemaining / 1000) % 60).toString().padStart(2, '0');

        setTimeLeft(`${minutes}:${seconds}`);
      };

      timerInterval = setInterval(updateTimer, 1000);
      updateTimer(); // Run immediately to set initial time

      return () => clearInterval(timerInterval); // Cleanup interval on component unmount or when timer stops
    }
  }, [isActive]);

  function formatTimestampToTime(expiresAt) {
    const date = new Date(expiresAt);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    return `${hours}:${minutes}:${seconds}`;
  }

  const startTimer = () => {
    setIsActive(true);   // call the function to trigger timer
  };

  const handleSubmit = () => {
    axios.post(`http://localhost:8000/kiosk/${customerData.kioskId}/add-customer`)
      .then((response) => {
        socket.emit('register-customer', response.data.id);
        setCustomerData(response.data);
        setRejoin(false);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        // Handle the error as needed, e.g., showing a message to the user
      });
  };  

  return (
    <div className="kiosk-details-container">
      {customerData ? (
        isRejoin?
        <div>
          <h1>Oops Time Out !</h1>
          <button onClick={handleSubmit}>Rejoin the queue</button>
        </div>
        : 
        <div className="kiosk-details">
          <h1>Your Details</h1>
          <p>Token No: {customerData.id}</p>
          <p>Expected Service Time: {formatTimestampToTime(customerData.expiresAt)}</p>
          <div>
            <h1>Reach to Counter in next {timeLeft}</h1>
            <button onClick={startTimer} disabled={isActive}>
              Start 5-Minute Countdown
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default KioskDetails;
