import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  FaClock, FaCalendarAlt, FaSignOutAlt, FaUser, 
  FaSpinner, FaCheck, FaTimes, FaFileAlt, 
  FaBell, FaImage, FaLock, FaHistory
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Container = styled.div`
  padding: 15px;
  width: 100vw;
  min-height: 100vh;
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
`;

const StatTitle = styled.h4`
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatValue = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.$bg || '#3498db'};
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 10px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const LogoutButton = styled(Button)`
  background-color: #e74c3c;
  
  &:hover:not(:disabled) {
    background-color: #c0392b;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-end;
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 5px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
  }
`;

const Tab = styled.button`
  padding: 10px 15px;
  background: ${({ $active }) => ($active ? '#3498db' : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : '#2c3e50')};
  border: none;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  margin-right: 5px;
  font-weight: 500;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) => ($active ? '#2980b9' : '#f5f5f5')};
  }
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  width: 100%;
  overflow-x: auto;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const TableHeader = styled.th`
  background-color: #f8f9fa;
  padding: 12px 10px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #dee2e6;
  font-size: 14px;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  color: #495057;
  font-size: 13px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 100px;
  box-sizing: border-box;
  resize: vertical;
`;

const TwoColumnLayout = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Column = styled.div`
  flex: 1;
  min-width: 0;
`;


