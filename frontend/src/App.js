import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import BookingPage from './components/BookingPage/BookingPage';
import KioskDetails from './components/KioskDetails/KioskDetails';
import AdminPage from './components/AdminPage/AdminPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/book-slot/:code" element={<BookingPage />} />
        <Route path="/kiosk-details" element={<KioskDetails />} />
        <Route path="/admin" element={<AdminPage />} /> {/* Add route for AdminPage */}
      </Routes>
    </Router>
  );
};

export default App;
