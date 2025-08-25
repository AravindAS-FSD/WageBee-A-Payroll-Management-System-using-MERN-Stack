import Payslip from '../models/Payslip.js';
import Employee from '../models/Employee.js';
import path from 'path';
import { fileURLToPath } from 'url';

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

    const existingPayslip = await Payslip.findOne({ employee: employeeId, month, year });
    if (existingPayslip) {
      return res.status(400).json({ message: 'Payslip already exists for this employee, month, and year.' });
    }

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
    res.status(201).json({ message: 'Payslip generated successfully', payslip });
  } catch (err) {
    console.error('Error generating payslip:', err.message);
    res.status(400).json({ message: 'Failed to generate payslip', error: err.message });
  }
};

export const getMyPayslips = async (req, res) => {
  try {
    const employeeId = req.user.userId;

    const slips = await Payslip.find({ employee: employeeId }).sort({ issuedDate: -1 });

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

export const getPayslipsByMonthAndYear = async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;

    const payslip = await Payslip.findOne({ employee: employeeId, month, year })
      .populate('employee', 'fullName username email');

    if (!payslip) {
      return res.status(404).json({ message: 'Payslip not found for the given details' });
    }

    res.json(payslip);
  } catch (err) {
    console.error('Error fetching payslip by employee and month:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePayslip = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      basicSalary,
      allowances = 0,
      deductions = 0,
    } = req.body;

    const payslip = await Payslip.findById(id);

    if (!payslip) {
      return res.status(404).json({ message: 'Payslip not found' });
    }

    payslip.basicSalary = basicSalary;
    payslip.allowances = allowances;
    payslip.deductions = deductions;
    payslip.netSalary = basicSalary + allowances - deductions;

    await payslip.save();

    res.json({ message: 'Payslip updated successfully', payslip });
  } catch (err) {
    console.error('Error updating payslip:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkExistingPayslip = async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;
    if (!employeeId || !month || !year) {
      return res.status(400).json({ message: 'Missing employeeId, month, or year' });
    }

    const slip = await Payslip.findOne({ employee: employeeId, month, year });
    if (slip) {
      return res.status(200).json(slip);
    } else {
      return res.status(404).json({ message: 'Payslip not found' });
    }
  } catch (err) {
    console.error('Error checking payslip:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPendingPayrollsForCurrentMonth = async (req, res) => {
  try {
    const month = moment().month(); // current month (0-indexed)
    const year = moment().year();

    const allEmployees = await Employee.find();
    const payslips = await Payslip.find({ month, year });

    const paidEmployeeIds = payslips.map(p => p.employee.toString());

    const pending = allEmployees.filter(emp => !paidEmployeeIds.includes(emp._id.toString()));

    res.status(200).json(pending);
  } catch (error) {
    console.error('Error fetching pending payrolls:', error);
    res.status(500).json({ message: 'Server error while fetching pending payrolls' });
  }
};

export const deletePayslip = async (req, res) => {
  try {
    const payslip = await Payslip.findByIdAndDelete(req.params.id);

    if (!payslip) {
      return res.status(404).json({ message: 'Payslip not found' });
    }

    res.status(200).json({ message: 'Payslip deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadPayslip = async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id);

    if (!payslip || !payslip.filePath) {
      return res.status(404).json({ error: 'Payslip or file not found' });
    }

    const filePath = path.join(__dirname, '../uploads', payslip.filePath);
    res.download(filePath);
  } catch (error) {
    console.error('❌ Error downloading payslip:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