// ... (All styled components remain exactly the same as in your original code)

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState({
    date: new Date().toISOString().split('T')[0],
    clock_in: null,
    clock_out: null,
    status: null,
    _id: null
  });
  const [profileData, setProfileData] = useState({
    username: '',
    email: ''
  });
  const [leaveForm, setLeaveForm] = useState({
    start_date: '',
    end_date: '',
    leave_type: 'casual',
    reason: ''
  });

  // Enhanced authFetch with better error handling
  const authFetch = async (url, options = {}) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        throw new Error('No authentication token found');
      }
  
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
  
      // First check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || `Request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
  
      return data;
    } catch (err) {
      console.error(`API Error (${url}):`, err);
      throw err;
    }
  };

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !userData) {
        navigate('/login');
        return;
      }

      setUser(userData);
      setProfileData({
        username: userData.username,
        email: userData.email
      });
      
      await fetchDashboardData();
    } catch (err) {
      toast.error('Failed to load user data');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsData, attendanceData, leavesData] = await Promise.all([
        authFetch('/stats/employee').catch(() => null),
        authFetch('/attendance/user').catch(() => []),
        authFetch('/leaves/user').catch(() => [])
      ]);

      // Process today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = attendanceData.find(record => 
        record.date === today || new Date(record.date).toISOString().split('T')[0] === today
      );
  
      setStats(statsData);
      setAttendance(attendanceData);
      setLeaves(leavesData);
      setTodayAttendance(todayRecord || {
        date: today,
        clock_in: null,
        clock_out: null,
        status: null,
        _id: null
      });
  
    } catch (err) {
      console.error('Dashboard data error:', err);
      toast.error(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      try {
        // Check if already clocked in today
        const existing = await authFetch(`/attendance/check?date=${today}`);
        if (existing?.exists) {
          setTodayAttendance(existing);
          throw new Error('You have already clocked in today');
        }
      } catch (err) {
        if (err.message.includes('404')) {
          // Endpoint not found, proceed with clock-in
          console.log('Attendance check endpoint not available, proceeding with clock-in');
        } else {
          throw err;
        }
      }
  
      const response = await authFetch('/attendance/clock-in', {
        method: 'POST',
        body: JSON.stringify({ date: today })
      });
  
      setTodayAttendance({
        date: today,
        clock_in: response.clock_in_time || response.clock_in,
        clock_out: null,
        status: 'present',
        _id: response.attendance_id || response._id
      });
  
      toast.success(`Clocked in at ${new Date(response.clock_in_time || response.clock_in).toLocaleTimeString()}`);
      await fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Clock-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      
      if (!todayAttendance?._id) {
        throw new Error('No attendance record found to clock out');
      }
  
      const response = await authFetch(`/attendance/${todayAttendance._id}/clock-out`, {
        method: 'POST'
      });
  
      setTodayAttendance(prev => ({
        ...prev,
        clock_out: response.clock_out_time || response.clock_out
      }));
  
      toast.success(`Clocked out at ${new Date(response.clock_out_time || response.clock_out).toLocaleTimeString()}`);
      await fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Clock-out failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (!leaveForm.start_date || !leaveForm.end_date) {
        throw new Error('Start date and end date are required');
      }
      
      if (new Date(leaveForm.start_date) > new Date(leaveForm.end_date)) {
        throw new Error('Start date must be before end date');
      }

      await authFetch('/leaves', {
        method: 'POST',
        body: JSON.stringify(leaveForm)
      });

      toast.success('Leave request submitted successfully');
      setLeaveForm({
        start_date: '',
        end_date: '',
        leave_type: 'casual',
        reason: ''
      });
      await fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      await authFetch('/profile/password', {
        method: 'PUT',
        body: JSON.stringify(data)
      });

      toast.success('Password changed successfully');
      e.target.reset();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        handleLogout();
        return;
      }
  
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          handleLogout();
        }
      } catch (err) {
        handleLogout();
      }
    };
  
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading && !user) {
    return (
      <Container>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <FaSpinner className="spinner" /> Loading dashboard...
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <div style={{ color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaTimes /> Please login to access the dashboard
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      
      <Header>
        <h1>Employee Dashboard</h1>
        <UserInfo>
          <span>
            <FaUser /> {user.username}
          </span>
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </LogoutButton>
        </UserInfo>
      </Header>

      <MainContent>
        <TabContainer>
          <Tab 
            $active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          >
            <FaUser /> Dashboard
          </Tab>
          <Tab 
            $active={activeTab === 'attendance'} 
            onClick={() => setActiveTab('attendance')}
          >
            <FaClock /> Attendance
          </Tab>
          <Tab 
            $active={activeTab === 'leaves'} 
            onClick={() => setActiveTab('leaves')}
          >
            <FaCalendarAlt /> Leaves
          </Tab>
          <Tab 
            $active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profile
          </Tab>
        </TabContainer>

        {activeTab === 'dashboard' && (
          <>
            <h2>Today's Status</h2>
            <div style={{ marginBottom: '20px' }}>
              <Button
                onClick={handleClockIn}
                disabled={!!todayAttendance?.clock_in || loading}
                $bg="#2ecc71"
              >
                {loading ? <FaSpinner className="spinner" /> : <FaClock />} 
                {todayAttendance?.clock_in ? "Already Clocked In" : "Clock In"}
              </Button>
              <Button
                onClick={handleClockOut}
                disabled={!todayAttendance?.clock_in || !!todayAttendance?.clock_out || loading}
                $bg="#e74c3c"
              >
                {loading ? <FaSpinner className="spinner" /> : <FaClock />} 
                {todayAttendance?.clock_out ? "Already Clocked Out" : "Clock Out"}
              </Button>
              
              <div style={{ marginTop: '10px' }}>
                {todayAttendance?.clock_in ? (
                  <p style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaCheck /> 
                    Clocked in at {new Date(todayAttendance.clock_in).toLocaleTimeString()}
                    {todayAttendance?.clock_out && (
                      <span style={{ marginLeft: '10px' }}>
                        | Clocked out at {new Date(todayAttendance.clock_out).toLocaleTimeString()}
                      </span>
                    )}
                  </p>
                ) : (
                  <p style={{ color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaTimes /> Not clocked in today
                  </p>
                )}
              </div>
            </div>

            {stats && (
              <>
                <h2>Your Stats</h2>
                <StatsContainer>
                  <StatCard>
                    <StatTitle>
                      <FaCheck /> Present Days
                    </StatTitle>
                    <StatValue>{stats.present_days}</StatValue>
                  </StatCard>
                  <StatCard>
                    <StatTitle>
                      <FaTimes /> Absent Days
                    </StatTitle>
                    <StatValue>{stats.absent_days}</StatValue>
                  </StatCard>
                  <StatCard>
                    <StatTitle>
                      <FaCalendarAlt /> Leave Balance
                    </StatTitle>
                    <StatValue>{stats.leave_balance}</StatValue>
                  </StatCard>
                </StatsContainer>
              </>
            )}

            {stats?.upcoming_holidays?.length > 0 && (
              <>
                <h2>Upcoming Holidays</h2>
                <TableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <TableHeader>Holiday</TableHeader>
                        <TableHeader>Date</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.upcoming_holidays.map((holiday, index) => (
                        <tr key={index}>
                          <TableCell>{holiday.name}</TableCell>
                          <TableCell>{new Date(holiday.date).toLocaleDateString()}</TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}

{activeTab === 'attendance' && (
  <>
    <h2>Attendance History</h2>
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <TableHeader>Date</TableHeader>
            <TableHeader>Clock In</TableHeader>
            <TableHeader>Clock Out</TableHeader>
            {/* Status column removed */}
          </tr>
        </thead>
        <tbody>
          {attendance.length === 0 ? (
            <tr>
              {/* Changed colSpan from 4 to 3 since we removed a column */}
              <TableCell colSpan="3" style={{ textAlign: 'center', color: '#95a5a6' }}>
                No attendance records found
              </TableCell>
            </tr>
          ) : (
            attendance.map((record) => (
              <tr key={record._id}>
                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {record.clock_in ? new Date(record.clock_in).toLocaleTimeString() : '-'}
                </TableCell>
                <TableCell>
                  {record.clock_out ? new Date(record.clock_out).toLocaleTimeString() : '-'}
                </TableCell>
                {/* Status cell removed */}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </TableContainer>
  </>
)}
        {activeTab === 'leaves' && (
          <>
            <h2>Leave Management</h2>
            <TwoColumnLayout>
              <Column>
                <h3>Apply for Leave</h3>
                <form onSubmit={handleLeaveSubmit}>
                  <FormGroup>
                    <FormLabel>Leave Type</FormLabel>
                    <FormSelect
                      value={leaveForm.leave_type}
                      onChange={(e) => setLeaveForm({...leaveForm, leave_type: e.target.value})}
                    >
                      <option value="casual">Casual Leave</option>
                      <option value="sick">Sick Leave</option>
                      <option value="annual">Annual Leave</option>
                    </FormSelect>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Start Date</FormLabel>
                    <FormInput
                      type="date"
                      value={leaveForm.start_date}
                      onChange={(e) => setLeaveForm({...leaveForm, start_date: e.target.value})}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>End Date</FormLabel>
                    <FormInput
                      type="date"
                      value={leaveForm.end_date}
                      onChange={(e) => setLeaveForm({...leaveForm, end_date: e.target.value})}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Reason</FormLabel>
                    <FormTextarea
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                      required
                    />
                  </FormGroup>
                  <Button type="submit" $bg="#3498db" disabled={loading}>
                    {loading ? <FaSpinner className="spinner" /> : <FaFileAlt />} Submit Leave Request
                  </Button>
                </form>
              </Column>
              <Column>
                <h3>Your Leave History</h3>
                <TableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <TableHeader>Period</TableHeader>
                        <TableHeader>Type</TableHeader>
                        <TableHeader>Status</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.length === 0 ? (
                        <tr>
                          <TableCell colSpan="3" style={{ textAlign: 'center', color: '#95a5a6' }}>
                            No leave requests found
                          </TableCell>
                        </tr>
                      ) : (
                        leaves.map((leave) => (
                          <tr key={leave._id}>
                            <TableCell>
                              {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{leave.leave_type}</TableCell>
                            <TableCell>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                background: leave.status === 'approved' ? '#e8f5e9' : 
                                          leave.status === 'rejected' ? '#fdecea' : '#fff4e5',
                                color: leave.status === 'approved' ? '#2ecc71' : 
                                      leave.status === 'rejected' ? '#e74c3c' : '#f39c12'
                              }}>
                                {leave.status}
                              </span>
                            </TableCell>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </TableContainer>
              </Column>
            </TwoColumnLayout>
          </>
        )}

{activeTab === 'profile' && (
  <>
    <h2>Profile Management</h2>
    <TwoColumnLayout>
      <Column>
        <h3>Personal Information</h3>
        <div>
          <FormGroup>
            <FormLabel>Username</FormLabel>
            <FormInput
              type="text"
              value={user.username}
              readOnly
              disabled
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Email</FormLabel>
            <FormInput
              type="email"
              value={user.email}
              readOnly
              disabled
            />
          </FormGroup>
        </div>
      </Column>
      <Column>
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <FormGroup>
            <FormLabel>Current Password</FormLabel>
            <FormInput
              type="password"
              name="currentPassword"
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>New Password</FormLabel>
            <FormInput
              type="password"
              name="newPassword"
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Confirm New Password</FormLabel>
            <FormInput
              type="password"
              name="confirmPassword"
              required
            />
          </FormGroup>
          <Button type="submit" $bg="#3498db" disabled={loading}>
            {loading ? <FaSpinner className="spinner" /> : <FaLock />} Change Password
          </Button>
        </form>
      </Column>
    </TwoColumnLayout>
  </>
)}
      </MainContent>
    </Container>
  );
};

export default EmployeeDashboard;