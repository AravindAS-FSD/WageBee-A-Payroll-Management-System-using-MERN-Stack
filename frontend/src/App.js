// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Welcome from './pages/Welcome';

import EmployeeLayout from './pages/employee/EmployeeLayout';
import EmployeeDashboard from './pages/employee/Dashboard';
import AccountDetails from './pages/employee/AccountDetails';
import PayslipHistory from './pages/employee/PayslipHistory';
import SalaryBreakdown from './pages/employee/SalaryBreakdown';

import ManagerLayout from './pages/manager/ManagerLayout';
import ManagerDashboard from './pages/manager/Dashboard';
import GeneratePayslip from './pages/manager/GeneratePayslip';
import ManageEmployees from './pages/manager/ManageEmployees';
import PayslipHistoryMgr from './pages/manager/PayslipHistory';
import Reports from './pages/manager/Reports';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role?.toLowerCase())) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/employee/*"
          element={
            <PrivateRoute allowedRoles={['employee']}>
              <EmployeeLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="account" element={<AccountDetails />} />
          <Route path="payslips" element={<PayslipHistory />} />
          <Route path="salary" element={<SalaryBreakdown />} />
        </Route>

        <Route
          path="/manager/*"
          element={
            <PrivateRoute allowedRoles={['manager']}>
              <ManagerLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="generate-payslip" element={<GeneratePayslip />} />
          <Route path="manage-employees" element={<ManageEmployees />} />
          <Route path="payslips" element={<PayslipHistoryMgr />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
