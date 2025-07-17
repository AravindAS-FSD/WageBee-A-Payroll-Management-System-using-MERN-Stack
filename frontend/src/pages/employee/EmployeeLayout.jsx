import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import Footer from '../../components/Footer';
import './EmployeeLayout.css';

const EmployeeLayout = () => {
  return (
    <div className="layout-container">
      <Topbar />
      <main className="content-area">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default EmployeeLayout;
