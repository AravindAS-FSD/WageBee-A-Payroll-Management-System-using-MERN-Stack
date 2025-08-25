import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import './PayslipHistory.css';

const PayslipHistory = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayslips = async () => {
    try {
      setLoading(true);
      const res = await API.get('/payslips/all');
      setPayslips(res.data || []);
    } catch (error) {
      console.error('Failed to fetch payslips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payslip?')) return;

    try {
      await API.delete(`/payslips/${id}`);
      setPayslips(payslips.filter(p => p._id !== id));
    } catch (error) {
      console.error('Failed to delete payslip:', error);
      alert('Error deleting payslip.');
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, []);

  return (
    <div className="payslip-history-container">
      <h2 className="history-title">Payslip History</h2>
      {loading ? (
        <p>Loading payslips...</p>
      ) : payslips.length > 0 ? (
        <div className="table-wrapper">
          <table className="payslip-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Month</th>
                <th>Year</th>
                <th>Net Salary</th>
                <th>Issued Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map((p) => (
                <tr key={p._id}>
                  <td>{p.employee?.fullName || 'Unknown'}</td>
                  <td>{p.month}</td>
                  <td>{p.year}</td>
                  <td>₹{p.netSalary}</td>
                  <td>{new Date(p.issuedDate).toLocaleDateString('en-GB')}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDelete(p._id)}> 🗑️ Delete </button>
                  </td>
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
