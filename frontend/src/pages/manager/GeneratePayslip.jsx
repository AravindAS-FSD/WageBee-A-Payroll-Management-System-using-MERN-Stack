import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import './GeneratePayslip.css';

const defaultMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const GeneratePayslip = () => {
  const initialFormState = {
    employee: '',
    month: '',
    year: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    netSalary: ''
  };

  const [form, setForm] = useState(initialFormState);
  const [filteredMonths, setFilteredMonths] = useState(defaultMonths);
  const [status, setStatus] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [existingPayslip, setExistingPayslip] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get('/employees');
        const arr = Array.isArray(res?.data) ? res.data : (res?.data?.employees || []);
        setEmployeeList(arr);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };
    fetchEmployees();
  }, []);

  const recalculateNetSalary = (base, allow, deduct) => {
    const net = (Number(base) || 0) + (Number(allow) || 0) - (Number(deduct) || 0);
    return Math.max(0, net);
  };

  // Sync variations in Month filtering whenever Year value is modified
  useEffect(() => {
    if (!form.year) {
      setFilteredMonths(defaultMonths);
      return;
    }
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();

    let allowedMonths = Number(form.year) === currentYear
      ? defaultMonths.slice(0, currentMonthIndex + 1)
      : Number(form.year) < currentYear
      ? [...defaultMonths]
      : [];

    setFilteredMonths(allowedMonths);

    if (form.month && !allowedMonths.includes(form.month)) {
      setForm(prev => ({ ...prev, month: '' }));
    }
  }, [form.year]);

  // Sync historical verification whenever key criteria change
  useEffect(() => {
    const checkExistingPayslip = async () => {
      if (form.employee && form.month && form.year) {
        try {
          const res = await API.get(`/payslips/check?employeeId=${form.employee}&month=${form.month}&year=${form.year}`);
          if (res.data && res.data._id) {
            setExistingPayslip(res.data);
            setForm(prev => ({
              ...prev,
              basicSalary: res.data.basicSalary,
              allowances: res.data.allowances,
              deductions: res.data.deductions,
              netSalary: res.data.netSalary
            }));
            setStatus(`Payslip already exists for ${form.month} ${form.year}. You can update it.`);
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
        if (!status.startsWith('✅')) setStatus('');
      }
    };

    checkExistingPayslip();
  }, [form.employee, form.month, form.year]);

  const handleChange = async (e) => {
    let { name, value } = e.target;

    if (["year", "basicSalary", "allowances", "deductions"].includes(name)) {
      value = value === '' ? '' : Number(value);
    }

    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (["basicSalary", "allowances", "deductions"].includes(name)) {
        updated.netSalary = recalculateNetSalary(updated.basicSalary, updated.allowances, updated.deductions);
      }
      return updated;
    });

    if (name === 'employee' && value) {
      try {
        const res = await API.get(`/employees/${value}`);
        const emp = res.data;
        setForm(prev => ({
          ...prev,
          basicSalary: emp?.basicSalary || 0,
          allowances: 0,
          deductions: 0,
          netSalary: recalculateNetSalary(emp?.basicSalary || 0, 0, 0)
        }));
      } catch (err) {
        console.error('Error fetching employee info:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        employeeId: form.employee,
        month: form.month,
        year: Number(form.year),
        basicSalary: Number(form.basicSalary),
        allowances: Number(form.allowances),
        deductions: Number(form.deductions),
        netSalary: Number(form.netSalary),
      };

      if (existingPayslip?._id) {
        await API.put(`/payslips/update/${existingPayslip._id}`, payload);
        setStatus(`✅ Payslip updated for ${form.month} ${form.year}`);
      } else {
        await API.post('/payslips/generate', payload);
        setStatus(`✅ Payslip generated for ${form.month} ${form.year}`);
      }

      if (form.employee && payload.netSalary) {
        await API.put(`/employees/${form.employee}`, {
          salary: payload.netSalary,
        });
      }

      setForm(initialFormState);
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
          Employee
          <select name="employee" value={form.employee} onChange={handleChange} required>
            <option value="">Select Employee</option>
            {employeeList.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.fullName || emp.username} ({emp._id})
              </option>
            ))}
          </select>
        </label>

        <label>
          Year
          <input type="number" name="year" value={form.year} onChange={handleChange} required />
        </label>

        <label>
          Month
          <select name="month" value={form.month} onChange={handleChange} required>
            <option value="">Select Month</option>
            {filteredMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <label>
          Basic Salary
          <input type="number" name="basicSalary" value={form.basicSalary} onChange={handleChange} required />
        </label>

        <label>
          Allowances
          <input type="number" name="allowances" value={form.allowances} onChange={handleChange} />
        </label>

        <label>
          Deductions
          <input type="number" name="deductions" value={form.deductions} onChange={handleChange} />
        </label>

        <div className="net-salary-display">
          <strong>Net Salary:</strong> ₹{form.netSalary.toLocaleString() || 0}
        </div>

        <button type="submit">Submit</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default GeneratePayslip;
