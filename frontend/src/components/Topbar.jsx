import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaHome, FaFileInvoice, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import './Topbar.css';

const Topbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const handleNavClick = () => setMenuOpen(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div
          className={`menu-icon${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(open => !open)}
          aria-label="Toggle navigation"
          tabIndex={0}
          role="button"
        >
          <div className="menu-icon-inner">
            <div className="menu-bar menu-bar1" />
            <div className="menu-bar menu-bar2" />
            <div className="menu-bar menu-bar3" />
          </div>
        </div>
        <div className="user-info">
          <FaUserCircle className="user-avatar" />
          <span className="username">{user?.fullName || 'Employee'}</span>
        </div>
      </div>

      <nav className={`nav-links${menuOpen ? ' open' : ''}`}>
        <NavLink to="/employee/dashboard" className={({ isActive }) => isActive ? 'navlink active-link' : 'navlink'} onClick={handleNavClick}>
          <FaHome className="nav-icon" /> Dashboard
        </NavLink>
        <NavLink to="/employee/account" className={({ isActive }) => isActive ? 'navlink active-link' : 'navlink'} onClick={handleNavClick}>
          <FaInfoCircle className="nav-icon" /> Account Details
        </NavLink>
        <NavLink to="/employee/payslips" className={({ isActive }) => isActive ? 'navlink active-link' : 'navlink'} onClick={handleNavClick}>
          <FaFileInvoice className="nav-icon" /> Payslip History
        </NavLink>
        <NavLink to="/employee/salary" className={({ isActive }) => isActive ? 'navlink active-link' : 'navlink'} onClick={handleNavClick}>
          <FaMoneyBillWave className="nav-icon" /> Salary Breakdown
        </NavLink>
      </nav>

      <div className="topbar-right">
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
