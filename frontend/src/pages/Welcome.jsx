import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="info-box">
        <h1>Welcome to WageBee 🐝</h1>
        <p>Simple and efficient payroll management system for your organization.</p>
        <button
          className="get-started-btn"
          onClick={() => navigate('/login')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
