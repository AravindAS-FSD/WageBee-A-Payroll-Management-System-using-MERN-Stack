import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../pages/manager/Dashboard';
import ManageEmployees from '../pages/manager/ManageEmployees';
import GeneratePayslip from '../pages/manager/GeneratePayslip';
import PayslipHistory from '../pages/manager/PayslipHistory';
import Reports from '../pages/manager/Reports';

const ManagerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="manage-employees" element={<ManageEmployees />} />
      <Route path="generate-payslip" element={<GeneratePayslip />} />
      <Route path="payslips" element={<PayslipHistory />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
};

export default ManagerRoutes;
