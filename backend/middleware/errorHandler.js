import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';
import Manager from '../models/Manager.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.userId, role: payload.role };

    const Model = payload.role === 'manager' ? Manager : Employee;
    req.currentUser = await Model.findById(payload.userId).select('-password');
    if (!req.currentUser) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized', error: err.message });
  }
};

export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
};

export default errorHandler;