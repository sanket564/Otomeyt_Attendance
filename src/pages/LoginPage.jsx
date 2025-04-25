import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/otomeyt.jpg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data = await response.json();
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success('Login successful!');
      
      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin');  // Redirect to admin dashboard
      } else {
        navigate('/employee');  // Redirect to employee dashboard
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(error.message || 'Failed to connect to server');
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <PageWrapper>
      <LoginCard>
        <Logo src={logo} alt="Otomeyt AI Attendance" />
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your account</Subtitle>

        {loginError && <ErrorMessage>{loginError}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              hasError={!!errors.email}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </InputWrapper>

          <InputWrapper>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              hasError={!!errors.password}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputWrapper>

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>

        <BottomText>
          Don't have an account? <StyledLink to="/signup">Sign up</StyledLink>
        </BottomText>
      </LoginCard>
    </PageWrapper>
  );
};

export default LoginPage;

// Enhanced Styled Components with error states
const PageWrapper = styled.div`
  background: linear-gradient(135deg, #6b46c1 0%, #805ad5 100%);
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
`;


const LoginCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin: 0 auto 1rem auto;
  border-radius: 50%;
  border: 2px solid #f0f0f0;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #1a1a1a;
  margin: 0.5rem 0;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #555;
  font-size: 14px;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  margin-top: 2rem;
`;

const InputWrapper = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${props => props.hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e53e3e' : '#9f7aea'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(229, 62, 62, 0.2)' : 'rgba(159, 122, 234, 0.2)'};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: #6b46c1;
  color: white;
  border: none;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  
  &:hover {
    background: #553c9a;
  }
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  font-size: 12px;
  margin-top: 0.5rem;
  text-align: left;
`;

const BottomText = styled.p`
  margin-top: 1.5rem;
  font-size: 14px;
  color: #555;
`;

const StyledLink = styled(Link)`
  color: #6b46c1;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #553c9a;
    text-decoration: underline;
  }
`;