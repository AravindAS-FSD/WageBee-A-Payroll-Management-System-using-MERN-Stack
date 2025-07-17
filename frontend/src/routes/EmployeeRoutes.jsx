import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../pages/employee/Dashboard';
import AccountDetails from '../pages/employee/AccountDetails';
import PayslipHistory from '../pages/employee/PayslipHistory';
import SalaryBreakdown from '../pages/employee/SalaryBreakdown';

const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="account" element={<AccountDetails />} />
      <Route path="payslips" element={<PayslipHistory />} />
      <Route path="salary" element={<SalaryBreakdown />} />
    </Routes>
  );
};

export default EmployeeRoutes;
