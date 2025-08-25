import Employee from '../models/Employee.js';
import Manager from '../models/Manager.js';

export const promoteToManager = async (req, res) => {
  console.log('promoteToManager route hit:', req.method, req.url, req.body);
  try {
    const { password } = req.body;
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });

    const manager = new Manager({
      username: emp.username,
      email: emp.email,
      fullName: emp.fullName,
      password,
      role: 'Manager',
      accessLevel: 'HR',
    });
    await manager.save();

    await Employee.findByIdAndDelete(emp._id);

    await Notification.create({
      user: manager._id,
      userModel: 'Manager',
      message: 'Congratulations! You have been promoted to Manager. Please check your new login credentials.',
    });

    res.status(200).json({ message: 'Employee promoted to manager, removed from employees, and notified!' });
  } catch (err) {
    console.error('Error in promoteToManager:', err);
    res.status(500).json({ message: 'Error promoting employee to manager', error: err.message });
  }
};

export const addEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-password');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
