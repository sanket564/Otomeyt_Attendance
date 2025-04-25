import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CheckInOutButton = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckInStatus = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5001/api/attendance/check-in-status'); // Replace with your actual API endpoint
        setIsCheckedIn(response.data.isCheckedIn);
      } catch (error) {
        setError('Could not fetch check-in status');
      }
    };

    fetchCheckInStatus();
  }, []);

  const handleCheckIn = async () => {
    try {
      await axios.post('http://127.0.0.1:5001/api/attendance/check-in'); // Replace with your actual API endpoint
      setIsCheckedIn(true);
    } catch (err) {
      setError('Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.post('http://127.0.0.1:5001/api/attendance/check-out'); // Replace with your actual API endpoint
      setIsCheckedIn(false);
    } catch (err) {
      setError('Check-out failed');
    }
  };

  return (
    <div>
      {error && <ErrorDisplay error={error} />}
      {isCheckedIn ? (
        <button onClick={handleCheckOut}>Check Out</button>
      ) : (
        <button onClick={handleCheckIn}>Check In</button>
      )}
    </div>
  );
};

export default CheckInOutButton;