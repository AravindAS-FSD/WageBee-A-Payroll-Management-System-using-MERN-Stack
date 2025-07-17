import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import './AccountDetails.css';

const AccountDetails = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem('email');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await API.get('/employees');
        const employees = Array.isArray(res.data) ? res.data : res.data.employees || [];

        const found = employees.find(
          (emp) => (email && emp.email === email) || (username && emp.username === username)
        );

        setEmployee(found || null);
      } catch (err) {
        console.error('Error fetching employee:', err);
      } finally {
        setLoading(false);
      }
    };

    if (email || username) {
      fetchEmployee();
    } else {
      setLoading(false);
    }
  }, [email, username]);

  if (loading) {
    return <div className="account-loading">🔄 Loading account details...</div>;
  }

  if (!employee) {
    return <div className="account-error">⚠️ Employee not found</div>;
  }

  return (
    <div className="account-container">
      <div className="account-card">
        <h1 className="account-title">👤 Account Details</h1>
        <div className="account-grid">
          <Field label="Full Name" value={capitalize(employee.fullName)} />
          <Field label="Email" value={employee.email} />
          <Field label="Designation" value={capitalize(employee.designation)} />
          <Field label="Department" value={capitalize(employee.department)} />
          <Field label="Employee Type" value={capitalize(employee.employeeType)} />
          <Field label="Basic Salary" value={`₹${employee.basicSalary?.toLocaleString() || 'N/A'}`} />
          <Field label="Net Salary" value={`₹${employee.salary?.toLocaleString() || 'N/A'}`} />
          <Field label="Join Date" value={employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : 'N/A'} />
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value }) => (
  <div className="account-field">
    <span className="field-label">{label}</span>
    <span className="field-value">{value || 'N/A'}</span>
  </div>
);

const capitalize = (str) =>
  typeof str === 'string' && str.length > 0
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : str;

export default AccountDetails;
