import Report from '../models/Report.js';
import Payslip from '../models/Payslip.js';

export const generateReport = async (req, res) => {
  try {
    const { period, type } = req.body;
    const matchField = type === 'Monthly' ? 'month' : 'year';
    const pipeline = [
      { $match: { [matchField]: period } },
      {
        $lookup: {
          from: 'employees',
          localField: 'employee',
          foreignField: '_id',
          as: 'employeeDetails'
        }
      },
      { $unwind: '$employeeDetails' },
      {
        $group: {
          _id: '$employee',
          name: { $first: '$employeeDetails.name' },
          totalSalary: { $sum: '$netSalary' }
        }
      }
    ];
    const data = await Payslip.aggregate(pipeline);
    const reportData = data.reduce((acc, cur) => {
      acc[cur._id] = {
        name: cur.name,
        totalSalary: cur.totalSalary
      };
      return acc;
    }, {});
    const report = new Report({
      generatedBy: req.user.userId,
      period,
      type,
      data: reportData
    });
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const reps = await Report.find().populate('generatedBy', 'name');
    res.json(reps);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
