import express from 'express';
import PDFDocument from 'pdfkit';
import Payslip from '../models/Payslip.js';
import {
  generatePayslip,
  getMyPayslips,
  getAllPayslips,
  getPayslipsByMonthAndYear,
  updatePayslip,
  checkExistingPayslip,
  getPendingPayrollsForCurrentMonth,
  deletePayslip
} from '../controllers/payslipController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, restrictTo('employee'), getMyPayslips);

router.get('/all', protect, restrictTo('manager'), getAllPayslips);

router.post('/generate', protect, restrictTo('manager'), generatePayslip);

router.get('/check', protect, restrictTo('manager'), checkExistingPayslip);

router.get('/employee', protect, restrictTo('manager'), getPayslipsByMonthAndYear);

router.put('/update/:id', protect, restrictTo('manager'), updatePayslip);

router.get('/pending/current', protect, restrictTo('manager'), getPendingPayrollsForCurrentMonth);

router.delete('/:id', protect, restrictTo('manager'), deletePayslip);

router.get('/:id/download', protect, async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id).populate('employeeId');
    if (!payslip) return res.status(404).send('Payslip not found');

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${payslip.month}_${payslip.year}_Payslip.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text('Employee Payslip', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Month: ${payslip.month}`);
    doc.text(`Year: ${payslip.year}`);
    doc.text(`Employee ID: ${payslip.employeeId?._id || payslip.employeeId}`);
    doc.text(`Net Salary: ₹${payslip.netSalary}`);
    doc.text(`Status: ${payslip.status}`);
    doc.end();
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).send('Server Error');
  }
});

export default router;
