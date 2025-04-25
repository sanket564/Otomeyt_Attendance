import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem('token'); // Get token
  const location = useLocation();

  // Function to decode the token and get the user's role (Implement this!)
  const getUserRole = () => {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      return payload.role;
    } catch (error) {
      return null;
    }
  };

  const userRole = getUserRole();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />; // Create an Unauthorized page
  }

  return children;
};

export default PrivateRoute;