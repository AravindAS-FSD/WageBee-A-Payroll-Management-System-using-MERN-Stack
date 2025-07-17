import express from 'express';
import Report from '../models/Report.js';
import { verifyToken } from '../middleware/authMiddleware.js';
//import Manager from '../models/Manager.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const reports = await Report.find().populate('generatedBy', 'name email');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { period, type, data } = req.body;

    const report = new Report({
      generatedBy: req.user.userId,
      period,
      type,
      data,
      fileUrl: '', 
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ message: 'Error generating report' });
  }
});

export default router;
