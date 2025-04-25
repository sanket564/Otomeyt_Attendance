import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Styles object
  const styles = {
    nav: {
      backgroundColor: '#333',
      padding: '15px',
      position: 'sticky',  // Makes navbar sticky
      top: 0,              // Sticks to the top of viewport
      zIndex: 1000,        // Ensures navbar stays above other content
      width: '100%'        // Full width
    },
    ul: {
      listStyle: 'none',
      display: 'flex',
      gap: '20px',
      margin: 0,
      padding: 0
    },
    a: {
      color: 'white',
      textDecoration: 'none',
      padding: '5px 10px'
    },
    button: {
      background: '#d9534f',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      cursor: 'pointer'
    }
  };

  return (
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        <li>
          <Link to="/" style={styles.a}>Home</Link>
        </li>
        {token ? (
          <>
            <li>
              <Link to="/employee" style={styles.a}>Employee</Link>
            </li>
            <li>
              <Link to="/admin" style={styles.a}>Admin</Link>
            </li>
            <li>
              <button onClick={handleLogout} style={styles.button}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" style={styles.a}>Login</Link>
            </li>
            <li>
              <Link to="/signup" style={styles.a}>Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;