import Payslip from '../models/Payslip.js';
import Employee from '../models/Employee.js';

export const generatePayslip = async (req, res) => {
  try {
    const {
      employeeId,
      month,
      year,
      basicSalary,
      allowances = 0,
      deductions = 0
    } = req.body;

    const netSalary = basicSalary + allowances - deductions;

    const payslip = new Payslip({
      employee: employeeId,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      netSalary
    });

    await payslip.save();
    res.status(201).json(payslip);
  } catch (err) {
    console.error('Error generating payslip:', err.message);
    res.status(400).json({ message: 'Failed to generate payslip', error: err.message });
  }
};

export const getMyPayslips = async (req, res) => {
  try {
    const employeeId = req.user.userId;

    const slips = await Payslip.find({ employee: employeeId })
      .sort({ issuedDate: -1 });

    res.json(slips);
  } catch (err) {
    console.error('Error fetching my payslips:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllPayslips = async (req, res) => {
  try {
    const slips = await Payslip.find()
      .populate('employee', 'fullName username email')
      .sort({ issuedDate: -1 });

    res.json(slips);
  } catch (err) {
    console.error('Error fetching all payslips:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
