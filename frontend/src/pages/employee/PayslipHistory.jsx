import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import './PayslipHistory.css'; // Make sure this path is correct

const PayslipHistory = () => {
  const { user } = useContext(AuthContext);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayslips = async () => {
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
        setPayslips(sorted);
      } catch (error) {
        console.error('❌ Error fetching payslip history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayslips();
  }, [user?.id]);

  return (
    <div className="payslip-history-container">
      <h2 className="payslip-title">📄 Payslip History</h2>
      {loading ? (
        <p className="payslip-loading">Loading...</p>
      ) : payslips.length > 0 ? (
        <ul className="payslip-list">
          {payslips.map((p) => (
            <li key={p._id} className="payslip-card">
              <div className="payslip-info">
                <h4>
                  {p.month} {p.year}
                </h4>
                <p>Net Salary: ₹{p.netSalary?.toLocaleString()}</p>
              </div>
              <a
                href={`/api/payslips/${p._id}/download`}
                className="download-btn"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="payslip-empty">No payslips found.</p>
      )}
    </div>
  );
};

export default PayslipHistory;
