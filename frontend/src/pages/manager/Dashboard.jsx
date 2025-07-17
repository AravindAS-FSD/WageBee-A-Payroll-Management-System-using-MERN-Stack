import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import './Dashboard.css'; 

const ManagerDashboard = () => {
  const [counts, setCounts] = useState({
    employees: 0,
    totalPayroll: 0,
    pendingPayrolls: 0,
    currentMonthStatus: 'Not Generated',
  });
  const [recent, setRecent] = useState([]);
  
  const manager = JSON.parse(localStorage.getItem('user'));
  const fullName = manager?.fullName || 'Manager';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await API.get('/employees');
        const employees = empRes.data;
        
        const payRes = await API.get('/payslips/all');
        const payslips = payRes.data;

        const totalPayroll = payslips.reduce((sum, p) => sum + p.netSalary, 0);

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const currentMonthPayslips = payslips.filter(
          (p) => p.month === currentMonth && p.year === currentYear
        );

        const currentMonthStatus = currentMonthPayslips.length
          ? 'Generated'
          : 'Not Generated';

        const pendingPayrolls = employees.length - currentMonthPayslips.length;

        const recentPays = payslips
          .sort((a, b) => new Date(b.issuedDate) - new Date(a.issuedDate))
          .slice(0, 5)
          .map((p) => `${p.month}/${p.year} – ₹${p.netSalary}`);
        
        setCounts({
          employees: employees.length,
          totalPayroll,
          pendingPayrolls,
          currentMonthStatus,
        });
        setRecent(recentPays);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="manager-dashboard">
      <h2 className="dashboard-title">Welcome, {fullName}!!</h2>
      <div className="cards-container">
        <StatCard title="Total Employees" value={counts.employees} color="#dbeafe" />
        <StatCard title="Total Payroll Disbursed" value={`₹${counts.totalPayroll}`} color="#dcfce7" />
        <StatCard title="Pending Payrolls" value={counts.pendingPayrolls} color="#fef9c3" />
      </div>
      
      <div className="section-box">
        <h3 className="section-title">🧾 Recent Payslips</h3>
        <ul className="recent-payslips">
          {recent.length
            ? recent.map((r, i) => <li key={i}>{r}</li>)
            : <li>No recent payslips</li>}
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="stat-card" style={{ backgroundColor: color }}>
    <h3 className="stat-title">{title}</h3>
    <p className="stat-value">{value}</p>
  </div>
);

export default ManagerDashboard;
