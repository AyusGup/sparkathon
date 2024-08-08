import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './BookingPage.css'; // Ensure this CSS file is created

const BookingPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const handleBookSlot = () => {
    navigate(`/kiosk-details/${code}`);
  };

  return (
    <div className="booking-page">
      <h1>Book a Slot</h1>
      <form className="booking-form">
        <label htmlFor="slot">Select Slot:</label>
        <select id="slot" name="slot">
          <option value="slot1">Slot 1</option>
          <option value="slot2">Slot 2</option>
          <option value="slot3">Slot 3</option>
        </select>
        <button type="button" onClick={handleBookSlot} className="book-button">
          Book Slot
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
