import React, { useEffect, useState } from 'react';
import { getAllEmployees, deleteEmployee, updateEmployee, promoteToManager, addEmployee } from '../../api/employees';
import './ManageEmployees.css';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [editModal, setEditModal] = useState({ open: false, emp: null });
  const [editFields, setEditFields] = useState({ role: '', department: '', designation: '', employeeType: '', password: '' });

  const [addModal, setAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    username: '',
    fullName: '',
    email: '',
    department: '',
    designation: '',
    employeeType: '',
    basicSalary: '',
    password: '',
    role: 'employee'
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getAllEmployees();
        let employeesArr = Array.isArray(res?.data) ? res.data : (res?.data?.employees || []);
        setEmployees(employeesArr);
      } catch (err) {
        setError('Failed to load employee data: ' + (err?.message || err));
      }
    };
    fetchEmployees();
  }, []);

  const handleEdit = (id) => {
    const emp = employees.find(e => e._id === id);
    setEditFields({
      role: emp.role || '',
      department: emp.department || '',
      designation: emp.designation || '',
      employeeType: emp.employeeType || '',
      password: ''
    });
    setEditModal({ open: true, emp });
  };

  const handleEditSave = async () => {
    try {
      if (editFields.role === 'manager') {
        if (!editFields.password) {
          setError('Password is required to promote to manager.');
          return;
        }
        await promoteToManager(editModal.emp._id, {
          ...editModal.emp,
          ...editFields,
          password: editFields.password
        });
        const res = await getAllEmployees();
        let employeesArr = Array.isArray(res?.data) ? res.data : (res?.data?.employees || []);
        setEmployees(employeesArr);
        setEditModal({ open: false, emp: null });
        setSuccessMsg('Employee promoted to manager, removed from employees, and notified!');
        setTimeout(() => setSuccessMsg(''), 2000);
      } else {
        await updateEmployee(editModal.emp._id, editFields);
        setEmployees(prev => prev.map(emp => emp._id === editModal.emp._id ? { ...emp, ...editFields } : emp));
        setEditModal({ open: false, emp: null });
        setSuccessMsg('Employee updated successfully!');
        setTimeout(() => setSuccessMsg(''), 2000);
      }
    } catch (err) {
      setError('Failed to update employee.');
    }
  };

  const handleAddEmployee = async () => {
    try {
      const { username, fullName, email, password, department, designation, employeeType, basicSalary, role } = newEmployee;

      if (!username || !email || !password || !department || !designation || !employeeType || !basicSalary || !role) {
        setError('Please fill all required fields.');
        return;
      }

      const payload = {
        username,
        fullName,
        email,
        password,
        department,
        designation,
        employeeType,
        role,
        basicSalary: Number(basicSalary)
      };

      console.log("Adding employee:", payload); 

      await addEmployee(payload);

      const employeesRes = await getAllEmployees();
      const employeesArr = Array.isArray(employeesRes?.data) ? employeesRes.data : (employeesRes?.data?.employees || []);
      setEmployees(employeesArr);
      setAddModal(false);
      setNewEmployee({ username: '', fullName: '', email: '', department: '', designation: '', employeeType: '', basicSalary: '', password: '', role: 'employee' });
      setSuccessMsg('Employee added successfully!');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      console.error("Add employee error:", err.response?.data || err.message);
      setError('Failed to add employee: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp._id !== id));
    } catch (err) {
      setError('Failed to delete employee.');
    }
  };

  return (
    <div className="manage-employees-container">
      <div className="manage-employees-header">
        <h2 className="manage-employees-title">Manage Employees</h2>
        <button className="add-employee-button" onClick={() => setAddModal(true)}>+ Add Employee</button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      {successMsg && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{successMsg}</div>}

      <div className="employee-grid">
        {employees.length > 0 ? (
          employees.map(emp => (
            <div key={emp._id} className="employee-card">
              <h3>{emp.fullName || emp.username || emp.name}</h3>
              <p>{emp.email}</p>
              <p>Role: {emp.role}</p>
              <p>Department: {emp.department}</p>
              <p>Designation: {emp.designation}</p>
              <p>Type: {emp.employeeType}</p>
              <p>Salary: ₹{emp.basicSalary}</p>
              <div className="actions">
                <button className=" edit " onClick={() => handleEdit(emp._id)}>Edit</button>
                <button className=" delete " onClick={() => handleDelete(emp._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-employees">No employees found.</div>
        )}
      </div>

      {editModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Employee</h3>
            <label>Role:
              <select value={editFields.role} onChange={e => setEditFields(f => ({ ...f, role: e.target.value }))}>
                <option value="">Select</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </label>
            <label>Department:
              <select value={editFields.department} onChange={e => setEditFields(f => ({ ...f, department: e.target.value }))}>
                <option value="">Select</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </label>
            <label>Designation:
              <select value={editFields.designation} onChange={e => setEditFields(f => ({ ...f, designation: e.target.value }))}>
                <option value="">Select</option>
                <option value="Software Developer">Software Developer</option>
                <option value="HR Executive">HR Executive</option>
                <option value="Accountant">Accountant</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="Marketing Specialist">Marketing Specialist</option>
              </select>
            </label>
            <label>Type:
              <select value={editFields.employeeType} onChange={e => setEditFields(f => ({ ...f, employeeType: e.target.value }))}>
                <option value="">Select</option>
                <option value="Permanent">Permanent</option>
                <option value="Intern">Intern</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </label>
            {editFields.role === 'manager' && (
              <label>Password for Manager:
                <input
                  type="password"
                  value={editFields.password}
                  onChange={e => setEditFields(f => ({ ...f, password: e.target.value }))}
                  placeholder="Set manager password"
                  required
                  style={{ width: '100%', marginTop: '6px' }}
                />
              </label>
            )}
            <div style={{ marginTop: '1rem' }}>
              <button onClick={handleEditSave}>Save</button>
              <button onClick={() => setEditModal({ open: false, emp: null })} style={{ marginLeft: '1rem' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {addModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Employee</h3>
            <label>Username:
              <input type="text" value={newEmployee.username} onChange={e => setNewEmployee(f => ({ ...f, username: e.target.value }))} required />
            </label>
            <label>Full Name:
              <input type="text" value={newEmployee.fullName} onChange={e => setNewEmployee(f => ({ ...f, fullName: e.target.value }))} />
            </label>
            <label>Email:
              <input type="email" value={newEmployee.email} onChange={e => setNewEmployee(f => ({ ...f, email: e.target.value }))} />
            </label>
            <label>Password:
              <input type="password" value={newEmployee.password} onChange={e => setNewEmployee(f => ({ ...f, password: e.target.value }))} />
            </label>
            <label>Department:
              <select value={newEmployee.department} onChange={e => setNewEmployee(f => ({ ...f, department: e.target.value }))}>
                <option value="">Select</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </label>
            <label>Designation:
              <select value={newEmployee.designation} onChange={e => setNewEmployee(f => ({ ...f, designation: e.target.value }))}>
                <option value="">Select</option>
                <option value="Software Developer">Software Developer</option>
                <option value="HR Executive">HR Executive</option>
                <option value="Accountant">Accountant</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="Marketing Specialist">Marketing Specialist</option>
              </select>
            </label>
            <label>Type:
              <select value={newEmployee.employeeType} onChange={e => setNewEmployee(f => ({ ...f, employeeType: e.target.value }))}>
                <option value="">Select</option>
                <option value="Permanent">Permanent</option>
                <option value="Intern">Intern</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </label>
            <label>Salary:
              <input type="number" value={newEmployee.basicSalary} onChange={e => setNewEmployee(f => ({ ...f, basicSalary: e.target.value }))} />
            </label>
            <label>Role:
              <select value={newEmployee.role} onChange={e => setNewEmployee(f => ({ ...f, role: e.target.value }))}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </label>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={handleAddEmployee}> Add </button>
              <button onClick={() => setAddModal(false)} style={{ marginLeft: '1rem' }}> Cancel </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployees;