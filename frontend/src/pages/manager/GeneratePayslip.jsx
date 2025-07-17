import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import './GeneratePayslip.css';

const defaultMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const GeneratePayslip = () => {
  const [form, setForm] = useState({
    employee: '',
    month: '',
    year: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    netSalary: ''
  });

  const [filteredMonths, setFilteredMonths] = useState(defaultMonths);
  const [status, setStatus] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [existingPayslip, setExistingPayslip] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await API.get('/employees');
        let arr = Array.isArray(res?.data) ? res.data : (res?.data?.employees || []);
        setEmployeeList(arr);
        setFilteredEmployees(arr);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    }
    fetchEmployees();
  }, []);

  const recalculateNetSalary = (base, allow, deduct) => {
    const net = (Number(base) || 0) + (Number(allow) || 0) - (Number(deduct) || 0);
    return Math.max(0, net);
  };

  const handleChange = async (e) => {
    let { name, value } = e.target;

    if (["year", "basicSalary", "allowances", "deductions"].includes(name)) {
      value = value === '' ? '' : Number(value);
    }

    let updatedForm = { ...form, [name]: value };

    if (name === 'year') {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonthIndex = currentDate.getMonth(); // 0-based index

      let allowedMonths = [];

      if (Number(value) === currentYear) {
        allowedMonths = defaultMonths.slice(0, currentMonthIndex + 1); // Show up to current month
      } else if (Number(value) < currentYear) {
        allowedMonths = [...defaultMonths]; // All months
      } else {
        allowedMonths = []; // Future year, no months
      }

      setFilteredMonths(allowedMonths);

      if (!allowedMonths.includes(updatedForm.month)) {
        updatedForm.month = '';
      }
    }

    if (name === 'employee' && value) {
      try {
        const res = await API.get(`/employees/${value}`);
        const emp = res.data;
        updatedForm = {
          ...updatedForm,
          basicSalary: emp?.basicSalary || 0,
          allowances: 0,
          deductions: 0,
        };
        updatedForm.netSalary = recalculateNetSalary(updatedForm.basicSalary, 0, 0);
      } catch (err) {
        console.error('Error fetching employee info:', err);
      }
    }

    if (["basicSalary", "allowances", "deductions"].includes(name)) {
      updatedForm.netSalary = recalculateNetSalary(
        updatedForm.basicSalary,
        updatedForm.allowances,
        updatedForm.deductions
      );
    }

    setForm(updatedForm);

    if (["month", "year"].includes(name)) {
      if (updatedForm.month && updatedForm.year) {
        try {
          const payslipsRes = await API.get(`/payslips?month=${updatedForm.month}&year=${updatedForm.year}`);
          const payslips = Array.isArray(payslipsRes.data) ? payslipsRes.data : [];
          const paidEmployeeIds = payslips.map(p => p.employee);
          setFilteredEmployees(employeeList.filter(emp => !paidEmployeeIds.includes(emp._id)));
        } catch (err) {
          setFilteredEmployees(employeeList);
        }
      } else {
        setFilteredEmployees(employeeList);
      }
    }

    if (["employee", "month", "year"].includes(name) &&
        updatedForm.employee && updatedForm.month && updatedForm.year) {
      try {
        const res = await API.get(`/payslips?employeeId=${updatedForm.employee}&month=${updatedForm.month}&year=${updatedForm.year}`);
        if (res.data && res.data._id) {
          setExistingPayslip(res.data);
          setForm({
            ...updatedForm,
            basicSalary: res.data.basicSalary || '',
            allowances: res.data.allowances || '',
            deductions: res.data.deductions || '',
            netSalary: res.data.netSalary || ''
          });
          setStatus(`Payslip already generated for ${updatedForm.month} ${updatedForm.year}. You can edit and update.`);
        } else {
          setExistingPayslip(null);
          setStatus('');
        }
      } catch (err) {
        setExistingPayslip(null);
        setStatus('');
      }
    } else {
      setExistingPayslip(null);
      setStatus('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        basicSalary: Number(form.basicSalary),
        allowances: Number(form.allowances),
        deductions: Number(form.deductions),
        netSalary: Number(form.netSalary),
      };

      if (existingPayslip && existingPayslip._id) {
        await API.put(`/payslips/${existingPayslip._id}`, payload);
        setStatus(`Payslip updated for ${form.month} ${form.year}`);
      } else {
        await API.post('/payslips', payload);
        setStatus(`Payslip generated for ${form.month} ${form.year}`);
      }

      if (form.employee && payload.netSalary) {
        await API.put(`/employees/${form.employee}`, {
          salary: payload.netSalary, // updates 'salary' field in Employee model
        });
      }

      setForm({
        employee: '',
        month: '',
        year: '',
        basicSalary: '',
        allowances: '',
        deductions: '',
        netSalary: ''
      });
      setExistingPayslip(null);
    } catch (err) {
      console.error(err);
      setStatus('❌ Error generating or updating payslip');
    }
  };

  return (
    <div className="generate-payslip-container">
      <h2>Generate Payslip</h2>
      <form onSubmit={handleSubmit} className="generate-payslip-form">
        <label>
          Employee ID
          <select name="employee" value={form.employee} onChange={handleChange} required>
            <option value="">Select Employee</option>
            {filteredEmployees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.fullName || emp.username} ({emp._id})
              </option>
            ))}
          </select>
        </label>

        <label>
          Year
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            required
            min={2000}
            max={2099}
          />
        </label>

        <label>
          Month
          <select name="month" value={form.month} onChange={handleChange} required>
            <option value="">Select Month</option>
            {filteredMonths.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </label>

        <label>
          Basic Salary (₹)
          <input type="number" name="basicSalary" value={form.basicSalary} onChange={handleChange} required />
        </label>

        <label>
          Allowances (₹)
          <input type="number" name="allowances" value={form.allowances} onChange={handleChange} />
        </label>

        <label>
          Deductions (₹)
          <input type="number" name="deductions" value={form.deductions} onChange={handleChange} />
        </label>

        <label>
          Net Salary (₹)
          <input type="number" name="netSalary" value={form.netSalary} readOnly />
        </label>

        <button type="submit">Generate</button>
      </form>

      {status && <p className="generate-payslip-status">{status}</p>}
    </div>
  );
};
export default GeneratePayslip;
