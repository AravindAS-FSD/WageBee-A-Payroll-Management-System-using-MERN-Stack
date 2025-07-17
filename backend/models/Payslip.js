import mongoose from 'mongoose';

const PayslipSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    month: {
      type: String,
      required: true,
      enum: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2099
    },
    basicSalary: {
      type: Number,
      required: true,
      min: 0
    },
    allowances: {
      type: Number,
      default: 0,
      min: 0
    },
    deductions: {
      type: Number,
      default: 0,
      min: 0
    },
    netSalary: {
      type: Number,
      required: true,
      min: 0
    },
    issuedDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Payslip = mongoose.model('Payslip', PayslipSchema);
export default Payslip;
