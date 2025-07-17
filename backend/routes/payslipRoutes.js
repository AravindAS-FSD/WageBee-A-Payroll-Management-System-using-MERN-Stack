import express from 'express';
import Payslip from '../models/Payslip.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { employeeId } = req.query;
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    const payslips = await Payslip.find({ employee: employeeId }).sort({ createdAt: -1 });
    res.json(payslips);
  } catch (err) {
    console.error('❌ Failed to fetch payslips:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/download', async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id);
    if (!payslip) return res.status(404).json({ error: 'Payslip not found' });
    res.send(`Download not implemented yet for ${req.params.id}`);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
