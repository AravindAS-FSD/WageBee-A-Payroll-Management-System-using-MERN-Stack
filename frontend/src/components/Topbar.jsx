import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Topbar.css';

const Topbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar">
        <h2 className="logo">{user?.fullName || 'Employee'}</h2>

        <nav className="nav-links">
          <NavLink to="/employee/dashboard" className={({ isActive }) => isActive ? 'navlink active-link' : 'navlink'}>Dashboard</NavLink>
          <NavLink to="/employee/account" className={({ isActive }) => isActive ? 'navlink active-link' : 'navlink'}>Account Details</NavLink>
          <NavLink to="/employee/payslips" className={({ isActive }) => isActive ? 'navlink active-link' : 'navlink'}>Payslip History</NavLink>
          <NavLink to="/employee/salary" className={({ isActive }) => isActive ? 'navlink active-link' : 'navlink'}>Salary Breakdown</NavLink>
        </nav>

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

    </header>
  );
};

export default Topbar;
