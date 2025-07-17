import React from 'react';
import { Outlet } from 'react-router-dom';
import ManagerTopbar from '../../components/ManagerTopbar';
import Footer from '../../components/Footer';
import './ManagerLayout.css'; 

const ManagerLayout = () => {
  return (
    <div className="manager-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ManagerTopbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="content-area" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '20px 0' }}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManagerLayout;
