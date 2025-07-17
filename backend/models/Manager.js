import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const managerSchema = new mongoose.Schema({
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

  fullName: {
    type: String
  },

  role: {
    type: String,
    default: 'Manager'
  },

  accessLevel: {
    type: String,
    enum: ['HR', 'Admin'],
    default: 'HR'
  }
});

managerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Manager = mongoose.model('Manager', managerSchema);
export default Manager;
