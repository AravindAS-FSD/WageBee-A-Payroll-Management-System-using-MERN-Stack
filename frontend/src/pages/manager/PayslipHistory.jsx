import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import './PayslipHistory.css';

const PayslipHistory = () => {
  const [payslips, setPayslips] = useState([]);

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const res = await API.get('/payslips');
        setPayslips(res.data || []);
      } catch (error) {
        console.error('Failed to fetch payslips:', error);
      }
    };
    fetchPayslips();
  }, []);

  return (
    <div className="payslip-history-container">
      <h2 className="history-title">Payslip History</h2>
      {payslips.length > 0 ? (
        <div className="table-wrapper">
          <table className="payslip-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Month</th>
                <th>Year</th>
                <th>Net Salary</th>
                <th>Issued Date</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.employee?.fullName || 'Unknown'}</td>
                  <td>{p.month}</td>
                  <td>{p.year}</td>
                  <td>₹{p.netSalary}</td>
                  <td>{new Date(p.issuedDate).toLocaleDateString('en-GB')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-payslips-msg">No payslips available.</p>
      )}
    </div>
  );
};

export default PayslipHistory;
