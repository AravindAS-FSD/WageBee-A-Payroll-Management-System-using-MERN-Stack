import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  password: {
    type: String,
    required: true
  },
  
  fullName: String,
  
  department: String,
  
  designation: String,

  employeeType: {
    type: String,
    enum: ['Permanent', 'Contract', 'Intern', 'Part Time'],
    default: 'Permanent'
  },
  
  basicSalary: {
    type: Number,
    required: true
  },

  salary: {
    type: Number,
    default: 0
  },

  joinDate: {
    type: Date,
    default: Date.now
  },

  role: {
    type: String,
    enum: ['employee', 'manager'], 
    required: true
  }
});

employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
