// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { loginWithApi } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const data = await loginWithApi({ identifier, password });
      const role = data.user.role.toLowerCase();
      if (role === 'manager') {
        navigate('/manager/dashboard', { replace: true });
      } else {
        navigate('/employee/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <button className="back-btn" onClick={() => navigate('/')}> 
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;
