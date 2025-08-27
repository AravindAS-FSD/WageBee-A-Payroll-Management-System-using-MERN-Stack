import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import payslipRoutes from './routes/payslipRoutes.js';

dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://wagebee.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payslips', payslipRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
