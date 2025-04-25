import React from 'react';

const ErrorDisplay = ({ error }) => {
  if (!error) {
    return null;
  }

  return <p style={{ color: 'red' }}>{error}</p>;
};

export default ErrorDisplay;