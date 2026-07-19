import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import './Dashboard.css';

// Extracted Sub-component for clarity and re-usability
const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [employeeData, setEmployeeData] = useState({});
  const [payslips, setPayslips] = useState([]);
  const [latestPayslip, setLatestPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;

        const empRes = await API.get(`/employees/${user.id}`);
        setEmployeeData(empRes.data);

        const payslipRes = await API.get(`/payslips/my?employeeId=${user.id}`);
        const sorted = (payslipRes.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPayslips(sorted);
        setLatestPayslip(sorted[0] || null);
      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  return (
    <div className="employee-dashboard">
      <h2 className="employee-heading">Welcome, {user?.fullName || 'Employee'}!</h2>

      <div className="profile-box">
        <h3 className="section-title">👤 My Profile</h3>
        <div className="stat-box-row">
          <StatCard title="Full Name" value={user?.fullName || 'N/A'} />
          <StatCard title="Role" value={user?.accessLevel || 'Employee'} />
          <StatCard
            title="Net Salary"
            value={`₹${employeeData?.salary?.toLocaleString() || 'N/A'}`}
          />
        </div>
      </div>

      {latestPayslip && (
        <div className="section-box latest-slip-container">
          <h3 className="section-title">📅 Most Recent Payslip</h3>
          <p>{latestPayslip.month} {latestPayslip.year} — ₹{latestPayslip.netSalary?.toLocaleString()}</p>
        </div>
      )}

      <div className="section-box">
        <h3 className="section-title">🧾 Payslip History</h3>
        {loading ? (
          <p className="text-gray-400">Loading payslips...</p>
        ) : payslips.length > 0 ? (
          <ul className="recent-payslips">
            {payslips.map((p) => (
              <li key={p._id}>
                {p.month} {p.year} – ₹{p.netSalary?.toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No records found.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
