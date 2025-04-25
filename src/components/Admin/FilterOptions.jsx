import React, { useState } from 'react';

const FilterOptions = ({ onFilterChange }) => {
  const [date, setDate] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleDateChange = (e) => {
    setDate(e.target.value);
    onFilterChange({ date: e.target.value, userEmail });
  };

  const handleUserEmailChange = (e) => {
    setUserEmail(e.target.value);
    onFilterChange({ date, userEmail: e.target.value });
  };

  return (
    <div>
      <input type="date" value={date} onChange={handleDateChange} />
      <input
        type="text"
        placeholder="Filter by User Email"
        value={userEmail}
        onChange={handleUserEmailChange}
      />
    </div>
  );
};

export default FilterOptions;