import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { json2csv } from 'json-2-csv';

// Styled components (keep your existing styles)
const Container = styled.div`
  padding: 20px;
`;

const Heading = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #f0f0f0;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  
  input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

// ExportButton component
const ExportButton = ({ data }) => {
  const handleExportCSV = async () => {
    try {
      const csv = await json2csv(data, {
        fields: ['user_id', 'username', 'clock_in_time', 'clock_out_time', 'date'],
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'attendance.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Failed to export data');
    }
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'attendance.json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ActionButtons>
      <button onClick={handleExportCSV}>Export to CSV</button>
      <button onClick={handleExportJSON}>Export to JSON</button>
    </ActionButtons>
  );
};

// FilterOptions component
const FilterOptions = ({ onFilterChange }) => {
  const [date, setDate] = useState('');
  const [username, setUsername] = useState('');

  const handleDateChange = (e) => {
    setDate(e.target.value);
    onFilterChange({ date: e.target.value, username });
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    onFilterChange({ date, username: e.target.value });
  };

  return (
    <FilterContainer>
      <input type="date" value={date} onChange={handleDateChange} />
      <input
        type="text"
        placeholder="Filter by username"
        value={username}
        onChange={handleUsernameChange}
      />
    </FilterContainer>
  );
};

// Main AdminDashboard component
const AdminDashboard = () => {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchAttendanceLogs = async () => {
      if (!token) {
        setError('Unauthorized: Please log in as an admin.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://127.0.0.1:5001/api/attendance/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAttendanceLogs(data);
        setFilteredLogs(data); // Initialize filtered logs with all data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchAttendanceLogs();
    }
  }, [token]);

  const handleFilterChange = (filters) => {
    let filteredData = [...attendanceLogs];
    
    if (filters.date) {
      const filterDate = new Date(filters.date).toISOString().split('T')[0];
      filteredData = filteredData.filter(log => 
        log.date && log.date.split('T')[0] === filterDate
      );
    }
    
    if (filters.username) {
      filteredData = filteredData.filter(log => 
        log.username && log.username.toLowerCase().includes(filters.username.toLowerCase())
      );
    }
    
    setFilteredLogs(filteredData);
  };

  if (loading) {
    return <div>Loading attendance logs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <Heading>Admin Dashboard - Attendance Logs</Heading>
      
      <FilterOptions onFilterChange={handleFilterChange} />
      <ExportButton data={filteredLogs} />
      
      <Table>
        <thead>
          <tr>
            <TableHeader>User ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Clock In Time</TableHeader>
            <TableHeader>Clock Out Time</TableHeader>
            <TableHeader>Date</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <tr key={log._id || log.user_id}>
                <TableCell>{log.user_id}</TableCell>
                <TableCell>{log.username || 'N/A'}</TableCell>
                <TableCell>{log.clock_in_time || 'Not clocked in'}</TableCell>
                <TableCell>{log.clock_out_time || 'Not clocked out'}</TableCell>
                <TableCell>{log.date}</TableCell>
              </tr>
            ))
          ) : (
            <tr>
              <TableCell colSpan="5" style={{ textAlign: 'center' }}>
                No attendance records found
              </TableCell>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDashboard;