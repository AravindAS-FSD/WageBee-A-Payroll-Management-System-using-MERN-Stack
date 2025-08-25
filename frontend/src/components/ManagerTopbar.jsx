import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import './ManagerTopbar.css';


const ManagerTopbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="manager-topbar">
      <h2 className="logo"> {user?.fullName || user?.name || user?.username || 'Manager'} </h2>
      <nav className="nav-links">
        <NavLink to="/manager/dashboard" className={({ isActive }) => isActive ? 'navlink active-link' : 'navlink'}>
          Dashboard
        </NavLink>
        <NavLink to="/manager/manage-employees" className={({ isActive }) => isActive ? 'navlink active-link' : 'navlink'}>
          Manage Employees
        </NavLink>
        <NavLink to="/manager/generate-payslip" className={({ isActive }) => isActive ? 'navlink active-link' : 'navlink'}>
          Generate Payslip
        </NavLink>
        <NavLink to="/manager/payslips" className={({ isActive }) => isActive ? 'navlink active-link' : 'navlink'}>
          Payslip History
        </NavLink>
        <NavLink to="/manager/reports" className={({ isActive }) => isActive ? 'navlink active-link' : 'navlink'}>
          Reports
        </NavLink>
      </nav>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default ManagerTopbar;
