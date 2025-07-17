import express from 'express';
import { getMyPayslips, getAllPayslips } from '../controllers/payslipController.js';
import { restrictTo, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, restrictTo('employee'), getMyPayslips);

router.get('/all', protect, restrictTo('manager'), getAllPayslips);

export default router;
