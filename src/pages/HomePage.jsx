import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaClock, FaChartBar, FaUserShield, FaMobileAlt, FaCalendarAlt } from 'react-icons/fa';

// --- Styled Components ---
const LandingPage = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #2d3748; /* Dark gray-blue for better readability */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
`;

const Hero = styled.header`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); /* Modern purple gradient */
  padding: 100px 20px;
  text-align: center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const HeroContent = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700; /* Slightly bolder */
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 40px;
  opacity: 0.9;
  font-weight: 300; /* Lighter for contrast */
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PrimaryButton = styled(Button)`
  background-color: #10b981; /* Fresh green */
  color: white;
  &:hover {
    background-color: #059669; /* Darker green */
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: white;
  border: 2px solid white;
  &:hover {
    background-color: rgba(255, 255, 255, 0.15); /* Slightly more visible */
    transform: translateY(-3px);
  }
`;

const Features = styled.section`
  padding: 80px 20px;
  background-color: #f8fafc; /* Very light blue-gray */
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: #1e293b; /* Dark blue-gray */
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 12px; /* Slightly more rounded */
  padding: 30px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e2e8f0; /* Subtle border */

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #4f46e5; /* Matching the hero purple */
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #1e293b; /* Dark blue-gray */
`;

const FeatureDescription = styled.p`
  color: #64748b; /* Medium gray-blue */
  font-size: 1.1rem;
  line-height: 1.6;
`;

const CTA = styled.section`
  padding: 100px 20px;
  text-align: center;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); /* Deep blue gradient */
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTASubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 40px;
  opacity: 0.9;
  font-weight: 300;
`;

const Footer = styled.footer`
  background-color: #0f172a; /* Very dark blue */
  color: #94a3b8; /* Light gray-blue */
  text-align: center;
  padding: 40px 20px; /* More padding */
  font-size: 0.9rem;
`;

// --- Component ---
const HomePage = () => {
  return (
    <LandingPage>
      <Hero>
        <HeroContent>
          <HeroTitle>OtomeytAi Attendance Management System</HeroTitle>
          <HeroSubtitle>
            Streamline your workforce tracking with our intuitive platform and it is good
          </HeroSubtitle>
          <HeroButtons>
            <PrimaryButton to="/login">Get Started</PrimaryButton>
            <SecondaryButton to="/signup">Learn More</SecondaryButton>
          </HeroButtons>
        </HeroContent>
      </Hero>

      <Features>
        <SectionTitle>Key Features</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon><FaClock /></FeatureIcon>
            <FeatureTitle>Real-time Tracking</FeatureTitle>
            <FeatureDescription>
              Monitor employee attendance in real-time with our easy-to-use check-in/out system.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><FaChartBar /></FeatureIcon>
            <FeatureTitle>Comprehensive Reports</FeatureTitle>
            <FeatureDescription>
              Generate detailed reports for payroll, compliance, and performance analysis.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><FaUserShield /></FeatureIcon>
            <FeatureTitle>Admin Dashboard</FeatureTitle>
            <FeatureDescription>
              Powerful tools for HR to manage employees, set policies, and oversee attendance.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><FaMobileAlt /></FeatureIcon>
            <FeatureTitle>Mobile Friendly</FeatureTitle>
            <FeatureDescription>
              Employees can clock in/out from anywhere using their smartphones.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><FaCalendarAlt /></FeatureIcon>
            <FeatureTitle>Leave Management</FeatureTitle>
            <FeatureDescription>
              Integrated system for managing vacation days, sick leaves, and time-off requests.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </Features>

      <CTA>
        <CTATitle>Ready to transform your attendance tracking?</CTATitle>
        <CTASubtitle>
          Join hundreds of businesses that trust our platform for accurate and efficient attendance management.
        </CTASubtitle>
        <PrimaryButton to="/signup">Start Your Free Trial</PrimaryButton>
      </CTA>

      <Footer>
        &copy; {new Date().getFullYear()} OtomeytAi. All rights reserved.
        <div style={{ marginTop: '20px' }}>
          <Link to="/privacy" style={{ color: '#94a3b8', margin: '0 15px', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: '#94a3b8', margin: '0 15px', textDecoration: 'none' }}>Terms of Service</Link>
          <Link to="/contact" style={{ color: '#94a3b8', margin: '0 15px', textDecoration: 'none' }}>Contact Us</Link>
        </div>
      </Footer>
    </LandingPage>
  );
};

export default HomePage;