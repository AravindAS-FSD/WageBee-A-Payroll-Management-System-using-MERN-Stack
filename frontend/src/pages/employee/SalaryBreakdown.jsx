import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import './SalaryBreakdown.css'; // Match with the name you save

const SalaryBreakdown = () => {
  const { user } = useContext(AuthContext);
  const [latestPayslip, setLatestPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPayslip = async () => {
      try {
        if (!user?.id) {
          console.warn('⚠️ User ID not found in context');
          setLoading(false);
          return;
        }

        const response = await API.get(`/payslips?employeeId=${user.id}`);
        const sorted = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestPayslip(sorted[0]);
      } catch (err) {
        console.error('❌ Error fetching latest payslip:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPayslip();
  }, [user?.id]);

  if (loading) return <p className="salary-loading">Loading...</p>;

  if (!latestPayslip) return <p className="salary-empty">No salary breakdown available.</p>;

  return (
    <div className="salary-breakdown-container">
      <h2 className="salary-title">💰 Your Salary Breakdown</h2>
      <ul className="salary-list">
        <li><strong>Month:</strong> {latestPayslip.month} {latestPayslip.year}</li>
        <li><strong>Basic Salary:</strong> ₹{latestPayslip.basicSalary?.toLocaleString()}</li>
        <li><strong>Allowances:</strong> ₹{latestPayslip.allowances?.toLocaleString()}</li>
        <li><strong>Deductions:</strong> ₹{latestPayslip.deductions?.toLocaleString()}</li>
        <li className="net-salary"><strong>Net Salary:</strong> ₹{latestPayslip.netSalary?.toLocaleString()}</li>
      </ul>
    </div>
  );
};

export default SalaryBreakdown;
