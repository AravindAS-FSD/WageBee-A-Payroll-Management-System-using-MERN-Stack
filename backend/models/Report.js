import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },
  period:      { type: String, required: true }, // e.g. "2025-03" or "2025"
  type:        { type: String, enum: ['Monthly','Yearly'], required: true },
  data:        { type: Object, required: true },  // aggregated payroll data
  fileUrl:     { type: String },                  // location of generated PDF/Excel
}, { timestamps: true });

const Report = mongoose.model('Report', ReportSchema);
export default Report;
