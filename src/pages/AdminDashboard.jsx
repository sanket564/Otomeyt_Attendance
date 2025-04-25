import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { json2csv } from 'json-2-csv';
import { 
  FaUsers, FaCalendarAlt, FaClock, FaSignOutAlt, 
  FaHome, FaBars, FaTimes, FaFileExport, 
  FaSearch, FaFilter, FaUser, FaEnvelope, 
  FaCalendarDay, FaFileAlt, FaTrash, FaCheck, 
  FaTimesCircle, FaSpinner, FaChevronDown, FaChevronUp,
  FaPlus, FaEdit, FaChartLine, FaCog, FaFileExcel
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Styled components
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f5f7fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Sidebar = styled.div`
  width: 280px;
  background-color: #2c3e50;
  color: white;
  height: 100vh;
  overflow-y: auto;
  flex-shrink: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: fixed;
  z-index: 100;
  
  @media (max-width: 768px) {
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarItem = styled.li`
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  background-color: ${({ $active }) => ($active ? '#34495e' : 'transparent')};
  border-left: 3px solid ${({ $active }) => ($active ? '#3498db' : 'transparent')};

  &:hover {
    background-color: #34495e;
  }
`;

const MainContent = styled.div`
  flex: 1;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-left: 280px;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: #2c3e50;
  font-size: 20px;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #555;
  }
  
  p {
    margin: 0;
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
  }
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 300px);
  min-height: 300px;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    position: sticky;
    top: 0;
    background-color: #f8f9fa;
    z-index: 10;
  }

  tbody {
    overflow-y: auto;
  }

  th, td {
    padding: 12px;
    text-align: left;
    white-space: nowrap;
  }

  tr {
    border-bottom: 1px solid #e0e0e0;
  }
`;

const ActionButton = styled.button`
  background-color: ${({ $bg }) => $bg || '#3498db'};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  transition: opacity 0.2s;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  flex: 1;
  display: flex;
  flex-direction: column;
  
  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2c3e50;
  }
  
  > div {
    flex-grow: 1;
    min-height: 300px;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  display: inline-block;
  background-color: ${({ $status }) => 
    $status === 'approved' ? '#e8f5e9' : 
    $status === 'rejected' ? '#fdecea' : 
    $status === 'present' ? '#e8f5e9' : '#fff4e5'};
  color: ${({ $status }) => 
    $status === 'approved' ? '#2ecc71' : 
    $status === 'rejected' ? '#e74c3c' : 
    $status === 'present' ? '#2ecc71' : '#f39c12'};
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (min-width: 480px) {
    flex-direction: row;
  }
`;

const ExportButtons = styled.div`
  display: flex;
  gap: 10px;
  
  button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    
    &:last-child {
      background-color: #2c3e50;
    }
  }
`;

const EmployeeFormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
`;

const EmployeeForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  width: 100%;
`;

const SubmitButton = styled.button`
  grid-column: 1 / -1;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const WorkingDaysContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const WorkingDayLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [processingLeave, setProcessingLeave] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee'
  });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [workHours, setWorkHours] = useState({
    start_time: '09:00',
    end_time: '17:00',
    working_days: [1, 2, 3, 4, 5]
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768 && sidebarOpen && 
          !event.target.closest('.sidebar') && 
          !event.target.closest('.mobile-menu-btn')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  // Auto-close sidebar on mobile when clicking a menu item
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
  
        // Load stats
        const stats = await authFetch('/stats/admin');
        setStats(stats);
        
        // Load attendance
        const attendance = await authFetch('/attendance/all');
        setAttendanceLogs(attendance);
        
        // Load employees
        const employees = await authFetch('/employees');
        setEmployees(employees);
        
        // Load leave requests
        const leaves = await authFetch('/leaves/all');
        setLeaveRequests(leaves);
        
        // Load holidays
        const holidays = await authFetch('/settings/holidays');
        setHolidays(holidays);
        
        // Load work hours
        const workHours = await authFetch('/settings/work-hours');
        if (workHours && workHours.value) {
          setWorkHours(workHours.value);
        }
  
      } catch (error) {
        console.error('Error in fetchData:', error);
        if (error.message.includes('Token has expired') || 
            error.message.includes('401') || 
            error.message.includes('Unauthorized')) {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [navigate]); 
  
    const handleAddHoliday = async (holidayData) => {
      try {
        setLoading(true);
        await authFetch('/holidays', {
          method: 'POST',
          body: JSON.stringify(holidayData)
        });
        
        toast.success('Holiday added successfully');
        await fetchData();
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };


    const handleDeleteHoliday = async (holidayId) => {
      try {
        setLoading(true);
        await authFetch(`/holidays/${holidayId}`, {
          method: 'DELETE'
        });
        
        toast.success('Holiday deleted successfully');
        await fetchData();
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };


  // Handle adding new employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    
    if (newEmployee.password !== newEmployee.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newEmployee.username,
          email: newEmployee.email,
          password: newEmployee.password,
          confirmPassword: newEmployee.confirmPassword,
          role: newEmployee.role
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add employee');
      }
      
      toast.success('Employee added successfully');
      setNewEmployee({ 
        username: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        role: 'employee' 
      });
      
      // Refresh employees list
      const employeesRes = await fetch(`${API_BASE_URL}/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEmployees(await employeesRes.json());
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle editing employee
  const handleEditEmployee = (employee) => {
    setEditingEmployee({
      _id: employee._id,
      username: employee.username,
      email: employee.email,
      role: employee.role,
      leave_balance: employee.leave_balance
    });
    setShowEditModal(true);
  };

  // Handle updating employee
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/employees/${editingEmployee._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: editingEmployee.username,
          email: editingEmployee.email,
          role: editingEmployee.role,
          leave_balance: editingEmployee.leave_balance
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update employee');
      }
      
      toast.success('Employee updated successfully');
      setShowEditModal(false);
      
      // Refresh employees list
      const employeesRes = await fetch(`${API_BASE_URL}/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEmployees(await employeesRes.json());
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle deleting employee
  const handleDeleteEmployee = async (employeeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete employee');
      }
      
      toast.success('Employee deleted successfully');
      setDeleteConfirmation(null);
      
      // Refresh employees list
      const employeesRes = await fetch(`${API_BASE_URL}/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEmployees(await employeesRes.json());
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle approving leave
  const handleApproveLeave = async (leaveId) => {
    setProcessingLeave(leaveId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/leaves/${leaveId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) throw new Error('Failed to approve leave');
      
      toast.success('Leave approved successfully');
      const leavesRes = await fetch(`${API_BASE_URL}/leaves/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLeaveRequests(await leavesRes.json());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessingLeave(null);
    }
  };

  // In your authFetch function, update the error handling:
  const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem('token');
    
    // Set up headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
      });
  
      // If unauthorized, try refreshing token
      if (response.status === 401) {
        const newToken = await refreshToken();
        headers['Authorization'] = `Bearer ${newToken}`;
        
        // Retry with new token
        const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers
        });
        
        if (!retryResponse.ok) {
          throw new Error(`Request failed with status ${retryResponse.status}`);
        }
        return await retryResponse.json();
      }
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      return await response.json();
    } catch (err) {
      console.error(`API Error (${url}):`, err);
      if (err.message.includes('401')) {
        // Redirect to login if unauthorized
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw err;
    }
  };
  
  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to refresh token');
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data.token;
    } catch (error) {
      // If refresh fails, logout the user
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw error;
    }
  };
  
  // Handle rejecting leave
  const handleRejectLeave = async (leaveId) => {
    setProcessingLeave(leaveId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/leaves/${leaveId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) throw new Error('Failed to reject leave');
      
      toast.success('Leave rejected successfully');
      const leavesRes = await fetch(`${API_BASE_URL}/leaves/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLeaveRequests(await leavesRes.json());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessingLeave(null);
    }
  };

  // Handle updating work hours
  const handleUpdateWorkHours = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/settings/work-hours`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workHours)
      });

      if (!response.ok) throw new Error('Failed to update work hours');
      
      toast.success('Work hours updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleExportAttendance = async (format) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('format', format);
      
      if (statusFilter) params.append('status', statusFilter);
      if (startDate) params.append('start_date', startDate.toISOString().split('T')[0]);
      if (endDate) params.append('end_date', endDate.toISOString().split('T')[0]);

      console.log("Exporting to:", `${API_BASE_URL}/attendance/export?${params.toString()}`);
console.log("Token:", token);

  
      const response = await fetch(`${API_BASE_URL}/attendance/export?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Export failed');
      }
  
      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `attendance_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // For JSON, create a download link with the data
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `attendance_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      
      toast.success(`Exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

// Update the filter logic in your useEffect
useEffect(() => {
  let filtered = [...attendanceLogs];
  
  if (startDate && endDate) {
    filtered = filtered.filter(log => {
      try {
        const logDate = new Date(log.date);
        return logDate >= startDate && logDate <= endDate;
      } catch (error) {
        console.error('Error filtering by date:', error);
        return true;
      }
    });
  }

  if (searchName) {
    filtered = filtered.filter(log => 
      log.username.toLowerCase().includes(searchName.toLowerCase())
    );
  }
  
  if (statusFilter) {
    filtered = filtered.filter(log => log.status === statusFilter);
  }
  
  setFilteredAttendance(filtered);
}, [attendanceLogs, startDate, endDate, searchName, statusFilter]);

  // Chart options for analytics
  const attendanceChartOptions = {
    chart: {
      type: 'bar',
      height: '100%',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Present', 'Absent', 'Late'],
    },
    colors: ['#2ecc71', '#e74c3c', '#f39c12'],
  };

  const attendanceChartSeries = [{
    name: 'Employees',
    data: [
      stats?.present_today || 0, 
      stats?.absent_today || 0, 
      stats?.late_today || 0
    ]
  }];
  
  if (loading) {
    return (
      <DashboardContainer>
        <MainContent>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <FaSpinner className="spinner" /> Loading...
          </div>
        </MainContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <ToastContainer position="top-right" />
      
      <Sidebar className="sidebar" $isOpen={sidebarOpen}>
        <SidebarHeader>
          <h2>Admin Panel</h2>
          <button onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </SidebarHeader>
        <SidebarMenu>
          <SidebarItem 
            $active={activeTab === 'dashboard'} 
            onClick={() => handleTabChange('dashboard')}
          >
            <FaHome /> Dashboard
          </SidebarItem>
          <SidebarItem 
            $active={activeTab === 'attendance'} 
            onClick={() => handleTabChange('attendance')}
          >
            <FaClock /> Attendance
          </SidebarItem>
          <SidebarItem 
            $active={activeTab === 'employees'} 
            onClick={() => handleTabChange('employees')}
          >
            <FaUsers /> Employees
          </SidebarItem>
          <SidebarItem 
            $active={activeTab === 'leaves'} 
            onClick={() => handleTabChange('leaves')}
          >
            <FaCalendarAlt /> Leaves
          </SidebarItem>
          <SidebarItem 
            $active={activeTab === 'analytics'} 
            onClick={() => handleTabChange('analytics')}
          >
            <FaChartLine /> Analytics
          </SidebarItem>
          <SidebarItem 
            $active={activeTab === 'settings'} 
            onClick={() => handleTabChange('settings')}
          >
            <FaCog /> Settings
          </SidebarItem>
        </SidebarMenu>
      </Sidebar>

      <MainContent>
        <Header>
          <MobileMenuButton className="mobile-menu-btn" onClick={toggleSidebar}>
            <FaBars />
          </MobileMenuButton>
          <h1>
            {activeTab === 'dashboard' && 'Dashboard Overview'}
            {activeTab === 'attendance' && 'Attendance Management'}
            {activeTab === 'employees' && 'Employee Management'}
            {activeTab === 'leaves' && 'Leave Requests'}
            {activeTab === 'analytics' && 'Analytics & Reports'}
            {activeTab === 'settings' && 'System Settings'}
          </h1>
          <HeaderActions> 
            <span>
              <FaUser /> Admin
            </span>
            <button onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}>
              <FaSignOutAlt /> Logout
            </button>
          </HeaderActions>
        </Header>

        <ContentArea>
          {activeTab === 'dashboard' && (
            <>
              <StatsGrid>
                <StatCard>
                  <h3><FaUsers /> Total Employees</h3>
                  <p>{stats?.total_employees || 0}</p>
                </StatCard>
                <StatCard>
                  <h3><FaCheck /> Present Today</h3>
                  <p>{stats?.present_today || 0}</p>
                </StatCard>
                <StatCard>
                  <h3><FaTimes /> Absent Today</h3>
                  <p>{stats?.absent_today || 0}</p>
                </StatCard>
                <StatCard>
                  <h3><FaCalendarAlt /> Pending Leaves</h3>
                  <p>{stats?.pending_requests || 0}</p>
                </StatCard>
              </StatsGrid>
              <ChartContainer>
                <h2>Attendance Overview</h2>
                <Chart
                  options={attendanceChartOptions}
                  series={attendanceChartSeries}
                  type="bar"
                  height="100%"
                />
              </ChartContainer>
            </>
          )}

{activeTab === 'attendance' && (
  <>
    <FilterContainer>
      <FilterGroup>
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          isClearable={true}
          placeholderText="Filter by date range"
          dateFormat="yyyy-MM-dd"
        />
        <FormInput
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <FormSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="on_leave">On Leave</option>
        </FormSelect>
      </FilterGroup>
      <ExportButtons>
        <button onClick={() => handleExportAttendance('csv')}>
          <FaFileExcel /> Export CSV
        </button>
        <button onClick={() => handleExportAttendance('json')}>
          <FaFileAlt /> Export JSON
        </button>
      </ExportButtons>
    </FilterContainer>

    <TableContainer>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Clock In</th>
            <th>Clock Out</th>
            <th>Status</th>
            <th>Hours Worked</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendance.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                No attendance records found matching your filters
              </td>
            </tr>
          ) : (
            filteredAttendance.map((log) => {
              const clockInTime = log.clock_in_time ? new Date(log.clock_in_time) : null;
              const clockOutTime = log.clock_out_time ? new Date(log.clock_out_time) : null;
              
              // Calculate hours worked if both times exist
              let hoursWorked = '-';
              if (clockInTime && clockOutTime) {
                const diffMs = clockOutTime - clockInTime;
                const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
                const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                hoursWorked = `${diffHrs}h ${diffMins}m`;
              }

              return (
                <tr key={log._id}>
                  <td>{log.username}</td>
                  <td>{new Date(log.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</td>
                  <td>
                    {log.status === 'absent' || log.status === 'on_leave' ? (
                      <span style={{ color: '#999' }}>N/A</span>
                    ) : clockInTime ? (
                      clockInTime.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })
                    ) : (
                      <span style={{ color: '#ff6b6b' }}>Missing</span>
                    )}
                  </td>
                  <td>
                    {log.status === 'absent' || log.status === 'on_leave' ? (
                      <span style={{ color: '#999' }}>N/A</span>
                    ) : clockOutTime ? (
                      clockOutTime.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })
                    ) : log.status === 'present' ? (
                      <span style={{ color: '#ff6b6b' }}>Not clocked out</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <StatusBadge $status={log.status}>
                      {log.status === 'present' && 'Present'}
                      {log.status === 'absent' && 'Absent'}
                      {log.status === 'late' && 'Late Arrival'}
                      {log.status === 'on_leave' && 'On Leave'}
                    </StatusBadge>
                  </td>
                  <td>
                    {hoursWorked}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </TableContainer>
  </>
)}

          {activeTab === 'employees' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <EmployeeFormContainer>
                <h2 style={{ marginTop: 0 }}>Add New Employee</h2>
                <EmployeeForm onSubmit={handleAddEmployee}>
                  <FormGroup>
                    <label>Username</label>
                    <FormInput 
                      type="text" 
                      value={newEmployee.username}
                      onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
                      required
                      placeholder="Enter username"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <label>Email</label>
                    <FormInput 
                      type="email" 
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      required
                      placeholder="Enter email address"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <label>Password</label>
                    <FormInput 
                      type="password" 
                      value={newEmployee.password}
                      onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                      required
                      placeholder="Enter password"
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Confirm Password</label>
                    <FormInput 
                      type="password" 
                      value={newEmployee.confirmPassword}
                      onChange={(e) => setNewEmployee({...newEmployee, confirmPassword: e.target.value})}
                      required
                      placeholder="Confirm password"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <label>Role</label>
                    <FormSelect
                      value={newEmployee.role}
                      onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                    >
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </FormSelect>
                  </FormGroup>
                  
                  <SubmitButton type="submit">
                    <FaPlus /> Add Employee
                  </SubmitButton>
                </EmployeeForm>
              </EmployeeFormContainer>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <h2>Employee List</h2>
                <TableContainer>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Present Days</th>
                        <th>Absent Days</th>
                        <th>Leave Balance</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee._id}>
                          <td>{employee.username}</td>
                          <td>{employee.email}</td>
                          <td>{employee.present_days}</td>
                          <td>{employee.absent_days}</td>
                          <td>{employee.leave_balance}</td>
                          <td>
                            <ActionButton $bg="#3498db" onClick={() => handleEditEmployee(employee)}>
                              <FaEdit /> Edit
                            </ActionButton>
                            <ActionButton $bg="#e74c3c" onClick={() => setDeleteConfirmation(employee._id)}>
                              <FaTrash /> Delete
                            </ActionButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableContainer>
              </div>
            </div>
          )}

          {activeTab === 'leaves' && (
            <>
              <h2>Leave Requests</h2>
              <TableContainer>
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Period</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((request) => (
                      <tr key={request._id}>
                        <td>{request.username}</td>
                        <td>
                          {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                        </td>
                        <td>{request.leave_type}</td>
                        <td>
                          <StatusBadge $status={request.status}>
                            {request.status}
                          </StatusBadge>
                        </td>
                        <td>
                          {request.status === 'pending' && (
                            <>
                              <ActionButton 
                                $bg="#2ecc71" 
                                onClick={() => handleApproveLeave(request._id)}
                                disabled={processingLeave === request._id}
                              >
                                {processingLeave === request._id ? (
                                  <FaSpinner className="spinner" />
                                ) : (
                                  <FaCheck />
                                )}
                                Approve
                              </ActionButton>
                              <ActionButton 
                                $bg="#e74c3c"
                                onClick={() => handleRejectLeave(request._id)}
                                disabled={processingLeave === request._id}
                              >
                                {processingLeave === request._id ? (
                                  <FaSpinner className="spinner" />
                                ) : (
                                  <FaTimes />
                                )}
                                Reject
                              </ActionButton>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableContainer>
            </>
          )}

          {activeTab === 'analytics' && (
            <>
              <ChartContainer>
                <h2>Attendance Trends</h2>
                <Chart
                  options={attendanceChartOptions}
                  series={attendanceChartSeries}
                  type="bar"
                  height="100%"
                />
              </ChartContainer>
              <ChartContainer>
                <h2>Leave Statistics</h2>
                <Chart
                  options={{
                    chart: { 
                      type: 'pie',
                      toolbar: {
                        show: false
                      }
                    },
                    labels: ['Approved', 'Rejected', 'Pending'],
                  }}
                  series={[
                    leaveRequests.filter(r => r.status === 'approved').length,
                    leaveRequests.filter(r => r.status === 'rejected').length,
                    leaveRequests.filter(r => r.status === 'pending').length
                  ]}
                  type="pie"
                  height="100%"
                />
              </ChartContainer>
            </>
          )}

          {activeTab === 'settings' && (
            <>
              <div style={{ marginBottom: '30px' }}>
                <h2>Work Hours Settings</h2>
                <form onSubmit={handleUpdateWorkHours}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <FormGroup>
                      <label>Start Time</label>
                      <FormInput 
                        type="time" 
                        value={workHours.start_time}
                        onChange={(e) => setWorkHours({...workHours, start_time: e.target.value})}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>End Time</label>
                      <FormInput 
                        type="time" 
                        value={workHours.end_time}
                        onChange={(e) => setWorkHours({...workHours, end_time: e.target.value})}
                      />
                    </FormGroup>
                    <FormGroup style={{ gridColumn: '1 / -1' }}>
                      <label>Working Days</label>
                      <WorkingDaysContainer>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                          <WorkingDayLabel key={day}>
                            <input
                              type="checkbox"
                              checked={workHours.working_days.includes(index + 1)}
                              onChange={(e) => {
                                const newDays = [...workHours.working_days];
                                if (e.target.checked) {
                                  newDays.push(index + 1);
                                } else {
                                  const idx = newDays.indexOf(index + 1);
                                  if (idx > -1) newDays.splice(idx, 1);
                                }
                                setWorkHours({...workHours, working_days: newDays.sort()});
                              }}
                            />
                            {day}
                          </WorkingDayLabel>
                        ))}
                      </WorkingDaysContainer>
                    </FormGroup>
                    <SubmitButton type="submit">
                      Save Settings
                    </SubmitButton>
                  </div>
                </form>
              </div>
              <div>
                <h2>Holidays</h2>
                <TableContainer>
                  <table>
                    <thead>
                      <tr>
                        <th>Holiday</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holidays.map((holiday) => (
                        <tr key={holiday._id}>
                          <td>{holiday.name}</td>
                          <td>{new Date(holiday.date).toLocaleDateString()}</td>
                          <td>
                            <ActionButton $bg="#e74c3c">
                              <FaTrash /> Delete
                            </ActionButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableContainer>
              </div>
            </>
          )}
        </ContentArea>
      </MainContent>

      {/* Edit Employee Modal */}
      {showEditModal && editingEmployee && (
        <ModalOverlay>
          <ModalContent>
            <h2>Edit Employee</h2>
            <form onSubmit={handleUpdateEmployee}>
              <FormGroup>
                <label>Username</label>
                <FormInput 
                  type="text" 
                  value={editingEmployee.username}
                  onChange={(e) => setEditingEmployee({...editingEmployee, username: e.target.value})}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <label>Email</label>
                <FormInput 
                  type="email" 
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <label>Role</label>
                <FormSelect
                  value={editingEmployee.role}
                  onChange={(e) => setEditingEmployee({...editingEmployee, role: e.target.value})}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <label>Leave Balance</label>
                <FormInput 
                  type="number" 
                  value={editingEmployee.leave_balance}
                  onChange={(e) => setEditingEmployee({...editingEmployee, leave_balance: e.target.value})}
                  required
                />  
              </FormGroup>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <ActionButton $bg="#95a5a6" onClick={() => setShowEditModal(false)}>
                  Cancel
                </ActionButton>
                <SubmitButton type="submit">
                  <FaCheck /> Save Changes
                </SubmitButton>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <ModalOverlay>
          <ModalContent>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <ActionButton $bg="#95a5a6" onClick={() => setDeleteConfirmation(null)}>
                Cancel
              </ActionButton>
              <ActionButton $bg="#e74c3c" onClick={() => handleDeleteEmployee(deleteConfirmation)}>
                <FaTrash /> Delete
              </ActionButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard;